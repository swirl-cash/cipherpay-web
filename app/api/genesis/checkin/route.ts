import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, readSession } from '@/lib/genesis-session';
import { ensureSeat, checkin } from '@/lib/genesis-store';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Daily check-in: +5 vSWIRL once per UTC day. Idempotent per day — calling
   twice on the same day returns already:true without double-counting. */
export async function POST(req: NextRequest) {
  const s = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!s) return NextResponse.json({ error: 'not_connected' }, { status: 401 });
  if (!rateLimit(`chk:${s.id}`, 10, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  ensureSeat({ id: s.id, handle: s.handle, name: s.name, avatar: s.avatar || '' });
  const result = checkin(s.id);
  return NextResponse.json(result);
}
