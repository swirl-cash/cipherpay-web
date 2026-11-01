import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, readSession } from '@/lib/genesis-session';
import { ensureSeat, submitFeatured } from '@/lib/genesis-store';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TWEET_URL = /^https?:\/\/(x\.com|twitter\.com)\/[^/]+\/status\/\d+/;

/* Featured post: user publishes a standout post about SWIRL and pastes the
   link. Goes into a manual review queue; approval grants +5,000 vSWIRL once.
   OG seats already hold their grant and are excluded from the reward. */
export async function POST(req: NextRequest) {
  const s = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!s) return NextResponse.json({ error: 'not_connected' }, { status: 401 });
  if (!rateLimit(`feat:${s.id}`, 5, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  let url = '';
  try {
    const body = await req.json();
    if (typeof body?.url === 'string') url = body.url.trim();
  } catch { /* fall through to bad_url */ }
  if (!TWEET_URL.test(url)) {
    return NextResponse.json({ error: 'bad_url' }, { status: 400 });
  }

  ensureSeat({ id: s.id, handle: s.handle, name: s.name, avatar: s.avatar || '' });
  const result = submitFeatured(s.id, url);
  if (!result.ok) {
    return NextResponse.json({ error: result.reason }, { status: 409 });
  }
  return NextResponse.json({ ok: true, status: 'pending' });
}
