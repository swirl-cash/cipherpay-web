import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, readSession } from '@/lib/genesis-session';
import { ensureSeat, markT3, statsFor } from '@/lib/genesis-store';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* T3 verification — zero-cost path via X's public oEmbed endpoint.
   The posted tweet must (a) belong to the session's own X account and
   (b) carry the seat's personal invite code, so one post can never be
   recycled across seats. No paid API tier involved. */
export async function POST(req: NextRequest) {
  if (!rateLimit(`vpo:${clientIp(req)}`, 6, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }
  const s = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!s) return NextResponse.json({ error: 'not_connected' }, { status: 401 });

  let url: string;
  try {
    url = String((await req.json()).url || '');
  } catch {
    return NextResponse.json({ error: 'bad_request' }, { status: 400 });
  }
  if (!/^https?:\/\/(www\.)?(twitter|x)\.com\/[A-Za-z0-9_]{1,20}\/status\/\d+/.test(url)) {
    return NextResponse.json({ error: 'not_a_tweet_url' }, { status: 400 });
  }

  const stats = statsFor(s.id);
  if (!stats) return NextResponse.json({ error: 'no_seat' }, { status: 400 });

  let oe: { html?: string; author_url?: string };
  try {
    const r = await fetch(
      `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`,
      { cache: 'no-store' },
    );
    if (!r.ok) {
      return NextResponse.json(
        { error: 'tweet_not_found', detail: `oembed ${r.status}` },
        { status: 422 },
      );
    }
    oe = await r.json();
  } catch (e) {
    return NextResponse.json({ error: 'upstream_failed', detail: String(e) }, { status: 502 });
  }

  const authorHandle = (oe.author_url || '').split('/').filter(Boolean).pop() || '';
  if (authorHandle.toLowerCase() !== s.handle.toLowerCase()) {
    return NextResponse.json(
      { ok: false, verified: false, reason: 'not_your_tweet', author: authorHandle },
      { status: 200 },
    );
  }
  const htmlRaw = oe.html || '';
  const code = stats.code.toUpperCase();
  let found = htmlRaw.toUpperCase().includes(code);
  if (!found) {
    // display text truncates long URLs — resolve t.co hops and check the real targets
    const hops = Array.from(htmlRaw.matchAll(/href="(https:\/\/t\.co\/[^"]+)"/g)).map((m) => m[1]);
    for (const hop of hops.slice(0, 6)) {
      try {
        const r = await fetch(hop, { redirect: 'manual', cache: 'no-store' });
        const loc = r.headers.get('location') || '';
        if (loc.toUpperCase().includes(code)) { found = true; break; }
      } catch { /* one dead hop does not sink the check */ }
    }
  }
  if (!found) {
    return NextResponse.json(
      { ok: false, verified: false, reason: 'code_missing', need: stats.code },
      { status: 200 },
    );
  }

  ensureSeat({ id: s.id, handle: s.handle, name: s.name, avatar: s.avatar || '' });
  markT3(s.id);
  return NextResponse.json({ ok: true, verified: true });
}
