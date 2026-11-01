const AVATAR_HOSTS = new Set(['pbs.twimg.com', 'abs.twimg.com']);

export function trustedXAvatarUrl(raw: string): URL | null {
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || !AVATAR_HOSTS.has(url.hostname)) return null;
    return url;
  } catch {
    return null;
  }
}

/* Load X profile images through our own origin so browser privacy tools,
   regional network filtering and third-party image failures do not blank them. */
export function genesisAvatarUrl(raw: string): string {
  if (!trustedXAvatarUrl(raw)) return '';
  return `/api/genesis/avatar?src=${encodeURIComponent(raw)}`;
}
