'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/* UniSat wallet connect — talks to the injected window.unisat provider.
   No backend session; connection state is local only. */

interface UniSatProvider {
  requestAccounts(): Promise<string[]>;
  getAccounts(): Promise<string[]>;
  on(event: 'accountsChanged', cb: (accounts: string[]) => void): void;
  removeListener(event: 'accountsChanged', cb: (accounts: string[]) => void): void;
}

declare global {
  interface Window {
    unisat?: UniSatProvider;
  }
}

function short(addr: string): string {
  return addr.length > 12 ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : addr;
}

export function WalletConnect() {
  const [addr, setAddr] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [installHint, setInstallHint] = useState(false);
  const [busy, setBusy] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // silent re-connect if the user already approved this site
  useEffect(() => {
    const p = window.unisat;
    if (!p) return;
    p.getAccounts()
      .then((a) => a.length && setAddr(a[0]))
      .catch(() => {});
    const onChange = (a: string[]) => setAddr(a[0] ?? null);
    p.on('accountsChanged', onChange);
    return () => p.removeListener('accountsChanged', onChange);
  }, []);

  // close the dropdown on outside click
  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menu]);

  async function connect() {
    const p = window.unisat;
    if (!p) {
      setInstallHint(true);
      return;
    }
    setBusy(true);
    try {
      const a = await p.requestAccounts();
      if (a.length) setAddr(a[0]);
    } catch {
      /* user rejected — stay disconnected */
    } finally {
      setBusy(false);
    }
  }

  if (addr) {
    return (
      <div ref={menuRef} style={{ position: 'relative' }}>
        <button className="wc-btn wc-on" onClick={() => setMenu((v) => !v)}>
          <span className="wc-dot" />
          {short(addr)}
        </button>
        {menu && (
          <div className="wc-menu">
            <div className="wc-menu-addr">{addr}</div>
            <div className="wc-menu-net">UniSat · connected locally — nothing leaves this page</div>
            <button className="wc-menu-off" onClick={() => { setAddr(null); setMenu(false); }}>
              DISCONNECT
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button className="wc-btn" onClick={connect} disabled={busy}>
        {busy ? 'CONNECTING…' : 'CONNECT WALLET'}
      </button>
      {installHint && createPortal(
        <div className="wc-overlay" onClick={() => setInstallHint(false)}>
          <div className="wc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="wc-modal-title">UNISAT WALLET NOT FOUND</div>
            <p className="wc-modal-text">
              This console connects to UniSat — a Bitcoin wallet browser extension.
              Install it, then come back and connect.
            </p>
            <a className="wc-modal-link" href="https://unisat.io/download" target="_blank" rel="noreferrer">
              GET UNISAT →
            </a>
            <button className="wc-modal-close" onClick={() => setInstallHint(false)}>CLOSE</button>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
