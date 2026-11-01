'use client';

import { useEffect, useState } from 'react';
import { DemoQR } from '@/components/DemoQR';

/* ── shared keyframes (scoped by prefix) ── */
const STYLE = `
  @keyframes sbtScan { 0% { top: 6%; opacity: 0; } 12% { opacity: 1; } 88% { opacity: 1; } 100% { top: 88%; opacity: 0; } }
  @keyframes sbtBtnPulse { 0%, 100% { background: var(--cp-cyan); color: var(--cp-bg); } 50% { background: var(--cp-cyan-dim); } }
  .sbt-scanline { position: absolute; left: 8%; right: 8%; height: 2px;
    background: linear-gradient(90deg, transparent, var(--cp-cyan), transparent);
    box-shadow: 0 0 8px rgba(0,212,255,.6); animation: sbtScan 2.6s ease-in-out infinite; }
  .sbt-btn-live { animation: sbtBtnPulse .5s ease; }
`;

const bar = (left: React.ReactNode, right: React.ReactNode) => (
  <div className="step-preview-bar">
    <span style={{ fontSize: 7, color: 'var(--cp-cyan)', fontWeight: 700, letterSpacing: 1 }}>{left}</span>
    <span style={{ fontSize: 7, color: 'var(--cp-text-dim)', letterSpacing: 1 }}>{right}</span>
  </div>
);

/* ═══════════ 1. PUBLISH — terminal typing + offer decode ═══════════ */
const ALIAS = 'satoshi';
const OFFER = 'lno1zcp8x4vq...k9w7';
const GLYPHS = 'zxcvbnmkqp0123456789';

export function StepPublishAnim() {
  const [alias, setAlias] = useState('');
  const [offer, setOffer] = useState('');
  const [pressing, setPressing] = useState(false);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const sleep = (ms: number) => new Promise<void>((r) => { timer = setTimeout(r, ms); });

    (async () => {
      while (alive) {
        // reset
        setAlias(''); setOffer(''); setPressing(false);
        await sleep(500); if (!alive) return;
        // type alias
        for (let i = 1; i <= ALIAS.length; i++) {
          setAlias(ALIAS.slice(0, i));
          await sleep(110); if (!alive) return;
        }
        await sleep(450); if (!alive) return;
        // press button
        setPressing(true);
        await sleep(550); if (!alive) return;
        setPressing(false);
        // decode offer with scramble
        for (let i = 1; i <= OFFER.length; i++) {
          const fixed = OFFER.slice(0, i);
          const tail = i < OFFER.length
            ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            : '';
          setOffer(fixed + tail);
          await sleep(46); if (!alive) return;
        }
        setOffer(OFFER);
        await sleep(2600); if (!alive) return;
      }
    })();

    return () => { alive = false; clearTimeout(timer); };
  }, []);

  return (
    <div className="step-preview" aria-hidden="true">
      <style>{STYLE}</style>
      {bar('SWIRL', 'INIT')}
      <div style={{ padding: '10px 12px' }}>
        <div className="step-preview-label">ALIAS</div>
        <div className="step-preview-input">
          {alias}
          <span style={{ color: 'var(--cp-cyan)', animation: 'sbtBlink 1s step-end infinite' }}>▍</span>
        </div>
        <div className="step-preview-label" style={{ marginTop: 6 }}>STATIC PAYMENT CODE</div>
        <div className="step-preview-input" style={{ color: offer === OFFER ? 'var(--cp-cyan)' : 'var(--cp-text-dim)', fontSize: 8 }}>
          {offer || '· · · · · · · · · ·'}
        </div>
        <div className="step-preview-label" style={{ marginTop: 6 }}>NODE PUBKEY</div>
        <div className="step-preview-input">
          <span style={{ letterSpacing: 2, color: 'var(--cp-text-dim)' }}>never revealed</span>
        </div>
        <div className={`step-preview-btn${pressing ? ' sbt-btn-live' : ''}`}>CREATE OFFER</div>
      </div>
      <style>{`@keyframes sbtBlink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }`}</style>
    </div>
  );
}

/* ═══════════ 2. MIX — packet travels the hops ═══════════ */
const HOPS: Array<[string, string, string, string]> = [
  ['Hop 01 · entry', 'blinded path established', '1,000,000', 'sats'],
  ['Hop 02 · relay', 'sender ↔ receiver severed', 'blinded', 'route'],
  ['Hop 03 · exit', 'payer identity stripped', 'blinded', 'route'],
  ['Loop-out · swap', 'submarine · fresh UTXO out', '0.01', 'BTC'],
  ['Settled', 'in ≠ out · no trace on-chain', '✓ 2.1s', '21 sats fee'],
];

export function StepMixAnim() {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    let i = -1;
    const id = setInterval(() => {
      i += 1;
      if (i > HOPS.length + 1) i = -1; // hold on "settled", then reset
      setActive(i >= HOPS.length ? HOPS.length - 1 : i);
    }, 850);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="step-preview" aria-hidden="true">
      {bar('MIX ROUTES', `${Math.max(active + 1, 0)}/${HOPS.length} HOPS`)}
      <div style={{ padding: '6px 12px' }}>
        {HOPS.map(([title, desc, v1, v2], idx) => {
          const on = idx === active;
          const done = idx < active;
          return (
            <div
              key={title}
              className="step-preview-product"
              style={{
                borderLeft: `2px solid ${on ? 'var(--cp-cyan)' : done ? 'var(--cp-green)' : 'transparent'}`,
                paddingLeft: 6,
                transition: 'border-color .3s',
                opacity: active === -1 || on || done ? 1 : 0.45,
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 9, color: on ? 'var(--cp-cyan)' : 'var(--cp-text)', transition: 'color .3s' }}>
                  {done ? '✓ ' : ''}{title}
                </div>
                <div style={{ fontSize: 7, color: 'var(--cp-text-dim)' }}>{desc}</div>
              </div>
              <div style={{ textAlign: 'end' }}>
                <div style={{ fontSize: 9, color: 'var(--cp-cyan)' }}>{v1}</div>
                <div style={{ fontSize: 7, color: 'var(--cp-text-dim)' }}>{v2}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════ 3. SETTLE — scanning QR + live countdown ═══════════ */
export function StepSettleAnim() {
  const [secs, setSecs] = useState(14 * 60 + 59);

  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s <= 14 * 60 + 30 ? 14 * 60 + 59 : s - 1)), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  return (
    <div className="step-preview" aria-hidden="true">
      <style>{STYLE}</style>
      {bar('SETTLE', <span className="step-preview-badge-pending">{mm}:{ss}</span>)}
      <div style={{ padding: '8px 12px', textAlign: 'center' }}>
        <div style={{ fontSize: 8, letterSpacing: 1, color: 'var(--cp-text-dim)', marginBottom: 2 }}>SILENT OFFER</div>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--cp-text)', marginBottom: 4 }}>lno1zcp8x4vq...k9w7</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--cp-text)' }}>0.01 BTC</div>
        <div style={{ fontSize: 9, color: 'var(--cp-cyan)', marginBottom: 10 }}>fixed lane · mixed route</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ position: 'relative' }}>
            <DemoQR />
            <div className="sbt-scanline" />
          </div>
        </div>
        <div style={{ fontSize: 7, color: 'var(--cp-text-dim)', letterSpacing: 1, marginTop: 6 }}>SCAN WITH ANY LIGHTNING WALLET</div>
        <div className="step-preview-btn" style={{ marginTop: 8 }}>VIEW SWAP</div>
      </div>
    </div>
  );
}
