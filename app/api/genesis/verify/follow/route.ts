import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, readSession } from '@/lib/genesis-session';
import { ensureSeat, markT1 } from '@/lib/genesis-store';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TARGET_SCREEN = process.env.GENESIS_TARGET_X || 'swirlbtc';
const SD_BASE = 'https://api.socialdata.tools';

let cachedTargetId: string | null = null;

async function socialdata(path: string, key: string) {
  const r = await fetch(`${SD_BASE}${path}`, {
    headers: { Authorization: `Bearer ${key}`, Accept: 'application/json' },
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`socialdata ${r.status}`);
  return r.json();
}

async function targetId(key: string): Promise<string> {
  if (cachedTargetId) return cachedTargetId;
  const u = await socialdata(`/twitter/user/${TARGET_SCREEN}`, key);
  cachedTargetId = String(u.id_str || u.id);
  return cachedTargetId;
}

/* Real verification: is the session's X account following @swirlbtc?
   Server-side only — the SocialData key never reaches the browser. */
export async function POST(req: NextRequest) {
  const key = process.env.SOCIALDATA_API_KEY;
  if (!key) {
    return NextResponse.json({ error: 'verification not configured' }, { status: 503 });
  }
  const s = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!s) return NextResponse.json({ error: 'not_connected' }, { status: 401 });
  // upstream calls are metered — keep retries honest
  if (!rateLimit(`vfw:${clientIp(req)}`, 6, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  try {
    const tid = await targetId(key);
    const r = await socialdata(`/twitter/user/${s.id}/following/${tid}`, key);
    const following = !!r.is_following;
    if (following) {
      ensureSeat({ id: s.id, handle: s.handle, name: s.name, avatar: s.avatar || '' });
      markT1(s.id);
    }
    return NextResponse.json({ ok: true, following, handle: s.handle, target: TARGET_SCREEN });
  } catch (e) {
    return NextResponse.json({ error: 'upstream_failed', detail: String(e) }, { status: 502 });
  }
}
