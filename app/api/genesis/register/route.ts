import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, readSession } from '@/lib/genesis-session';
import { ensureSeat, bindReferrer, statsFor } from '@/lib/genesis-store';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Idempotent seat registration. Called by the console whenever a session
   exists: mints the fixed invite code on first sight, binds a referrer
   once when a valid ref code rides along, returns code + chain stats. */
export async function POST(req: NextRequest) {
  if (!rateLimit(`reg:${clientIp(req)}`, 30, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }
  const s = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!s) return NextResponse.json({ error: 'not_connected' }, { status: 401 });

  let ref: string | undefined;
  try {
    const body = await req.json();
    if (typeof body?.ref === 'string') ref = body.ref.trim();
  } catch { /* no body is fine */ }

  const seat = ensureSeat({ id: s.id, handle: s.handle, name: s.name, avatar: s.avatar || '' });

  let referral: { ok: boolean; reason?: string } | null = null;
  if (ref) referral = bindReferrer(s.id, ref);

  const stats = statsFor(s.id);
  return NextResponse.json({ ok: true, seat: stats, referral });
}

export async function GET(req: NextRequest) {
  const s = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!s) return NextResponse.json({ error: 'not_connected' }, { status: 401 });
  const seat = ensureSeat({ id: s.id, handle: s.handle, name: s.name, avatar: s.avatar || '' });
  return NextResponse.json({ ok: true, seat: statsFor(s.id), code: seat.code });
}
