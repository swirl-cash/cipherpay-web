import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Wallet collection was retired. Genesis participation now uses X only. */
export async function POST() {
  return NextResponse.json({ error: 'wallet_collection_removed' }, { status: 410 });
}
