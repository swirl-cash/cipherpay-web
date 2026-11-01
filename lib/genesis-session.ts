import { createHmac, randomBytes, createHash } from 'node:crypto';

export const SESSION_COOKIE = 'sbt20_gs';
export const PKCE_COOKIE = 'sbt20_pkce';
export const STATE_COOKIE = 'sbt20_state';

const SESSION_TTL_SEC = 30 * 24 * 3600; // 30 days

function secret(): string {
  return process.env.GENESIS_SESSION_SECRET || 'sbt20-dev-only-secret';
}

function b64url(buf: Buffer | string): string {
  return Buffer.from(buf).toString('base64url');
}

export interface GenesisSession {
  id: string;       // X numeric user id
  handle: string;   // X screen name
  name: string;     // display name
  avatar: string;   // profile_image_url
  iat: number;
}

export function makePkce(): { verifier: string; challenge: string; state: string } {
  const verifier = b64url(randomBytes(32));
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const state = b64url(randomBytes(16));
  return { verifier, challenge, state };
}

export function signSession(s: Omit<GenesisSession, 'iat'>): string {
  const payload: GenesisSession = { ...s, iat: Math.floor(Date.now() / 1000) };
  const body = b64url(JSON.stringify(payload));
  const sig = createHmac('sha256', secret()).update(body).digest('base64url');
  return `${body}.${sig}`;
}

export function readSession(value: string | undefined): GenesisSession | null {
  if (!value) return null;
  const dot = value.lastIndexOf('.');
  if (dot <= 0) return null;
  const body = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  const expect = createHmac('sha256', secret()).update(body).digest('base64url');
  if (expect !== sig) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as GenesisSession;
    if (!payload.id || !payload.handle) return null;
    if (Date.now() / 1000 - payload.iat > SESSION_TTL_SEC) return null;
    return payload;
  } catch {
    return null;
  }
}
