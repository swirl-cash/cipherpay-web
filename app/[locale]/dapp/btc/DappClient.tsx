'use client';

import { useState } from 'react';
import { LogoMark } from '@/components/Logo';
import { Link } from '@/i18n/navigation';
import { WalletConnect } from '@/components/WalletConnect';
import { SwirlCanvas } from '@/components/SwirlCanvas';

/* SWIRL Console — app-shell redesign. Top navigation, folder-tab cards,
   slider denomination picker, solid accent CTAs. Dark, always. */

const DENOMS_BTC = [100_000, 1_000_000, 10_000_000, 100_000_000];
const DENOMS_USDT = [100, 1_000, 10_000, 100_000];

function fmtBtc(sats: number): string {
  return (sats / 1e8).toFixed(4).replace(/\.?0+$/, '');
}

const NAV = ['POOL', 'BRIDGE', 'RECEIPTS', 'MINING', 'GOVERNANCE'] as const;

const NAV_DESC: Record<string, string> = {
  POOL: 'enter & exit',
  BRIDGE: 'soon',
  RECEIPTS: 'proofs & vault',
  MINING: 'anonymity mining',
  GOVERNANCE: 'lock & vote',
};

const GOV_ACTIONS: Array<[string, string]> = [
  ['LOCK', 'AMOUNT TO LOCK (SWIRL)'],
  ['UNLOCK', 'AMOUNT TO UNLOCK (SWIRL)'],
  ['DELEGATE', 'OPERATOR ADDRESS'],
  ['UNDELEGATE', 'CURRENT DELEGATE'],
  ['CLAIM', 'CLAIMABLE REWARDS'],
];

function Stat({ k, v, c }: { k: string; v: string; c?: string }) {
  return (
    <div className="dp-stat">
      <div className="dp-stat-k">{k}</div>
      <div className="dp-stat-v" style={c ? { color: c } : undefined}>{v}</div>
    </div>
  );
}

function Fold({ children }: { children: React.ReactNode }) {
  return <div className="dp-fold dp-fold-static">{children}</div>;
}

