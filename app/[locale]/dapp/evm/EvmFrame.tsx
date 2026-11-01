'use client';

import Link from 'next/link';

const ArrowLeft = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6M9 12h11" /></svg>;

export function EvmFrame() {
  return (
    <main style={{ height: '100dvh', position: 'relative', background: '#080b0d' }}>
      <Link href="/dapp" aria-label="Back to network selection" title="Back to network selection" style={{ position: 'absolute', zIndex: 30, left: 18, bottom: 17, width: 32, height: 32, display: 'grid', placeItems: 'center', border: '1px solid rgba(188,224,216,.12)', borderRadius: 7, color: '#82908f', background: '#0d1214' }}>
        <ArrowLeft />
      </Link>
      <iframe src="/wallet/index.html" title="SWIRL Wallet — public and private EVM assets" style={{ display: 'block', width: '100%', height: '100%', border: 0 }} allow="clipboard-write" />
    </main>
  );
}
