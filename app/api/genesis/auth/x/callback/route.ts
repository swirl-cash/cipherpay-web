import { NextRequest, NextResponse } from 'next/server';
import { PKCE_COOKIE, STATE_COOKIE, SESSION_COOKIE, signSession } from '@/lib/genesis-session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Step 2 of X OAuth 2.0 (PKCE): swap the code for a token, read the handle,
   mint a signed session cookie, send the user back to the console. */
export async function GET(req: NextRequest) {
  const origin = process.env.GENESIS_ORIGIN || new URL(req.url).origin;
  const fail = (reason: string) =>
    NextResponse.redirect(`${origin}/genesis?auth_error=${encodeURIComponent(reason)}`);

  const clientId = process.env.X_CLIENT_ID;
  const clientSecret = process.env.X_CLIENT_SECRET;
  if (!clientId || !clientSecret) return fail('oauth_not_configured');

  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const pkce = req.cookies.get(PKCE_COOKIE)?.value;
  const expectState = req.cookies.get(STATE_COOKIE)?.value;
  if (!code || !state || !pkce || !expectState || state !== expectState) {
    return fail('bad_state');
  }

  const redirectUri = `${origin}/api/genesis/auth/x/callback`;
  const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: pkce,
    }),
  });
  if (!tokenRes.ok) return fail('token_exchange');
  const token = (await tokenRes.json()) as { access_token?: string };
  if (!token.access_token) return fail('token_exchange');

  const meRes = await fetch(
    'https://api.twitter.com/2/users/me?user.fields=id,name,username,profile_image_url',
    { headers: { Authorization: `Bearer ${token.access_token}` } },
  );
  if (!meRes.ok) {
    const body = await meRes.text().catch(() => '');
    console.error('[genesis] users/me failed:', meRes.status, body.slice(0, 300));
    return fail(`user_lookup_${meRes.status}`);
  }
  const me = (await meRes.json()) as {
    data?: { id: string; username: string; name: string; profile_image_url?: string };
  };
  if (!me.data) return fail('user_lookup_empty');

  const session = signSession({
    id: me.data.id,
    handle: me.data.username,
    name: me.data.name,
    avatar: me.data.profile_image_url || '',
  });

  const res = NextResponse.redirect(`${origin}/genesis?connected=1`);
  res.cookies.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 30 * 24 * 3600,
    path: '/',
  });
  res.cookies.delete(PKCE_COOKIE);
  res.cookies.delete(STATE_COOKIE);
  return res;
}