export function DappClient() {
  const [tab, setTab] = useState<string>('POOL');
  const [poolTab, setPoolTab] = useState<'ENTER' | 'EXIT'>('ENTER');
  const [asset, setAsset] = useState<'btc' | 'usdt'>('btc');
  const [lane, setLane] = useState<number>(1_000_000);
  const [offer, setOffer] = useState('');
  const [govAction, setGovAction] = useState('LOCK');
  const [mnav, setMnav] = useState(false);

  const activeGov = GOV_ACTIONS.find(([n]) => n === govAction)!;
  const denoms = asset === 'btc' ? DENOMS_BTC : DENOMS_USDT;
  const laneLabel = asset === 'btc' ? `${fmtBtc(lane)} BTC` : `${lane.toLocaleString('en-US')} USDT`;
  const laneIdx = Math.max(0, denoms.indexOf(lane));
  const lanePct = (laneIdx / (denoms.length - 1)) * 100;

  return (
    <main className="dp-app">
      <style>{`
        @font-face { font-family: 'Nunito'; src: url('/fonts/Nunito-Variable.woff2') format('woff2');
          font-weight: 100 1000; font-display: swap; }

        /* ═══ shell ═══ */
        .dp-app { min-height: 100vh; position: relative; display: flex; flex-direction: column;
          --bg: #05070b; --card: #0b0f16; --card2: #070b11;
          --line: rgba(148,180,220,.13); --line2: rgba(148,180,220,.07);
          --txt: #f0f6fc; --mut: #9fb2c8; --dim: #66798f;
          --cy: #00D4FF; --yl: #F4B728; --gr: #2fd67b;
          background:
            radial-gradient(1150px 620px at 50% -220px, rgba(0,212,255,.22), transparent 62%),
            radial-gradient(900px 700px at 112% 12%, rgba(88,80,255,.14), transparent 58%),
            radial-gradient(860px 680px at -12% 78%, rgba(0,190,235,.11), transparent 58%),
            linear-gradient(180deg, #070b13 0%, var(--bg) 34%, var(--bg) 100%);
          color: var(--txt);
          font-family: 'Nunito', ui-rounded, 'SF Pro Rounded', var(--font-geist), system-ui, sans-serif;
          font-size: 16px; line-height: 1.6; }
        @keyframes dpDrift {
          0%   { transform: translate(0, 0) scale(1); }
          25%  { transform: translate(16vw, 8vh) scale(1.08); }
          50%  { transform: translate(4vw, 22vh) scale(0.94); }
          75%  { transform: translate(-14vw, 9vh) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .dp-swirl { position: fixed; inset: 0; width: 100%; height: 100%;
          pointer-events: none; z-index: 0; }
        .dp-app::before { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 1;
          background-image: radial-gradient(rgba(160,195,235,.09) 1px, transparent 1.6px);
          background-size: 24px 24px;
          -webkit-mask-image: radial-gradient(ellipse 100% 80% at 50% 0%, black 20%, transparent 80%);
          mask-image: radial-gradient(ellipse 100% 80% at 50% 0%, black 20%, transparent 80%); }
        .dp-app::after { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 1;
          background: radial-gradient(ellipse 135% 115% at 50% 42%, transparent 60%, rgba(2,4,8,.38) 100%); }
        .dp-top, .dp-body { position: relative; z-index: 2; }
        .dp-top { z-index: 40; }
        .dp-mono { font-family: var(--font-geist-mono), monospace; }
        .dp-app button { font-family: inherit; }

        /* ═══ top nav ═══ */
        .dp-top { position: sticky; top: 0; z-index: 40; display: flex; align-items: center; gap: 12px;
          height: 66px; padding: 0 26px;
          background: rgba(5,7,11,.78); backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--line2); }
        .dp-brand { display: flex; align-items: center; gap: 12px; text-decoration: none; color: var(--txt); }
        .dp-brand b { font-size: 21px; font-weight: 800; letter-spacing: 1.5px; }
        .dp-brand small { font-size: 10px; letter-spacing: 2.5px; color: var(--cy);
          font-family: var(--font-geist-mono), monospace; margin-top: 6px; }
        .dp-nav { flex: 1; display: flex; justify-content: center; gap: 2px; }
        .dp-nav-item { background: none; border: none; border-bottom: 2px solid transparent;
          font-size: 12.5px; font-weight: 800; letter-spacing: 1px; color: var(--mut);
          padding: 12px 13px; cursor: pointer; transition: color .15s, border-color .15s; }
        .dp-nav-item:hover { color: var(--txt); }
        .dp-nav-item.on { color: var(--cy); border-bottom-color: var(--cy); }
        .dp-burger { display: none; background: none; border: 1px solid var(--line); border-radius: 10px;
          width: 42px; height: 40px; cursor: pointer; flex-direction: column; align-items: center;
          justify-content: center; gap: 5px; }
        .dp-burger i { display: block; width: 17px; height: 2px; background: var(--mut); border-radius: 1px; }
        .dp-mnav { position: absolute; top: 66px; left: 0; right: 0; background: #090d14;
          border-bottom: 1px solid var(--line); padding: 10px 14px 14px; z-index: 39;
          display: flex; flex-direction: column; gap: 4px;
          box-shadow: 0 30px 60px -20px rgba(0,0,0,.8); }
        .dp-mnav-item { display: flex; align-items: baseline; gap: 12px; background: none; border: none;
          border-radius: 10px; padding: 13px 14px; cursor: pointer; text-align: left; }
        .dp-mnav-item .n { font-size: 14px; font-weight: 800; letter-spacing: 1px; color: var(--mut); }
        .dp-mnav-item .d { font-size: 11px; color: var(--dim); }
        .dp-mnav-item.on { background: rgba(0,212,255,.1); }
        .dp-mnav-item.on .n { color: var(--cy); }

        /* ═══ wallet ═══ */
        .wc-btn { margin-left: 0; display: inline-flex; align-items: center; gap: 9px;
          background: linear-gradient(135deg, #3ae2ff, #00b8e8); border: none; border-radius: 10px;
          padding: 12px 20px;
          font-family: 'Nunito', ui-rounded, sans-serif; font-size: 13px; font-weight: 800;
          letter-spacing: .8px; color: #051019; cursor: pointer; white-space: nowrap;
          box-shadow: 0 6px 20px -6px rgba(0,212,255,.45), inset 0 1px 0 rgba(255,255,255,.35);
          transition: filter .15s, transform .1s, box-shadow .2s; }
        .wc-btn:hover { filter: brightness(1.08); box-shadow: 0 8px 26px -6px rgba(0,212,255,.6), inset 0 1px 0 rgba(255,255,255,.35); }
        .wc-btn:active { transform: translateY(1px); }
        .wc-btn:disabled { opacity: .6; cursor: wait; }
        .wc-btn.wc-on { background: rgba(0,212,255,.1); color: var(--cy);
          border: 1.5px solid rgba(0,212,255,.45);
          font-family: var(--font-geist-mono), monospace; font-weight: 600; }
        .wc-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--gr);
          box-shadow: 0 0 8px rgba(47,214,123,.8); }
        .wc-menu { position: absolute; right: 0; top: calc(100% + 10px); width: 320px;
          background: #0b0f16; border: 1px solid rgba(0,212,255,.3); border-radius: 16px;
          padding: 18px 20px; z-index: 50; box-shadow: 0 24px 60px -12px rgba(0,0,0,.75); }
        .wc-menu-addr { font-family: var(--font-geist-mono), monospace; font-size: 12px;
          color: var(--txt); word-break: break-all; line-height: 1.7; }
        .wc-menu-net { font-size: 10.5px; font-weight: 600; letter-spacing: .5px; color: var(--dim); margin-top: 8px; }
        .wc-menu-off { margin-top: 14px; width: 100%; background: none;
          border: 1px solid var(--line); border-radius: 10px; padding: 10px 0;
          color: var(--mut); font-family: inherit; font-size: 12px; font-weight: 800;
          letter-spacing: 1.5px; cursor: pointer; }
        .wc-menu-off:hover { border-color: #e05c5c; color: #e05c5c; }
        .wc-overlay { position: fixed; inset: 0; background: rgba(2,4,8,.72);
          backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center;
          z-index: 100; }
        .wc-modal { width: 400px; max-width: calc(100vw - 32px); background: #0b0f16;
          border: 1px solid rgba(0,212,255,.3); border-radius: 20px; padding: 30px 30px 26px;
          box-shadow: 0 18px 60px -8px rgba(0,0,0,.6); }
        .wc-modal-title { font-size: 15px; font-weight: 800; letter-spacing: 1.5px;
          color: var(--cy); margin-bottom: 14px; }
        .wc-modal-text { font-size: 14px; color: var(--mut); line-height: 1.75; }
        .wc-modal-link { display: inline-block; margin-top: 18px; color: var(--cy);
          font-size: 13px; font-weight: 800; letter-spacing: 1px; text-decoration: none; }
        .wc-modal-link:hover { text-decoration: underline; }
        .wc-modal-close { margin-top: 20px; width: 100%; background: none;
          border: 1px solid var(--line); border-radius: 10px; padding: 12px 0;
          color: var(--dim); font-family: inherit; font-size: 12px; font-weight: 800;
          letter-spacing: 1.5px; cursor: pointer; }
        .wc-modal-close:hover { color: var(--txt); }

        /* ═══ content ═══ */
        .dp-body { flex: 1; padding: 38px 26px 90px; }
        .dp-wrap { max-width: 1080px; margin: 0 auto; }
        .dp-kicker { font-family: var(--font-geist-mono), monospace; font-size: 10.5px;
          letter-spacing: 3px; color: var(--cy); margin-bottom: 10px; }
        .dp-h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 8px; }
        .dp-lede { font-size: 15px; font-weight: 600; color: var(--mut); margin: 0 0 30px; max-width: 560px; }

        /* ═══ folder-tab cards ═══ */
        .dp-folds { display: flex; gap: 8px; padding: 0 12px; position: relative; z-index: 2; }
        .dp-fold { border: 1px solid var(--line2); border-bottom: none; background: #0a0e15;
          color: var(--dim); border-radius: 12px 12px 0 0; padding: 11px 26px;
          font-size: 13px; font-weight: 800; letter-spacing: 1.2px; cursor: pointer;
          transition: color .15s, background .15s; margin-bottom: -1px; }
        .dp-fold:hover { color: var(--mut); }
        .dp-fold.on { background: linear-gradient(180deg, #2ee0ff, #00C8F0); border-color: transparent;
          color: #051019; box-shadow: 0 -6px 24px -4px rgba(0,212,255,.35), 0 1px 0 var(--card); }
        .dp-fold-static { cursor: default; color: var(--cy); display: flex; align-items: center; gap: 10px; }
        .dp-fold-static:hover { color: var(--cy); }
        .dp-fold-pill { font-family: var(--font-geist-mono), monospace; font-size: 10px;
          letter-spacing: 1px; color: var(--txt); border: 1px solid var(--line);
          border-radius: 999px; padding: 3px 10px; }
        .dp-card { background: linear-gradient(180deg, #0d1119, #0a0e14);
          border: 1px solid var(--line2); border-radius: 4px 18px 18px 18px;
          padding: 26px 28px 28px;
          box-shadow: 0 22px 55px -18px rgba(0,0,0,.65), inset 0 1px 0 rgba(255,255,255,.05); }
        .dp-card-plain { border-radius: 18px; }

        /* ═══ form bits ═══ */
        .dp-label { display: block; font-size: 12px; font-weight: 800; letter-spacing: 1.5px;
          color: var(--dim); margin-bottom: 9px; }
        .dp-input, .dp-select { width: 100%; background: var(--card2); border: 1.5px solid var(--line);
          border-radius: 10px; color: var(--txt); font-family: inherit; font-size: 15px;
          font-weight: 600; padding: 14px 16px; outline: none; box-sizing: border-box;
          box-shadow: inset 0 2px 8px rgba(0,0,0,.35);
          transition: border-color .2s, box-shadow .2s; }
        .dp-input:focus, .dp-select:focus { border-color: var(--cy);
          box-shadow: inset 0 2px 8px rgba(0,0,0,.35), 0 0 0 4px rgba(0,212,255,.14); }
        .dp-input:disabled { opacity: .55; }
        .dp-select { appearance: none; -webkit-appearance: none; cursor: pointer;
          background-image: linear-gradient(45deg, transparent 50%, var(--dim) 50%),
            linear-gradient(135deg, var(--dim) 50%, transparent 50%);
          background-position: calc(100% - 21px) 50%, calc(100% - 16px) 50%;
          background-size: 5px 5px, 5px 5px; background-repeat: no-repeat; }
        .dp-select option:disabled { color: var(--dim); }

        /* ═══ denomination slider ═══ */
        .dp-slider { position: relative; padding: 4px 6px 0; margin-top: 4px; }
        .dp-rail { position: absolute; left: 14px; right: 14px; top: 13px; height: 2px;
          background: var(--line); border-radius: 1px; }
        .dp-rail-fill { position: absolute; left: 14px; top: 13px; height: 2px;
          background: linear-gradient(90deg, rgba(0,212,255,.25), var(--cy));
          box-shadow: 0 0 10px rgba(0,212,255,.5); border-radius: 1px;
          transition: width .3s cubic-bezier(.3,.7,.4,1); }
        .dp-dots { position: relative; display: flex; justify-content: space-between; }
        .dp-dot { background: none; border: none; cursor: pointer; display: flex;
          flex-direction: column; align-items: center; gap: 9px; padding: 0 2px; }
        .dp-dot i { width: 20px; height: 20px; border-radius: 50%; border: 2px solid var(--dim);
          background: var(--bg); transition: border-color .15s, background .15s, box-shadow .2s, transform .15s; }
        .dp-dot:hover i { border-color: var(--cy); transform: scale(1.15); }
        .dp-dot.on i { border-color: var(--cy); background: var(--cy);
          box-shadow: 0 0 0 5px rgba(0,212,255,.15), 0 0 20px rgba(0,212,255,.6); }
        .dp-dot span { font-family: var(--font-geist-mono), monospace; font-size: 11px;
          color: var(--mut); white-space: nowrap; }
        .dp-dot.on span { color: var(--cy); font-weight: 700; }

        /* meta strip */
        .dp-kv { display: flex; flex-wrap: wrap; gap: 6px 20px; margin-top: 20px; padding-top: 16px;
          border-top: 1px solid var(--line2); font-size: 11px; font-weight: 700;
          letter-spacing: 1px; color: var(--dim); }
        .dp-kv b { color: var(--cy); font-weight: 800; margin-left: 6px; }

        /* big CTA */
        .dp-cta { width: 100%; margin-top: 24px; padding: 16px 0; border: none; border-radius: 12px;
          background: linear-gradient(135deg, #3ae2ff, #00b8e8); color: #051019;
          font-size: 13.5px; font-weight: 800; letter-spacing: 1.8px;
          box-shadow: 0 8px 24px -8px rgba(0,212,255,.4), inset 0 1px 0 rgba(255,255,255,.3);
          cursor: not-allowed; opacity: .5; }

        /* path chips */
        .dp-path { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; }
        .dp-node { font-family: var(--font-geist-mono), monospace; font-size: 10.5px;
          letter-spacing: 1px; color: var(--mut); border: 1px solid var(--line);
          border-radius: 999px; padding: 6px 13px; }
        .dp-node.cy { color: var(--cy); border-color: rgba(0,212,255,.4); }
        .dp-arrow { color: var(--dim); font-size: 12px; }

        /* stats */
        .dp-sgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 24px; }
        .dp-stat-k { font-size: 11px; font-weight: 800; letter-spacing: 1.5px;
          color: var(--dim); margin-bottom: 6px; }
        .dp-stat-v { font-family: var(--font-geist-mono), monospace; font-size: 21px;
          font-weight: 700; letter-spacing: -0.3px; }
        .dp-srow { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px 24px; }

        .dp-empty { border: 1px dashed var(--line); border-radius: 12px; padding: 26px 20px;
          text-align: center; color: var(--dim); font-size: 13px; font-weight: 600; }

        /* pool layout */
        .dp-pool-grid { display: grid; grid-template-columns: 1.06fr .94fr; gap: 26px; align-items: stretch; }
        .dp-pool-grid > div { display: flex; flex-direction: column; }
        .dp-pool-grid .dp-card { flex: 1; display: flex; flex-direction: column; }
        .dp-pool-grid .dp-card .dp-kv { padding-bottom: 24px; }
        .dp-pool-grid .dp-card .dp-cta { margin-top: auto; }
        .dp-pool-grid .dp-card .dp-recent { margin-top: auto; padding-top: 24px; }
        @keyframes dpOrb { 0%,100% { box-shadow: 0 0 26px 2px rgba(0,212,255,.25), inset 0 0 14px rgba(0,212,255,.14); } 50% { box-shadow: 0 0 48px 8px rgba(0,212,255,.42), inset 0 0 20px rgba(0,212,255,.28); } }
        @keyframes dpRing { 0% { transform: scale(.62); opacity: .7; } 100% { transform: scale(1.9); opacity: 0; } }
        .dp-orb-wrap { position: relative; width: 58px; height: 58px; flex-shrink: 0; }
        .dp-ring { position: absolute; inset: 0; border: 1px solid rgba(0,212,255,.5);
          border-radius: 50%; animation: dpRing 3.2s cubic-bezier(.2,.6,.3,1) infinite; }
        .dp-orb { animation: dpOrb 3.2s ease-in-out infinite; position: absolute; inset: 0;
          border-radius: 50%; border: 1px solid var(--cy);
          background: radial-gradient(circle at 34% 30%, rgba(0,212,255,.22), var(--bg) 68%);
          display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .dp-orb b { font-size: 15px; font-weight: 700; color: var(--cy); font-style: italic; }
        .dp-orb small { font-size: 6.5px; letter-spacing: 1.5px; color: var(--dim); }
        .dp-status-row { display: flex; align-items: center; justify-content: space-between;
          gap: 16px; margin-bottom: 22px; padding-bottom: 20px; border-bottom: 1px solid var(--line2); }
        .dp-soon-pill { font-size: 10px; font-weight: 800; letter-spacing: 1.5px; color: var(--yl);
          background: rgba(244,183,40,.1); border: 1px solid rgba(244,183,40,.35);
          border-radius: 999px; padding: 4px 11px; }

        /* mining */
        @keyframes dpAccrue { 0% { width: 6%; } 100% { width: 96%; } }
        .dp-accrue-bar { height: 6px; border-radius: 3px;
          background: linear-gradient(90deg, var(--cy), var(--yl));
          animation: dpAccrue 6s cubic-bezier(.3,.7,.4,1) infinite alternate; }
        .dp-formula { border: 1px solid var(--line); border-radius: 12px; padding: 16px 18px;
          background: var(--card2); font-family: var(--font-geist-mono), monospace;
          font-size: 13.5px; color: var(--txt); margin-bottom: 24px; }

        /* governance */
        .dp-gov-folds { display: flex; gap: 6px; padding: 0 12px; position: relative; z-index: 2;
          overflow-x: auto; }
        .dp-gov-folds .dp-fold { padding: 11px 18px; font-size: 12px; white-space: nowrap; }
        .dp-tab { font-size: 12px; font-weight: 800; letter-spacing: 1px;
          padding: 9px 16px; border: 1.5px solid var(--line); border-radius: 10px;
          background: transparent; color: var(--dim); cursor: not-allowed; }
        .dp-tab-on { border-color: var(--cy); color: var(--cy); background: rgba(0,212,255,.09); }

        /* ═══ source link ═══ */
        .dp-footer { position: relative; z-index: 1; display: flex; justify-content: center;
          padding: 60px 24px 24px; }
        .dp-github { width: 42px; height: 42px; display: inline-flex; align-items: center;
          justify-content: center; color: var(--mut); background: rgba(11,16,24,.82);
          border: 1px solid var(--line); border-radius: 12px;
          transition: color .18s, border-color .18s, transform .18s, background .18s; }
        .dp-github:hover { color: var(--cy); border-color: rgba(0,212,255,.45);
          background: rgba(0,212,255,.08); transform: translateY(-2px); }

        /* ═══ responsive ═══ */
        @media (max-width: 1100px) {
          .dp-nav { display: none; }
          .dp-burger { display: flex; }
          .dp-top .wc-btn { margin-left: auto; }
        }
        @media (max-width: 940px) {
          .dp-pool-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 720px) {
          .dp-body { padding: 26px 14px 70px; }
          .dp-top { padding: 0 16px; }
          .dp-h1 { font-size: 24px; }
          .dp-card { padding: 20px 18px 22px; }
          .dp-srow { grid-template-columns: repeat(2, 1fr); }
          .dp-dot span { font-size: 9.5px; }
        }
      `}</style>

      {/* ═══ TOP NAV ═══ */}
      <SwirlCanvas className="dp-swirl" />
      <header className="dp-top">
        <Link href="/" className="dp-brand">
          <LogoMark size={26} />
          <b>SWIRL</b>
          <small>CONSOLE</small>
        </Link>
        <nav className="dp-nav">
          {NAV.map((n) => (
            <button key={n} className={`dp-nav-item ${tab === n ? 'on' : ''}`} onClick={() => setTab(n)}>
              {n}
            </button>
          ))}
        </nav>
        <WalletConnect />
        <button className="dp-burger" onClick={() => setMnav((v) => !v)} aria-label="menu">
          <i /><i /><i />
        </button>
        {mnav && (
          <div className="dp-mnav">
            {NAV.map((n) => (
              <button
                key={n}
                className={`dp-mnav-item ${tab === n ? 'on' : ''}`}
                onClick={() => { setTab(n); setMnav(false); }}
              >
                <span className="n">{n}</span>
                <span className="d">{NAV_DESC[n]}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="dp-body">
        <div className="dp-wrap">

          {/* ═══ POOL ═══ */}
          {tab === 'POOL' && (
            <>
              <div className="dp-kicker">POOL</div>
              <h1 className="dp-h1">Enter on one side. Leave unlinked on the other.</h1>
              <p className="dp-lede">Uniform denominations in. Blinded paths out.</p>

              <div className="dp-pool-grid">
                {/* left — action card with folder tabs */}
                <div>
                  <div className="dp-folds">
                    <button className={`dp-fold ${poolTab === 'ENTER' ? 'on' : ''}`} onClick={() => setPoolTab('ENTER')}>
                      ENTER
                    </button>
                    <button className={`dp-fold ${poolTab === 'EXIT' ? 'on' : ''}`} onClick={() => setPoolTab('EXIT')}>
                      EXIT
                    </button>
                  </div>
                  <div className="dp-card">
                    {poolTab === 'ENTER' ? (
                      <>
                        <label className="dp-label">ASSET</label>
                        <select
                          className="dp-select"
                          value={asset}
                          onChange={(e) => {
                            const a = e.target.value as 'btc' | 'usdt';
                            setAsset(a);
                            setLane(a === 'btc' ? 1_000_000 : 1_000);
                          }}
                          style={{ marginBottom: 22 }}
                        >
                          <option value="btc">BTC — Lightning</option>
                          <option value="usdt">USDT — Lightning · Taproot Assets</option>
                        </select>
                        <label className="dp-label">AMOUNT — FIXED DENOMINATIONS</label>
                        <div className="dp-slider">
                          <div className="dp-rail" />
                          <div className="dp-rail-fill" style={{ width: `calc((100% - 28px) * ${lanePct / 100})` }} />
                          <div className="dp-dots">
                            {denoms.map((d) => (
                              <button key={d} className={`dp-dot ${lane === d ? 'on' : ''}`} onClick={() => setLane(d)}>
                                <i />
                                <span>{asset === 'btc' ? `${fmtBtc(d)} BTC` : `${d.toLocaleString('en-US')} USDT`}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="dp-kv">
                          <span>FEE<b>50 bps</b></span>
                          <span>ANON SET<b>pool-wide</b></span>
                          <span>MIN HOLD<b>≥ 30 min</b></span>
                        </div>
                        <button className="dp-cta" disabled>GENERATE DEPOSIT INVOICE · SOON</button>
                      </>
                    ) : (
                      <>
                        <label className="dp-label">YOUR BOLT12 OFFER (lno1…)</label>
                        <textarea
                          className="dp-input"
                          style={{ minHeight: 88, resize: 'vertical', marginBottom: 22 }}
                          placeholder="lno1…"
                          value={offer}
                          onChange={(e) => setOffer(e.target.value)}
                        />
                        <label className="dp-label">PATH PREVIEW</label>
                        <div className="dp-path">
                          <span className="dp-node cy">POOL</span>
                          <span className="dp-arrow">→</span>
                          <span className="dp-node">HOP</span>
                          <span className="dp-arrow">→</span>
                          <span className="dp-node">HOP</span>
                          <span className="dp-arrow">→</span>
                          <span className="dp-node">HOP</span>
                          <span className="dp-arrow">→</span>
                          <span className="dp-node cy">YOU</span>
                        </div>
                        <div className="dp-kv">
                          <span>QUEUE<b>randomized</b></span>
                          <span>ORDER<b>shuffled</b></span>
                          <span>UTXO<b>fresh</b></span>
                        </div>
                        <button className="dp-cta" disabled>REQUEST PAYOUT · SOON</button>
                      </>
                    )}
                  </div>
                </div>

                {/* right — stats card */}
                <div>
                  <div className="dp-folds">
                    <Fold>POOL STATS<span className="dp-fold-pill">{laneLabel}</span></Fold>
                  </div>
                  <div className="dp-card">
                    <div className="dp-status-row">
                      <div>
                        <div className="dp-stat-k" style={{ marginBottom: 6 }}>EPOCH #0001</div>
                        <span className="dp-soon-pill">STATUS · SOON</span>
                      </div>
                      <div className="dp-orb-wrap">
                        <div className="dp-ring" />
                        <div className="dp-ring" style={{ animationDelay: '1.6s' }} />
                        <div className="dp-orb"><b>M</b><small>POOL</small></div>
                      </div>
                    </div>
                    <div className="dp-sgrid">
                      <Stat k="TOTAL DEPOSITS" v="0" />
                      <Stat k="POOL DEPTH" v={asset === 'btc' ? '0 BTC' : '0 USDT'} />
                      <Stat k="EXIT QUEUE" v="0" />
                      <Stat k="MIN HOLD" v="≥ 30 min" c="var(--cy)" />
                    </div>
                    <div className="dp-recent">
                      <div className="dp-label" style={{ marginBottom: 10 }}>RECENT ACTIVITY</div>
                      <div className="dp-empty">No deposits yet — the first epoch opens soon.</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ═══ BRIDGE ═══ */}
          {tab === 'BRIDGE' && (
            <>
              <div className="dp-folds">
                <Fold>BRIDGE</Fold>
              </div>
              <div className="dp-card" style={{ textAlign: 'center', padding: '96px 24px' }}>
                <span className="dp-soon-pill" style={{ fontSize: 12, padding: '8px 20px' }}>SOON</span>
                <p style={{ color: 'var(--dim)', fontSize: 13, fontWeight: 600, marginTop: 18, marginBottom: 0 }}>
                  Cross-chain gateways.
                </p>
              </div>
            </>
          )}

          {/* ═══ RECEIPTS ═══ */}
          {tab === 'RECEIPTS' && (
            <>
              <div className="dp-kicker">RECEIPTS &amp; PROOFS</div>
              <h1 className="dp-h1">A paper trail only you can read.</h1>
              <p className="dp-lede">Every entry issues a receipt. It lives on your device.</p>

              <div className="dp-pool-grid">
                <div>
                  <div className="dp-folds"><Fold>PROOF OF ORIGIN</Fold></div>
                  <div className="dp-card">
                    <label className="dp-label">PASTE YOUR RECEIPT (swirlrc1…)</label>
                    <textarea className="dp-input" style={{ minHeight: 76, resize: 'vertical' }} placeholder="swirlrc1…" disabled />
                    <div className="dp-kv">
                      <span>DISCLOSURE<b>selective</b></span>
                      <span>EXPORT<b>PDF</b></span>
                    </div>
                    <button className="dp-cta" disabled>GENERATE REPORT · SOON</button>
                  </div>
                </div>
                <div>
                  <div className="dp-folds"><Fold>RECEIPT VAULT</Fold></div>
                  <div className="dp-card">
                    <label className="dp-label">VAULT KEY PHRASE</label>
                    <input className="dp-input" placeholder="generated locally on setup" disabled />
                    <div className="dp-kv">
                      <span>CIPHER<b>xchacha20</b></span>
                      <span>KEY CUSTODY<b>client-side</b></span>
                    </div>
                    <button className="dp-cta" disabled>CREATE VAULT · SOON</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ═══ MINING ═══ */}
          {tab === 'MINING' && (
            <>
              <div className="dp-kicker">ANONYMITY MINING</div>
              <h1 className="dp-h1">Time in the pool is hash-rate.</h1>
              <p className="dp-lede">The longer your commitment stays in, the more weight you accrue.</p>

              <div className="dp-folds"><Fold>MINING</Fold></div>
              <div className="dp-card">
                <label className="dp-label">ACCRUAL FUNCTION</label>
                <div className="dp-formula">weight = sats × blocks_held × log₂(anon_set)</div>
                <label className="dp-label">ACCUMULATING WHILE YOU WAIT</label>
                <div style={{ background: 'var(--card2)', border: '1px solid var(--line2)', borderRadius: 8, padding: 8 }}>
                  <div className="dp-accrue-bar" />
                </div>
                <div className="dp-srow" style={{ marginTop: 28 }}>
                  <Stat k="ACCRUES" v="per block held" />
                  <Stat k="REDEEMABLE AS" v="fee rebates → SWIRL" c="var(--cy)" />
                  <Stat k="TOKEN" v="SWIRL · 21,000,000 fixed" />
                  <Stat k="STATUS" v="SOON" c="var(--yl)" />
                </div>
              </div>
            </>
          )}

          {/* ═══ GOVERNANCE ═══ */}
          {tab === 'GOVERNANCE' && (
            <>
              <div className="dp-kicker">GOVERNANCE</div>
              <h1 className="dp-h1">Lock SWIRL. Steer the pool.</h1>
              <p className="dp-lede">Voting weight comes from locked SWIRL. Fixed supply 21,000,000.</p>

              <div className="dp-folds"><Fold>STAKING</Fold></div>
              <div className="dp-card" style={{ marginBottom: 30 }}>
                <div className="dp-srow" style={{ marginBottom: 4 }}>
                  <Stat k="BALANCE" v="0" />
                  <Stat k="LOCKED" v="0" />
                  <Stat k="VOTING POWER" v="0" c="var(--cy)" />
                  <Stat k="REWARDS" v="0" c="var(--yl)" />
                </div>
              </div>

              <div className="dp-gov-folds">
                {GOV_ACTIONS.map(([name]) => (
                  <button key={name} className={`dp-fold ${govAction === name ? 'on' : ''}`} onClick={() => setGovAction(name)}>
                    {name}
                  </button>
                ))}
              </div>
              <div className="dp-card" style={{ marginBottom: 30 }}>
                <label className="dp-label">{activeGov[1]}</label>
                <input className="dp-input" placeholder="0.0" disabled />
                <button className="dp-cta" disabled>{govAction} · SOON</button>
                <div className="dp-kv">
                  <span>SUPPLY<b>21,000,000 fixed</b></span>
                  <span>DECIDES<b>fees · lanes · gateways</b></span>
                  <span>COOLDOWN<b>governance-set</b></span>
                </div>
              </div>

              <div className="dp-folds"><Fold>PROPOSALS</Fold></div>
              <div className="dp-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="dp-tab dp-tab-on" disabled>ALL</button>
                    <button className="dp-tab" disabled>ACTIVE</button>
                  </div>
                  <button className="dp-tab" disabled style={{ borderStyle: 'dashed' }}>+ CREATE PROPOSAL</button>
                </div>
                <div className="dp-empty">
                  No proposals yet — creating one requires{' '}<b style={{ color: 'var(--yl)' }}>≥ 2,100 SWIRL</b>{' '}locked.
                </div>
                <div className="dp-kv">
                  <span>THRESHOLD<b>2,100 SWIRL</b></span>
                  <span>VOTING<b>locked-weight</b></span>
                  <span>EXECUTION<b>timelocked</b></span>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      <footer className="dp-footer">
        <a
          className="dp-github"
          href="https://github.com/swirl-cash/swirl-coordinator"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="SWIRL coordinator on GitHub"
          title="GitHub — swirl-cash/swirl-coordinator"
        >
          <svg width="23" height="23" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .7a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2.23c-3.22.7-3.9-1.37-3.9-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.57-.29-5.27-1.28-5.27-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.98 10.98 0 0 1 5.76 0c2.2-1.49 3.16-1.18 3.16-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.7 5.38-5.28 5.67.41.35.78 1.05.78 2.12v3.14c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
          </svg>
        </a>
      </footer>
    </main>
  );
}
