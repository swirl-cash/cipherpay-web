'use client';

import { useEffect } from 'react';

export default function ShareRedirect({ code }: { code: string }) {
  useEffect(() => {
    window.location.replace(`/genesis?ref=${encodeURIComponent(code)}`);
  }, [code]);

  return (
    <main style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--cp-bg, #030509)', color: 'var(--cp-text-muted, #7a8b9a)',
      fontFamily: 'monospace', fontSize: 12, letterSpacing: 2,
    }}>
      OPENING YOUR SEAT…&nbsp;
      <a href={`/genesis?ref=${encodeURIComponent(code)}`} style={{ color: 'var(--cp-cyan, #00D4FF)' }}>
        CONTINUE →
      </a>
    </main>
  );
}
