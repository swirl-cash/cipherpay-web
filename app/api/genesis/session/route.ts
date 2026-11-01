import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, readSession } from '@/lib/genesis-session';
import { getSeatAvatar } from '@/lib/genesis-store';
import { genesisAvatarUrl } from '@/lib/genesis-avatar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const s = readSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!s) return NextResponse.json({ ok: false }, { status: 401 });
  const avatar = s.avatar || getSeatAvatar(s.id);
  return NextResponse.json({ ok: true, id: s.id, handle: s.handle, name: s.name, avatar: genesisAvatarUrl(avatar) });
}

export async function POST(req: NextRequest) {
  // logout
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(SESSION_COOKIE);
  return res;
}
