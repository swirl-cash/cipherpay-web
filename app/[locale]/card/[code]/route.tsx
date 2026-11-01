import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import fs from 'node:fs';
import path from 'node:path';
import { lookupByCode } from '@/lib/genesis-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* Per-seat share card — the og:image behind every invite link. X renders
   this as the big card under the post; whoever posts, the card is theirs. */

const PUB = path.join(process.cwd(), 'public');

let fonts: { sg: Buffer; pm: Buffer } | null = null;
function loadFonts() {
  if (!fonts) {
    fonts = {
      sg: fs.readFileSync(path.join(PUB, 'fonts', 'SpaceGrotesk-Bold.woff')),
      pm: fs.readFileSync(path.join(PUB, 'fonts', 'IBMPlexMono-Medium.woff')),
    };
  }
  return fonts;
}

let heroB64: string | null = null;
function loadHero(): string {
  if (!heroB64) {
    heroB64 = `data:image/png;base64,${fs.readFileSync(path.join(PUB, 'hero-card.png')).toString('base64')}`;
  }
  return heroB64;
}

async function avatarB64(url: string): Promise<string | null> {
  if (!url) return null;
  try {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) return null;
    const buf = Buffer.from(await r.arrayBuffer());
    const mime = r.headers.get('content-type') || 'image/jpeg';
    return `data:${mime};base64,${buf.toString('base64')}`;
  } catch {
    return null;
  }
}

export async function GET(_req: NextRequest, ctx: { params: Promise<{ code: string }> }) {
  const { code } = await ctx.params;
  const seat = lookupByCode(code);
  const handle = seat ? `@${seat.handle}` : '@anonymous';
  const seatCode = seat ? seat.code : 'SWIRL-····';
  const avatar = seat ? await avatarB64(seat.avatar) : null;
  const f = loadFonts();

  const img = new ImageResponse(
    (
      <div
        style={{
          width: '1200px', height: '630px', display: 'flex', position: 'relative',
          background: '#030509', color: '#e6edf3', fontFamily: 'Space Grotesk',
        }}
      >
        {/* pixel-vortex artwork — pre-composed full-bleed 1200x630
            (satori cannot size inset:0 boxes — explicit l/t/w/h required) */}
        <div style={{
          position: 'absolute', left: 0, top: 0, width: '1200px', height: '630px',
          backgroundImage: `url(${loadHero()})`, backgroundSize: '1200px 630px',
          display: 'flex',
        }} />
        {/* cyan aura behind the vortex */}
        <div style={{
          position: 'absolute', right: -120, top: -80, width: '720px', height: '790px',
          borderRadius: '400px', display: 'flex',
          background: 'radial-gradient(circle, rgba(0,212,255,0.22) 0%, rgba(0,212,255,0.07) 45%, rgba(0,0,0,0) 70%)',
        }} />
        {/* readability shade — keeps the left dark, lets the vortex breathe on the right */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          background: 'linear-gradient(90deg, rgba(3,5,9,0.99) 0%, rgba(3,5,9,0.94) 34%, rgba(3,5,9,0.42) 60%, rgba(3,5,9,0.02) 100%)',
        }} />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', padding: '44px 56px 40px' }}>
          {/* top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 1, display: 'flex' }}>
                SWIRL<span style={{ color: '#00D4FF' }}>&nbsp;GENESIS</span>
              </div>
              <div style={{ fontSize: 12, letterSpacing: 3, color: '#7a8b9a', marginTop: 6, fontFamily: 'IBM Plex Mono' }}>
                SILENT BITCOIN TRANSFER
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'right', fontSize: 12, letterSpacing: 2, color: '#7a8b9a', fontFamily: 'IBM Plex Mono', lineHeight: 1.9 }}>
              <span>THE FIRST 5% BELONGS TO THE FIRST</span>
              <span style={{ color: '#00D4FF' }}>LIGHTNING-NATIVE MIXING</span>
            </div>
          </div>

          {/* who */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 44 }}>
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} width={92} height={92} style={{ borderRadius: '50%', border: '3px solid #00D4FF' }} alt="" />
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: avatar ? 22 : 0 }}>
              <div style={{ fontSize: 38, fontWeight: 700 }}>{handle}</div>
              <div style={{ fontSize: 13, letterSpacing: 2, color: '#00D4FF', marginTop: 8, fontFamily: 'IBM Plex Mono' }}>
                {`GENESIS SEAT · ${seatCode}`}
              </div>
            </div>
          </div>

          {/* points */}
          <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: 26 }}>
            <div style={{ fontSize: 148, fontWeight: 700, color: '#FFC94D', letterSpacing: -4, lineHeight: 1 }}>
              +1,000
            </div>
            <div style={{ fontSize: 26, color: '#a8904f', letterSpacing: 3, marginLeft: 18, marginBottom: 14, fontFamily: 'IBM Plex Mono' }}>
              VSWIRL
            </div>
          </div>

          {/* cta */}
          <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
            <div style={{ fontSize: 30, fontWeight: 700, display: 'flex' }}>
              SWIRL<span style={{ color: '#00D4FF' }}>.</span>CASH
            </div>
            <div style={{ fontSize: 12, letterSpacing: 2, color: '#7a8b9a', marginTop: 10, fontFamily: 'IBM Plex Mono' }}>
              ENTER THROUGH THE LINK IN THE POST — WE BOTH EARN
            </div>
          </div>

          {/* footer */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', marginTop: 20, paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: 11, letterSpacing: 3,
            color: '#4d5c69', fontFamily: 'IBM Plex Mono',
          }}>
            <span>UNANNOUNCED CHANNELS IN · BLINDED PATHS OUT</span>
            <span>ZERO ON-CHAIN TRACE</span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Space Grotesk', data: f.sg, weight: 700, style: 'normal' },
        { name: 'IBM Plex Mono', data: f.pm, weight: 500, style: 'normal' },
      ],
    },
  );
  // buffer it — crawlers (X card bot) fetch more reliably with Content-Length
  const buf = await img.arrayBuffer();
  return new Response(buf, {
    headers: {
      'Content-Type': 'image/png',
      'Content-Length': String(buf.byteLength),
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  });
}
