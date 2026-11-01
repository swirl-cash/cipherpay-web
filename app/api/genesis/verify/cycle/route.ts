import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';
import { SESSION_COOKIE, readSession } from '@/lib/genesis-session';
import { bindTaskWallet, claimCycle, ensureSeat, statsFor } from '@/lib/genesis-store';
import { verifyCycle } from '@/lib/genesis-cycle';
import { rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Daily privacy cycle: Shield + Unshield as one pair on Ethereum mainnet,
   +150 vSWIRL once per UTC day. The pair is verified on-chain against our
   own Indexer and public mainnet RPCs — the submitted address must be the
   shield sender and either the unshield sender (direct) or its public
   recipient (relayer submission). One claim per address per day. */
export async function POST(req: NextRequest) {
  const s = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!s) return NextResponse.json({ error: 'not_connected' }, { status: 401 });
  if (!rateLimit(`cycle:${s.id}`, 6, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }

  let address = '';
  try {
    address = String((await req.json())?.address ?? '').trim();
  } catch { /* no body */ }
  if (!ethers.isAddress(address)) {
    return NextResponse.json({ ok: false, reason: 'bad_address' }, { status: 400 });
  }

  ensureSeat({ id: s.id, handle: s.handle, name: s.name, avatar: s.avatar || '' });
  bindTaskWallet(s.id, address);

  const stats = statsFor(s.id);
  if (stats?.cycleClaimedToday) {
    return NextResponse.json({ ok: true, already: true, days: stats.cycleDays });
  }

  let result;
  try {
    result = await verifyCycle(address);
  } catch {
    return NextResponse.json({ ok: false, reason: 'verify_unavailable' }, { status: 502 });
  }
  if (!result.ok) return NextResponse.json(result);

  const claim = claimCycle(s.id, address);
  return NextResponse.json({ ...claim, shieldTx: result.shieldTx, unshieldTx: result.unshieldTx });
}
