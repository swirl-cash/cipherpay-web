import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, readSession } from '@/lib/genesis-session';
import { leaderboard, seatRank, pointsBreakdown } from '@/lib/genesis-store';
import { genesisAvatarUrl } from '@/lib/genesis-avatar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Public leaderboard — top 50 ranked seats with X profile + OG mark.
   When a session rides along, the caller's rank and point breakdown come back too. */
export async function GET(req: NextRequest) {
  const s = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  const rank = s ? seatRank(s.id) : null;
  const breakdown = s ? pointsBreakdown(s.id) : null;
  const me = rank && breakdown ? { ...rank, breakdown } : null;
  const rows = leaderboard(50).map((row) => ({ ...row, avatar: genesisAvatarUrl(row.avatar) }));
  return NextResponse.json({ ok: true, rows, me });
}
