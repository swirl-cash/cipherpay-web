import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, readSession } from '@/lib/genesis-session';
import { ensureSeat, markT2 } from '@/lib/genesis-store';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* T2 — like + repost the pinned announcement. Attestation-based for now:
   the seat confirms on-chain of trust; abuse is pruned at snapshot review. */
export async function POST(req: NextRequest) {
  const s = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!s) return NextResponse.json({ error: 'not_connected' }, { status: 401 });
  if (!rateLimit(`vbt:${s.id}`, 10, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }
  ensureSeat({ id: s.id, handle: s.handle, name: s.name, avatar: s.avatar || '' });
  markT2(s.id);
  return NextResponse.json({ ok: true, t2: true });
}
