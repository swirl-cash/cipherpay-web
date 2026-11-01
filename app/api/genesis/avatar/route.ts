import { NextRequest, NextResponse } from 'next/server';
import { trustedXAvatarUrl } from '@/lib/genesis-avatar';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_AVATAR_BYTES = 8 * 1024 * 1024;
const DEFAULT_AVATAR = 'https://abs.twimg.com/sticky/default_profile_images/default_profile_normal.png';
const imageRequest = () => ({
  headers: { Accept: 'image/avif,image/webp,image/png,image/jpeg,image/*' },
  redirect: 'error' as const,
  signal: AbortSignal.timeout(12_000),
  next: { revalidate: 86_400 },
});

export async function GET(req: NextRequest) {
  const source = trustedXAvatarUrl(req.nextUrl.searchParams.get('src') || '');
  if (!source) return NextResponse.json({ error: 'invalid_avatar' }, { status: 400 });

  try {
    let upstream = await fetch(source, imageRequest());
    // X invalidates old profile-image URLs after a user changes their avatar.
    // Keep the leaderboard intact with X's standard default until their next login.
    if (!upstream.ok && [403, 404, 410].includes(upstream.status)) {
      upstream = await fetch(DEFAULT_AVATAR, imageRequest());
    }
    if (!upstream.ok) return NextResponse.json({ error: 'avatar_unavailable' }, { status: 502 });

    const contentType = upstream.headers.get('content-type') || '';
    const contentLength = Number(upstream.headers.get('content-length') || 0);
    if (!contentType.toLowerCase().startsWith('image/') || contentLength > MAX_AVATAR_BYTES) {
      return NextResponse.json({ error: 'invalid_avatar_response' }, { status: 502 });
    }

    const bytes = await upstream.arrayBuffer();
    if (bytes.byteLength === 0 || bytes.byteLength > MAX_AVATAR_BYTES) {
      return NextResponse.json({ error: 'invalid_avatar_size' }, { status: 502 });
    }

    return new NextResponse(bytes, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json({ error: 'avatar_unavailable' }, { status: 502 });
  }
}
