import { NextRequest, NextResponse } from 'next/server';
import { makePkce, PKCE_COOKIE, STATE_COOKIE } from '@/lib/genesis-session';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Step 1 of X OAuth 2.0 (PKCE): park verifier+state in short-lived cookies,
   then bounce the user to X's authorize page. */
export async function GET(req: NextRequest) {
  if (!rateLimit(`authx:${clientIp(req)}`, 10, 60_000)) {
    return NextResponse.json({ error: 'rate_limited' }, { status: 429 });
  }
  const clientId = process.env.X_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: 'X OAuth is not configured on the server yet (X_CLIENT_ID missing).' },
      { status: 503 },
    );
  }

  const origin = process.env.GENESIS_ORIGIN || new URL(req.url).origin;
  const redirectUri = `${origin}/api/genesis/auth/x/callback`;
  const { verifier, challenge, state } = makePkce();

  const url = new URL('https://twitter.com/i/oauth2/authorize');
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', 'users.read tweet.read');
  url.searchParams.set('state', state);
  url.searchParams.set('code_challenge', challenge);
  url.searchParams.set('code_challenge_method', 'S256');

  const res = NextResponse.redirect(url.toString());
  const opts = { httpOnly: true, secure: true, sameSite: 'lax' as const, maxAge: 600, path: '/' };
  res.cookies.set(PKCE_COOKIE, verifier, opts);
  res.cookies.set(STATE_COOKIE, state, opts);
  return res;
}
