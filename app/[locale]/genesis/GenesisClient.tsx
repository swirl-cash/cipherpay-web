'use client';

import { useEffect, useState } from 'react';
import { LogoMark } from '@/components/Logo';

const AIRDROP_TOTAL = '1,050,000';
const OG_GRANT = '10,000'; // vSWIRL granted per approved OG
const X_URL = 'https://x.com/swirlbtc';
const LIKE_INTENT = 'https://twitter.com/intent/like?tweet_id=2113287620201533568';
const RT_INTENT = 'https://twitter.com/intent/retweet?tweet_id=2113287620201533568';
/* live Google Form — pre-filled link: the commitment checklist arrives ticked */
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdUmFNlDsBuDYXoe9BJ16Y0De-3hfhdJA2ONg6nLT7zbzp32w/viewform?usp=pp_url&entry.1258854378=Publish+original+content+about+SWIRL+and+the+genesis+campaign+consistently&entry.1258854378=Stay+active+under+our+official+posts+%E2%80%94+share+takes,+answer+questions&entry.1258854378=Bring+your+community+in+and+point+the+curious+ones+to+Genesis&entry.1258854378=Keep+building:+tutorials,+discussions,+AMAs+%E2%80%94+whatever+helps+people+understand+private+payments+on+Lightning';

/* minimal stroke icon set — one color, inherits from context */
const IC: Record<string, string[]> = {
  genesis: ['M12 3l7 9-7 9-7-9 7-9z', 'M12 8.5l3 3.5-3 3.5-3-3.5 3-3.5z'],
  tasks: ['M9 6h11', 'M9 12h11', 'M9 18h11', 'M4 6h.01', 'M4 12h.01', 'M4 18h.01'],
  crown: ['M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5L3 8z'],
  trophy: ['M8 21h8', 'M12 17v4', 'M7 4h10v5a5 5 0 01-10 0V4z', 'M7 5H4a2 2 0 002 4h1', 'M17 5h3a2 2 0 01-2 4h-1'],
  rules: ['M7 3h7l5 5v13H7z', 'M14 3v5h5', 'M10 13h5', 'M10 17h5'],
  follow: ['M15 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2', 'M8.5 11a4 4 0 100-8 4 4 0 000 8', 'M19 8v6', 'M22 11h-6'],
  boost: ['M13 2L4.5 13.5H11L9.5 22 19 10h-6.5L13 2z'],
  voice: ['M12 15a3 3 0 003-3V5a3 3 0 00-6 0v7a3 3 0 003 3z', 'M19 11a7 7 0 01-14 0', 'M12 18v4'],
  daily: ['M8 2v4', 'M16 2v4', 'M3 9h18', 'M5 4h14a2 2 0 012 2v13a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z'],
  shield: ['M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z', 'M9.5 11.5l2 2 3.5-4'],
  star: ['M12 2l3 6.5 7 .8-5.2 4.8 1.4 7L12 17.5 5.8 21l1.4-7L2 9.3l7-.8z'],
};

function Ic({ p, size = 15 }: { p: string[]; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {p.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

const TABS: Array<[string, string[]]> = [
  ['GENESIS', IC.genesis],
  ['TASKS', IC.tasks],
  ['OG APPLICATION', IC.crown],
  ['LEADERBOARD', IC.trophy],
  ['RULES', IC.rules],
];

const POINT_ROWS: Array<[string, string, string[]]> = [
  ['COMPLETE ALL TASKS', '+1,000', IC.tasks],
  ['DIRECT INVITE', '+200', IC.follow],
  ['TIER-2 INVITE', '+50', IC.boost],
  ['DAILY SHIELD + UNSHIELD', '+150', IC.shield],
];

const OG_BENEFITS: string[] = [
  `Genesis OG status — a permanent mark bound to your seat`,
  `${OG_GRANT} vSWIRL credited on approval`,
  `Airdrop weight ×3 — every future allocation lands three times heavier on OG seats`,
  `Anonymity mining — a permanent 1.5× yield boost, active from day one of the mine`,
];

/* the locked genesis post — 277 weighted chars, fits a free account */
const GENESIS_POST = (link: string) =>
  `Locked my seat in @swirlbtc genesis.\n\n` +
  `Silent payments on Lightning — no invoices to link, no nodes to watch, no history to follow. Zero on-chain trace.\n\n` +
  `5% of the fixed supply goes to the earliest. Enter through my code, we both earn 👇\n` +
  `${link}\n` +
  `#SWIRL #Bitcoin`;

function XIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="12" cy="12" r="10" stroke="#00D4FF" strokeWidth="1.5" />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#00D4FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* orbit-O — the Genesis OG mark: gold ring, cyan orbit arc + core, italic G */
function OgIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={(size * 38) / 24} height={size} viewBox="0 0 38 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="12" r="7.6" stroke="var(--c-gold)" strokeWidth="2.4" />
      <circle cx="11" cy="12" r="5.1" stroke="var(--c-cyan)" strokeWidth="1.7"
        strokeDasharray="21 11" strokeLinecap="round" transform="rotate(-40 11 12)" />
      <circle cx="11" cy="12" r="2.2" fill="var(--c-cyan)" />
      <text x="22" y="17.6" fontFamily="var(--font-mono, monospace)" fontWeight="700"
        fontStyle="italic" fontSize="14" fill="var(--c-gold)">G</text>
    </svg>
  );
}


export default function GenesisClient() {
  const [tab, setTab] = useState('GENESIS');

  /* ── live session + seat state ── */
  const [session, setSession] = useState<{ id: string; handle: string; name: string; avatar: string } | null>(null);
  const [me, setMe] = useState<{ code: string; direct: number; tier2: number; points: number; t1: boolean; t2: boolean; t3: boolean; og: boolean; checkinDays: number; checkedInToday: boolean; featured: string; cycleDays: number; cycleClaimedToday: boolean; taskWallet: string | null } | null>(null);
  const [authError, setAuthError] = useState('');
  const [followState, setFollowState] = useState<'idle' | 'checking' | 'verified' | 'missing' | 'error'>('idle');
  const [boostState, setBoostState] = useState<'idle' | 'saving' | 'done'>('idle');
  const [postUrl, setPostUrl] = useState('');
  const [postState, setPostState] = useState<'idle' | 'checking' | 'verified' | 'not_yours' | 'no_code' | 'error'>('idle');
  const [copied, setCopied] = useState('');
  const [pointsOpen, setPointsOpen] = useState(false);
  const [checkinBusy, setCheckinBusy] = useState(false);
  const [featuredUrl, setFeaturedUrl] = useState('');
  const [featuredBusy, setFeaturedBusy] = useState(false);
  const [featuredErr, setFeaturedErr] = useState('');
  const [board, setBoard] = useState<Array<{ handle: string; name: string; avatar: string; og: boolean; direct: number; tier2: number; points: number }> | null>(null);
  const [myRank, setMyRank] = useState<{ rank: number; total: number; breakdown?: { tasks: number; direct: number; tier2: number; daily: number; cycle: number; featured: number; total: number } } | null>(null);
  const [cycleAddr, setCycleAddr] = useState('');
  const [cycleBusy, setCycleBusy] = useState(false);
  const [cycleErr, setCycleErr] = useState('');

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    // an invite link plants the ref before any login happens
    const ref = q.get('ref');
    if (ref) localStorage.setItem('sbt20_gs_ref', ref);
    // returning from the X OAuth round-trip?
    if (q.get('connected') === '1') setTab('TASKS');
    const err = q.get('auth_error');
    if (err) {
      setTab('TASKS');
      setAuthError(err);
    }
    if (q.toString()) window.history.replaceState(null, '', window.location.pathname);

    fetch('/api/genesis/session')
      .then((r) => (r.ok ? r.json() : null))
      .then(async (d) => {
        if (!d?.ok) return;
        setSession({ id: d.id, handle: d.handle, name: d.name, avatar: d.avatar || '' });
        // register the seat (idempotent) + bind a stored ref once
        const storedRef = localStorage.getItem('sbt20_gs_ref');
        const rr = await fetch('/api/genesis/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(storedRef ? { ref: storedRef } : {}),
        });
        if (!rr.ok) return;
        const rd = await rr.json();
        if (rd?.seat) {
          setMe(rd.seat);
          if (rd.seat.taskWallet) setCycleAddr(rd.seat.taskWallet);
          if (rd.seat.t1) setFollowState('verified');
          if (rd.seat.t2) setBoostState('done');
          if (rd.seat.t3) setPostState('verified');
        }
        if (rd?.referral) localStorage.removeItem('sbt20_gs_ref'); // answered — stop retrying
      })
      .catch(() => { /* session check failed — stay anonymous */ });
  }, []);

  /* leaderboard pulls live seats each time the tab opens */
  useEffect(() => {
    if (tab !== 'LEADERBOARD') return;
    setBoard(null);
    fetch('/api/genesis/leaderboard')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setBoard(Array.isArray(d?.rows) ? d.rows : []);
        setMyRank(d?.me ?? null);
      })
      .catch(() => { setBoard([]); setMyRank(null); });
  }, [tab]);

  const copy = async (text: string, which: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(''), 1500);
    } catch { /* clipboard blocked */ }
  };

  const disconnect = async () => {
    await fetch('/api/genesis/session', { method: 'POST' });
    setSession(null);
    setMe(null);
    setFollowState('idle');
    setBoostState('idle');
    setPostState('idle');
  };

  const verifyFollow = async () => {
    setFollowState('checking');
    try {
      const r = await fetch('/api/genesis/verify/follow', { method: 'POST' });
      if (r.status === 401) { setSession(null); setMe(null); setFollowState('idle'); return; }
      const d = await r.json();
      if (d.ok && d.following) {
        setFollowState('verified');
        setMe((prev) => (prev ? { ...prev, t1: true } : prev));
      } else if (d.ok) {
        setFollowState('missing');
      } else {
        setFollowState('error');
      }
    } catch {
      setFollowState('error');
    }
  };

  const inviteLink = me ? `https://swirl.cash/share/${me.code}` : '';
  const intentUrl = me
    // ?c=4 — fresh URL, forces X to re-crawl instead of serving the cached card
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(GENESIS_POST(`${inviteLink}?c=4`))}`
    : '';

  const confirmBoost = async () => {
    setBoostState('saving');
    try {
      const r = await fetch('/api/genesis/verify/boost', { method: 'POST' });
      if (r.ok) {
        setBoostState('done');
        setMe((prev) => (prev ? { ...prev, t2: true } : prev));
      } else {
        setBoostState('idle');
      }
    } catch {
      setBoostState('idle');
    }
  };

  const verifyPost = async () => {
    setPostState('checking');
    try {
      const r = await fetch('/api/genesis/verify/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: postUrl }),
      });
      const d = await r.json();
      if (d.ok && d.verified) {
        setPostState('verified');
        setMe((prev) => (prev ? { ...prev, t3: true } : prev));
      } else if (d.reason === 'not_your_tweet') {
        setPostState('not_yours');
      } else if (d.reason === 'code_missing') {
        setPostState('no_code');
      } else {
        setPostState('error');
      }
    } catch {
      setPostState('error');
    }
  };

  const doCheckin = async () => {
    setCheckinBusy(true);
    try {
      const r = await fetch('/api/genesis/checkin', { method: 'POST' });
      if (r.status === 401) { setSession(null); setMe(null); return; }
      const d = await r.json();
      if (d.ok) {
        setMe((prev) =>
          prev
            ? {
                ...prev,
                checkedInToday: true,
                checkinDays: d.days ?? prev.checkinDays,
                points: prev.points + (d.already ? 0 : 5),
              }
            : prev,
        );
      }
    } catch { /* network hiccup — leave state untouched */ }
    setCheckinBusy(false);
  };

  const verifyCycleTask = async () => {
    setCycleBusy(true);
    setCycleErr('');
    try {
      const r = await fetch('/api/genesis/verify/cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: cycleAddr.trim() }),
      });
      if (r.status === 401) { setSession(null); setMe(null); return; }
      const d = await r.json();
      if (d.ok) {
        setMe((prev) =>
          prev
            ? {
                ...prev,
                cycleClaimedToday: true,
                cycleDays: d.days ?? prev.cycleDays,
                taskWallet: cycleAddr.trim().toLowerCase(),
                points: prev.points + (d.already ? 0 : 150),
              }
            : prev,
        );
      } else {
        setCycleErr(d.reason || d.error || 'error');
      }
    } catch { setCycleErr('error'); }
    setCycleBusy(false);
  };

  const submitFeaturedPost = async () => {
    setFeaturedBusy(true);
    setFeaturedErr('');
    try {
      const r = await fetch('/api/genesis/featured', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: featuredUrl }),
      });
      if (r.status === 401) { setSession(null); setMe(null); return; }
      const d = await r.json();
      if (d.ok) {
        setMe((prev) => (prev ? { ...prev, featured: 'pending' } : prev));
        setFeaturedUrl('');
      } else {
        setFeaturedErr(d.error || 'error');
      }
    } catch {
      setFeaturedErr('error');
    }
    setFeaturedBusy(false);
  };

  return (
    <main className="gz">
      <style>{`
        /* === GENESIS — rides the site theme via cp-* tokens; the hero stays a dark banner === */
        .gz { --c-panel: var(--cp-surface); --c-panel2: var(--cp-bg); --c-line: var(--cp-border);
          --c-cyan: var(--cp-cyan); --c-gold: #FFC94D; --c-text: var(--cp-text);
          --c-muted: var(--cp-text-muted); --c-dim: var(--cp-text-dim);
          color: var(--c-text); font-size: 14px; line-height: 1.6; }
        .light .gz { --c-gold: #a87908; }
        @keyframes gzRise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes gzPulse { 0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0,212,255,.45); } 55% { opacity: .5; box-shadow: 0 0 0 6px rgba(0,212,255,0); } }
        .gz-wrap { max-width: 1120px; margin: 0 auto; padding: 0 24px 72px; }

        /* hero — transparent animated swirl over the page bg: always in theme */
        .gz-hero { position: relative; overflow: hidden; border-bottom: 1px solid var(--c-line); }
        .gz-hero-bg { position: absolute; inset: 0; opacity: .5;
          background: url('/hero-swirl.gif') calc(50% + 300px) center / auto 120% no-repeat; }
        .light .gz-hero-bg { opacity: .38; }
        .gz-hero-shade { position: absolute; inset: 0;
          background: linear-gradient(90deg, var(--cp-bg) 0%, color-mix(in srgb, var(--cp-bg) 94%, transparent) 45%, color-mix(in srgb, var(--cp-bg) 40%, transparent) 72%, transparent 100%); }
        .gz-hero-in { position: relative; max-width: 1120px; margin: 0 auto; padding: 54px 24px 42px;
          color: var(--c-text); animation: gzRise .55s ease both; }
        .gz-eyebrow { display: flex; align-items: center; gap: 10px; font-size: 12px; letter-spacing: 3px;
          color: var(--c-cyan); font-weight: 600; flex-wrap: wrap; }
        .gz-live { display: inline-flex; align-items: center; gap: 7px; padding: 3px 11px;
          border: 1px solid rgba(0,212,255,.4); border-radius: 999px;
          font-size: 10px; letter-spacing: 2px; color: var(--c-cyan); }
        .gz-live i { width: 7px; height: 7px; border-radius: 50%; background: #00D4FF;
          animation: gzPulse 1.8s ease-in-out infinite; }
        .gz-h1 { font-size: 38px; line-height: 1.08; font-weight: 700; letter-spacing: -1px; margin: 14px 0 12px; }
        .gz-h1 b { color: var(--c-cyan); }
        .gz-h1 .gold { color: var(--c-gold); }
        .gz-hero-sub { font-size: 14px; color: var(--c-muted); max-width: 560px; }
        .gz-hero-sub b { color: var(--c-gold); font-weight: 600; }
        .gz-chips { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 22px; }
        .gz-chip { border: 1px solid var(--c-line); background: var(--c-panel); border-radius: 9px;
          padding: 7px 14px; font-size: 11px; letter-spacing: 1.5px; color: var(--c-dim);
          font-family: var(--font-mono, monospace); }
        .gz-chip b { color: var(--c-text); font-weight: 600; }
        .gz-chip .cy { color: var(--c-cyan); }
        .gz-chip .gd { color: var(--c-gold); }

        /* tab bar */
        .gz-tabs { display: flex; gap: 4px; flex-wrap: wrap; margin: 26px 0 24px;
          border: 1px solid var(--c-line); border-radius: 14px; padding: 6px;
          background: var(--c-panel);
          animation: gzRise .5s .05s ease both; }
        .gz-tab { flex: 1; min-width: 120px; display: flex; align-items: center; justify-content: center;
          gap: 8px; background: none; border: none; border-radius: 8px; padding: 11px 12px;
          cursor: pointer; font-family: inherit; transition: background .15s; }
        .gz-tab svg { color: var(--c-dim); flex-shrink: 0; transition: color .15s; }
        .gz-tab:hover { background: var(--cp-hover); }
        .gz-tab.on { background: rgba(0,212,255,.09); box-shadow: inset 0 0 0 1px rgba(0,212,255,.35); }
        .gz-tab-name { font-size: 12.5px; font-weight: 700; letter-spacing: 1.5px; color: var(--c-muted); }
        .gz-tab.on .gz-tab-name { color: var(--c-cyan); }
        .gz-tab.on svg { color: var(--c-cyan); }

        /* panels */
        .gz-panel { background: var(--c-panel); border: 1px solid var(--c-line); border-radius: 16px;
          padding: 24px 26px; margin-bottom: 20px; animation: gzRise .5s ease both; }
        .gz-panel + .gz-panel { animation-delay: .07s; }
        .gz-panel-tag { font-size: 11.5px; letter-spacing: 2.5px; color: var(--c-dim);
          font-family: var(--font-mono, monospace); margin-bottom: 10px; }
        .gz-h2 { font-size: 23px; font-weight: 700; letter-spacing: -0.5px; margin: 0 0 10px; }
        .gz-h2 b { color: var(--c-cyan); }
        .gz-desc { font-size: 13px; color: var(--c-muted); max-width: 640px; margin: 0 0 20px; }
        .gz-desc b { color: var(--c-cyan); font-weight: 600; }

        /* point cards */
        .gz-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; }
        .gz-card { position: relative; background: var(--c-panel2); border: 1px solid var(--c-line);
          border-radius: 12px; padding: 18px 20px; transition: transform .18s ease, border-color .18s ease; }
        .gz-card:hover { transform: translateY(-3px); border-color: rgba(0,212,255,.5); }
        .gz-card-ic { position: absolute; top: 15px; right: 17px; color: var(--c-dim); }
        .gz-card-num { font-size: 34px; font-weight: 700; color: var(--c-gold); letter-spacing: -1px; line-height: 1; }
        .gz-card-num small { font-size: 13px; color: var(--c-dim); letter-spacing: 2px; margin-left: 8px; font-weight: 500; }
        .gz-card-t { font-size: 13px; font-weight: 700; letter-spacing: 1.5px; color: var(--c-text); margin: 14px 0 5px; }
        .gz-card-d { font-size: 12px; color: var(--c-muted); line-height: 1.65; }

        /* buttons */
        .gz-btn { display: inline-flex; align-items: center; gap: 8px; border-radius: 9px; cursor: pointer;
          font-family: inherit; font-size: 13px; font-weight: 700; letter-spacing: 1.5px;
          padding: 11px 20px; text-decoration: none; transition: filter .15s, transform .1s; border: none; }
        .gz-btn:hover { filter: brightness(1.12); }
        .gz-btn:active { transform: translateY(1px); }
        .gz-btn:disabled { opacity: .5; cursor: not-allowed; }
        .gz-btn-cy { background: var(--c-cyan); color: #03131a; }
        .gz-btn-ghost { background: none; border: 1px solid var(--c-line); color: var(--c-text); }
        .gz-btn-ghost:hover { border-color: var(--c-cyan); color: var(--c-cyan); }
        .gz-btn-sm { padding: 8px 14px; font-size: 11px; }

        /* inputs */
        .gz-input { flex: 1; background: var(--cp-bg); border: 1px solid var(--c-line); border-radius: 10px;
          color: var(--c-text); font-family: var(--font-mono, monospace); font-size: 13px;
          padding: 10px 14px; outline: none; min-width: 0; }
        .gz-input:focus { border-color: var(--c-cyan); }
        .gz-label { display: block; font-size: 11.5px; letter-spacing: 1.5px; color: var(--c-dim); margin-bottom: 8px; }

        /* identity */
        .gz-id { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .gz-ava { width: 52px; height: 52px; border-radius: 50%; border: 2px solid var(--c-cyan); object-fit: cover; }
        .gz-handle { font-size: 16px; font-weight: 700; }
        .gz-handle b { color: var(--c-cyan); }
        .gz-handle-sub { font-size: 12px; color: var(--c-dim); font-family: var(--font-mono, monospace); margin-top: 2px; }

        /* stats */
        .gz-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 14px; margin-top: 20px; }
        .gz-stat { background: var(--c-panel2); border: 1px solid var(--c-line); border-radius: 10px;
          padding: 12px 16px; transition: transform .18s ease, border-color .18s ease; }
        .gz-stat:hover { transform: translateY(-2px); border-color: rgba(0,212,255,.45); }
        .gz-stat-n { font-size: 24px; font-weight: 700; color: var(--c-cyan); line-height: 1.1; }
        .gz-stat-n.gold { color: var(--c-gold); }
        .gz-stat-c { font-size: 11px; letter-spacing: 2px; color: var(--c-dim); margin-top: 5px; }

        /* tasks */
        .gz-tasks { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
        .gz-task { background: var(--c-panel2); border: 1px solid var(--c-line); border-radius: 12px;
          padding: 16px 18px; display: flex; flex-direction: column;
          transition: transform .18s ease, border-color .18s ease; }
        .gz-task:hover { transform: translateY(-3px); border-color: rgba(0,212,255,.45); }
        .gz-task-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; margin-bottom: 6px; }
        .gz-task-id { display: inline-flex; align-items: center; gap: 7px; font-size: 12px;
          color: var(--c-dim); font-family: var(--font-mono, monospace); letter-spacing: 1px; }
        .gz-task-t { font-size: 14px; font-weight: 700; letter-spacing: 0.5px; margin: 4px 0 6px; }
        .gz-task-d { font-size: 12px; color: var(--c-muted); line-height: 1.65; }
        .gz-badge { font-size: 11px; letter-spacing: 1.5px; font-weight: 700; padding: 5px 12px; border-radius: 999px; white-space: nowrap; }
        .gz-badge-ok { background: rgba(0,212,255,.12); color: var(--c-cyan); border: 1px solid rgba(0,212,255,.4); }
        .gz-badge-todo { background: rgba(255,201,77,.08); color: var(--c-gold); border: 1px solid rgba(255,201,77,.3); }
        .gz-task-act { margin-top: auto; padding-top: 16px; display: flex; flex-direction: column; gap: 10px; }
        .gz-err { font-size: 12px; color: var(--c-gold); font-family: var(--font-mono, monospace); }
        .gz-link { color: var(--c-cyan); font-size: 13px; font-family: var(--font-mono, monospace);
          letter-spacing: 1px; text-decoration: none; }
        .gz-link:hover { text-decoration: underline; }

        /* og */
        .gz-benefit { display: flex; gap: 10px; align-items: flex-start; padding: 9px 0;
          border-bottom: 1px solid var(--c-line); font-size: 13px; color: var(--c-muted); }
        .gz-benefit:last-of-type { border-bottom: none; }

        /* leaderboard */
        .gz-row { display: grid; grid-template-columns: 60px 1fr 70px 90px 110px; gap: 12px; align-items: center;
          padding: 10px 6px; border-bottom: 1px solid var(--c-line); font-size: 13px; }
        .gz-row.head { font-size: 11px; letter-spacing: 2px; color: var(--c-dim); border-bottom-style: dashed; }
        .gz-rank { font-weight: 700; color: var(--c-dim); }
        .gz-rank.top { color: var(--c-gold); }
        .gz-mono { font-family: var(--font-mono, monospace); }

        /* rules */
        .gz-rule { display: flex; gap: 14px; padding: 14px 6px; border-bottom: 1px solid var(--c-line); }
        .gz-rule:last-child { border-bottom: none; }
        .gz-rule-n { font-size: 13px; color: var(--c-dim); font-family: var(--font-mono, monospace); width: 30px; flex-shrink: 0; padding-top: 3px; }
        .gz-rule-t { font-size: 14px; font-weight: 700; color: var(--c-cyan); letter-spacing: 0.5px; margin-bottom: 6px; }
        .gz-rule-d { font-size: 13px; color: var(--c-muted); line-height: 1.7; }

        .gz-foot { text-align: center; font-size: 12px; letter-spacing: 2px; color: var(--c-dim);
          font-family: var(--font-mono, monospace); padding-top: 36px; }
        .gz-notice { background: rgba(255,201,77,.08); border: 1px solid rgba(255,201,77,.35); color: var(--c-gold);
          border-radius: 10px; padding: 12px 18px; font-size: 13px; letter-spacing: 1px; margin-bottom: 20px;
          font-family: var(--font-mono, monospace); }

        @media (max-width: 720px) {
          .gz-h1 { font-size: 28px; }
          .gz-hero-in { padding: 40px 18px 32px; }
          .gz-panel { padding: 22px 20px; }
          .gz-tab { min-width: 46%; }
          .gz-hero-bg { background-position: right -80px center; opacity: .3; }
        }
      `}</style>

      {/* ═══ HERO ═══ */}
      <div className="gz-hero">
        <div className="gz-hero-bg" />
        <div className="gz-hero-shade" />
        <div className="gz-hero-in">
          <div className="gz-eyebrow">
            <LogoMark size={9} />
            SWIRL // GENESIS CAMPAIGN
            <span className="gz-live"><i />SEATS OPEN</span>
          </div>
          <h1 className="gz-h1">
            SWIRL <b>GENESIS</b> <span className="gold">AIRDROP</span>
          </h1>
          <p className="gz-hero-sub">
            <b>{AIRDROP_TOTAL} SWIRL</b> — 5% of the fixed supply, settled as vSWIRL points to the
            earliest seats.
          </p>
          <div className="gz-chips">
            <span className="gz-chip">ALLOCATION <b className="gd">{AIRDROP_TOTAL} SWIRL</b></span>
            <span className="gz-chip">SUPPLY SHARE <b className="cy">5% · FIXED</b></span>
            <span className="gz-chip">OG SEATS <b>200</b></span>
            <span className="gz-chip">SETTLEMENT <b className="cy">vSWIRL POINTS</b></span>
          </div>
        </div>
      </div>

      <div className="gz-wrap">
        {/* ═══ TAB BAR ═══ */}
        <div className="gz-tabs">
          {TABS.map(([name, icon]) => (
            <button key={name} className={`gz-tab${tab === name ? ' on' : ''}`} onClick={() => setTab(name)}>
              <Ic p={icon} size={15} />
              <span className="gz-tab-name">{name}</span>
            </button>
          ))}
        </div>

        {/* ═══ 01 GENESIS ═══ */}
        {tab === 'GENESIS' && (
          <>
            <div className="gz-panel">
              <div className="gz-panel-tag">SWIRL://GENESIS/POINTS</div>
              <h2 className="gz-h2">{AIRDROP_TOTAL} SWIRL, split by <b>points</b>.</h2>
              <p className="gz-desc">
                Every verified action adds weight to your seat; the snapshot divides the allocation by
                total weight.
              </p>
              <div className="gz-cards">
                {POINT_ROWS.map(([title, pts, icon]) => (
                  <div key={title} className="gz-card">
                    <span className="gz-card-ic"><Ic p={icon} size={17} /></span>
                    <div className="gz-card-num">{pts}<small>vSWIRL</small></div>
                    <div className="gz-card-t">{title}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="gz-panel">
              <div className="gz-panel-tag">SWIRL://GENESIS/OG</div>
              <h2 className="gz-h2">The OG program — <b>200 seats</b>.</h2>
              <p className="gz-desc">
                Applications are reviewed by hand. Approved seats carry the Genesis OG mark and a
                {' '}<b>{OG_GRANT} vSWIRL</b> grant — permanently.
              </p>
              <div style={{ marginBottom: 22 }}>
                {OG_BENEFITS.map((b) => (
                  <div key={b} className="gz-benefit">
                    <CheckIcon />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button className="gz-btn gz-btn-cy" onClick={() => setTab('TASKS')}>
                  START WITH THE TASKS →
                </button>
                <button className="gz-btn gz-btn-ghost" onClick={() => setTab('OG APPLICATION')}>
                  OG APPLICATION →
                </button>
              </div>
            </div>
          </>
        )}

        {/* ═══ 02 TASKS ═══ */}
        {tab === 'TASKS' && (
          <>
            {authError && (
              <div className="gz-notice">X AUTHORIZATION FAILED — {authError} · TRY AGAIN BELOW</div>
            )}

            {/* identity */}
            <div className="gz-panel">
              <div className="gz-panel-tag">SWIRL://GENESIS/IDENTITY · {session ? 'CONNECTED' : 'OAUTH 2.0 · PKCE'}</div>
              {!session ? (
                <>
                  <h2 className="gz-h2">Bind your <b>X account</b>.</h2>
                  <p className="gz-desc">
                    One X account, one seat. We read your handle — nothing else.
                  </p>
                  <a className="gz-btn gz-btn-cy" href="/api/genesis/auth/x">
                    <XIcon />
                    CONNECT X
                  </a>
                </>
              ) : (
                <>
                  <div className="gz-id">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      {session.avatar && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="gz-ava" src={session.avatar} alt="" />
                      )}
                      <div>
                        <div className="gz-handle">
                          <b>@{session.handle}</b>
                          <span style={{ color: 'var(--c-dim)', fontSize: 14, fontWeight: 400 }}> · {session.name}</span>
                        </div>
                        <div className="gz-handle-sub">SEAT ACTIVE · X ID {session.id}</div>
                      </div>
                    </div>
                    <button className="gz-btn gz-btn-ghost gz-btn-sm" onClick={disconnect}>DISCONNECT</button>
                  </div>

                  <div style={{ marginTop: 26, paddingTop: 22, borderTop: '1px dashed var(--c-line)' }}>
                    <label className="gz-label">YOUR INVITE LINK</label>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <input className="gz-input" readOnly value={inviteLink || '…'} onFocus={(e) => e.target.select()} />
                      <button className="gz-btn gz-btn-ghost gz-btn-sm" onClick={() => inviteLink && copy(inviteLink, 'link')}>
                        {copied === 'link' ? 'COPIED ✓' : 'COPY'}
                      </button>
                    </div>
                  </div>

                  <div className="gz-stats">
                    <div className="gz-stat">
                      <div className="gz-stat-n">{me?.direct ?? 0}</div>
                      <div className="gz-stat-c">DIRECT SEATS · +200 EACH</div>
                    </div>
                    <div className="gz-stat">
                      <div className="gz-stat-n">{me?.tier2 ?? 0}</div>
                      <div className="gz-stat-c">TIER-2 SEATS · +50 EACH</div>
                    </div>
                    <div className="gz-stat">
                      <div className="gz-stat-n gold">{me?.points ?? 0}</div>
                      <div className="gz-stat-c">POINTS · vSWIRL</div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* task set */}
            {!session ? (
              <div className="gz-panel" style={{ textAlign: 'center', padding: '60px 32px' }}>
                <h2 className="gz-h2" style={{ marginBottom: 0 }}>Connect your X account to start the tasks.</h2>
              </div>
            ) : (
              <div className="gz-panel">
                <div className="gz-panel-tag">SWIRL://GENESIS/TASKS</div>
                <h2 className="gz-h2">Complete all three tasks: <b>+1,000 vSWIRL</b>.</h2>

                <div className="gz-tasks">
                  {/* T1 */}
                  <div className="gz-task">
                    <div className="gz-task-top">
                      <span className="gz-task-id"><Ic p={IC.follow} size={13} />T1 · SOCIAL GRAPH</span>
                      {followState === 'verified'
                        ? <span className="gz-badge gz-badge-ok">✓ VERIFIED</span>
                        : <span className="gz-badge gz-badge-todo">PENDING</span>}
                    </div>
                    {followState === 'verified' ? (
                      <div className="gz-task-d">Completed.</div>
                    ) : (
                      <>
                        <div className="gz-task-t">Follow @swirlbtc</div>
                        <div className="gz-task-d">Follow us on X, then verify below.</div>
                      </>
                    )}
                    {followState !== 'verified' && (
                      <div className="gz-task-act">
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          <a
                            href="https://twitter.com/intent/follow?screen_name=swirlbtc"
                            target="_blank"
                            rel="noreferrer"
                            className="gz-btn gz-btn-ghost gz-btn-sm"
                          >
                            FOLLOW ↗
                          </a>
                          <button
                            className="gz-btn gz-btn-cy gz-btn-sm"
                            disabled={followState === 'checking'}
                            onClick={verifyFollow}
                          >
                            {followState === 'checking' ? 'CHECKING…' : 'VERIFY'}
                          </button>
                        </div>
                        {followState === 'missing' && (
                          <div className="gz-err">not detected yet — follow @swirlbtc, then re-check</div>
                        )}
                        {followState === 'error' && (
                          <div className="gz-err">upstream lookup failed — try again in a moment</div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* T2 */}
                  <div className="gz-task">
                    <div className="gz-task-top">
                      <span className="gz-task-id"><Ic p={IC.boost} size={13} />T2 · AMPLIFICATION</span>
                      {boostState === 'done'
                        ? <span className="gz-badge gz-badge-ok">✓ DONE</span>
                        : <span className="gz-badge gz-badge-todo">PENDING</span>}
                    </div>
                    {boostState === 'done' ? (
                      <div className="gz-task-d">Completed.</div>
                    ) : (
                      <>
                        <div className="gz-task-t">Like and repost</div>
                        <div className="gz-task-d">Open the campaign post — like it and repost it.</div>
                      </>
                    )}
                    {boostState !== 'done' && (
                      <div className="gz-task-act">
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          <a href={LIKE_INTENT} target="_blank" rel="noreferrer" className="gz-btn gz-btn-ghost gz-btn-sm">
                            LIKE ↗
                          </a>
                          <a href={RT_INTENT} target="_blank" rel="noreferrer" className="gz-btn gz-btn-ghost gz-btn-sm">
                            REPOST ↗
                          </a>
                          <button className="gz-btn gz-btn-cy gz-btn-sm" disabled={boostState === 'saving'} onClick={confirmBoost}>
                            {boostState === 'saving' ? 'CHECKING…' : 'VERIFY'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* T3 */}
                  <div className="gz-task">
                    <div className="gz-task-top">
                      <span className="gz-task-id"><Ic p={IC.voice} size={13} />T3 · YOUR VOICE</span>
                      {postState === 'verified'
                        ? <span className="gz-badge gz-badge-ok">✓ VERIFIED</span>
                        : <span className="gz-badge gz-badge-todo">PENDING</span>}
                    </div>
                    {postState === 'verified' ? (
                      <div className="gz-task-d">Completed.</div>
                    ) : (
                      <>
                        <div className="gz-task-t">Post your invite link</div>
                        <div className="gz-task-d">Post a tweet, then paste the link here.</div>
                      </>
                    )}
                    {postState !== 'verified' && (
                      <div className="gz-task-act">
                        <a href={intentUrl} target="_blank" rel="noreferrer" className="gz-btn gz-btn-cy gz-btn-sm" style={{ alignSelf: 'flex-start' }}>
                          <XIcon size={13} />
                          POST NOW
                        </a>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <input
                            className="gz-input"
                            placeholder="paste your post link — x.com/you/status/…"
                            value={postUrl}
                            onChange={(e) => setPostUrl(e.target.value)}
                          />
                          <button className="gz-btn gz-btn-ghost gz-btn-sm" disabled={postState === 'checking' || !postUrl.trim()} onClick={verifyPost}>
                            {postState === 'checking' ? 'CHECKING…' : 'VERIFY'}
                          </button>
                        </div>
                        {postState === 'not_yours' && (
                          <div className="gz-err">that post belongs to a different account — post from @{session.handle}</div>
                        )}
                        {postState === 'no_code' && (
                          <div className="gz-err">your invite code {me?.code} is not in that post — use the pre-filled button</div>
                        )}
                        {postState === 'error' && (
                          <div className="gz-err">could not read that post — check the link and retry</div>
                        )}
                      </div>
                    )}
                  </div>

                </div>

                {/* optional extras */}
                <div style={{ borderTop: '1px dashed var(--c-line)', marginTop: 26, paddingTop: 22 }}>
                  <div className="gz-panel-tag">SWIRL://GENESIS/EXTRA · OPTIONAL</div>
                  <div className="gz-tasks" style={{ marginTop: 16 }}>
                    {/* D1 — daily check-in */}
                    <div className="gz-task">
                      <div className="gz-task-top">
                        <span className="gz-task-id"><Ic p={IC.daily} size={13} />D1 · DAILY</span>
                        {me?.checkedInToday
                          ? <span className="gz-badge gz-badge-ok">✓ TODAY</span>
                          : <span className="gz-badge gz-badge-todo">+5 vSWIRL</span>}
                      </div>
                      <div className="gz-task-t">Daily check-in</div>
                      <div className="gz-task-d">
                        +5 vSWIRL for every day you show up. Streak: {me?.checkinDays ?? 0} day{(me?.checkinDays ?? 0) === 1 ? '' : 's'}.
                      </div>
                      {!me?.checkedInToday && (
                        <div className="gz-task-act">
                          <button
                            className="gz-btn gz-btn-cy gz-btn-sm"
                            style={{ alignSelf: 'flex-start' }}
                            disabled={checkinBusy}
                            onClick={doCheckin}
                          >
                            {checkinBusy ? 'RECORDING…' : 'CHECK IN +5'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* D2 — featured post, manual review */}
                    <div className="gz-task">
                      <div className="gz-task-top">
                        <span className="gz-task-id"><Ic p={IC.star} size={13} />D2 · FEATURED · REVIEWED BY HAND</span>
                        {me?.featured === 'approved'
                          ? <span className="gz-badge gz-badge-ok">✓ +5,000</span>
                          : me?.featured === 'pending'
                            ? <span className="gz-badge gz-badge-todo">IN REVIEW</span>
                            : me?.featured === 'rejected'
                              ? <span className="gz-badge gz-badge-todo">REJECTED</span>
                              : <span className="gz-badge gz-badge-todo">+5,000 vSWIRL</span>}
                      </div>
                      <div className="gz-task-t">Featured post</div>
                      <div className="gz-task-d">
                        Publish a standout post about SWIRL and paste the link. Manual review — once approved, +5,000 vSWIRL. OG seats cannot earn it twice.
                      </div>
                      {(me?.featured === 'none' || me?.featured === 'rejected' || !me?.featured) && (
                        <div className="gz-task-act">
                          <div style={{ display: 'flex', gap: 10 }}>
                            <input
                              className="gz-input"
                              placeholder="paste your post link — x.com/you/status/…"
                              value={featuredUrl}
                              onChange={(e) => setFeaturedUrl(e.target.value)}
                            />
                            <button className="gz-btn gz-btn-cy gz-btn-sm" disabled={featuredBusy || !featuredUrl.trim()} onClick={submitFeaturedPost}>
                              {featuredBusy ? 'SENDING…' : 'SUBMIT'}
                            </button>
                          </div>
                          {featuredErr === 'bad_url' && (
                            <div className="gz-err">that is not a post link — it should look like x.com/you/status/…</div>
                          )}
                          {featuredErr === 'og_excluded' && (
                            <div className="gz-err">OG seats already hold their grant — this reward cannot be earned twice</div>
                          )}
                          {featuredErr === 'in_review' && (
                            <div className="gz-err">a previous link is already under review</div>
                          )}
                          {featuredErr === 'already_rewarded' && (
                            <div className="gz-err">already rewarded — the +5,000 lands only once</div>
                          )}
                          {featuredErr === 'error' && (
                            <div className="gz-err">submit failed — try again in a moment</div>
                          )}
                        </div>
                      )}
                      {me?.featured === 'pending' && (
                        <div className="gz-task-d" style={{ marginTop: 10 }}>under manual review — result lands on your seat</div>
                      )}
                    </div>

                    {/* D3 — daily Shield + Unshield cycle, mainnet, verified on-chain */}
                    <div className="gz-task">
                      <div className="gz-task-top">
                        <span className="gz-task-id"><Ic p={IC.shield} size={13} />D3 · DAILY · ETHEREUM MAINNET</span>
                        {me?.cycleClaimedToday
                          ? <span className="gz-badge gz-badge-ok">✓ TODAY</span>
                          : <span className="gz-badge gz-badge-todo">+150 vSWIRL</span>}
                      </div>
                      <div className="gz-task-t">Shield + Unshield cycle</div>
                      <div className="gz-task-d">
                        On Ethereum mainnet, shield any amount and unshield it back — one pair, both sides, same UTC day. We verify the pair on-chain against the address you submit. +150 vSWIRL per day · days completed: {me?.cycleDays ?? 0}.
                      </div>
                      {!me?.cycleClaimedToday && (
                        <div className="gz-task-act">
                          <div style={{ display: 'flex', gap: 10 }}>
                            <input
                              className="gz-input"
                              placeholder="your EVM wallet address — 0x…"
                              value={cycleAddr}
                              onChange={(e) => setCycleAddr(e.target.value)}
                              spellCheck={false}
                            />
                            <button
                              className="gz-btn gz-btn-cy gz-btn-sm"
                              disabled={cycleBusy || !/^0x[0-9a-fA-F]{40}$/.test(cycleAddr.trim())}
                              onClick={verifyCycleTask}
                            >
                              {cycleBusy ? 'VERIFYING…' : 'VERIFY +150'}
                            </button>
                          </div>
                          {cycleErr === 'bad_address' && (
                            <div className="gz-err">that is not a valid EVM address — it should look like 0x…</div>
                          )}
                          {cycleErr === 'no_shield' && (
                            <div className="gz-err">no mainnet Shield from this address found today (UTC) — shield first, wait for confirmation, then verify</div>
                          )}
                          {cycleErr === 'no_unshield' && (
                            <div className="gz-err">Shield found, but no matching Unshield today — the pair must complete within the same UTC day</div>
                          )}
                          {cycleErr === 'address_used' && (
                            <div className="gz-err">this address already claimed today&apos;s reward on another seat</div>
                          )}
                          {cycleErr === 'verify_unavailable' && (
                            <div className="gz-err">chain lookup unavailable — try again in a moment</div>
                          )}
                          {cycleErr === 'rate_limited' && (
                            <div className="gz-err">too many attempts — wait a minute and retry</div>
                          )}
                          {cycleErr === 'error' && (
                            <div className="gz-err">verification failed — try again in a moment</div>
                          )}
                        </div>
                      )}
                      {me?.cycleClaimedToday && me.taskWallet && (
                        <div className="gz-task-d" style={{ marginTop: 10 }}>verified with {me.taskWallet.slice(0, 8)}…{me.taskWallet.slice(-6)} · come back tomorrow</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ═══ 03 OG APPLICATION ═══ */}
        {tab === 'OG APPLICATION' && (
          <div className="gz-panel">
            <div className="gz-panel-tag">SWIRL://GENESIS/OG · 200 SEATS · MANUAL REVIEW</div>
            <h2 className="gz-h2">Become a <b>Genesis OG</b>.</h2>
            <p className="gz-desc">
              Fill the form; approved seats receive OG status and <b>{OG_GRANT} vSWIRL</b>. Results by
              X DM — keep your messages open.
            </p>

            <div className="gz-stats" style={{ marginTop: 0, marginBottom: 26 }}>
              <div className="gz-stat">
                <div className="gz-stat-n gold">200</div>
                <div className="gz-stat-c">GENESIS OG SEATS</div>
              </div>
              <div className="gz-stat">
                <div className="gz-stat-n gold">{OG_GRANT}</div>
                <div className="gz-stat-c">vSWIRL GRANT ON APPROVAL</div>
              </div>
              <div className="gz-stat">
                <div className="gz-stat-n">×3</div>
                <div className="gz-stat-c">AIRDROP WEIGHT</div>
              </div>
              <div className="gz-stat">
                <div className="gz-stat-n">1.5×</div>
                <div className="gz-stat-c">MINING BOOST · PERMANENT</div>
              </div>
            </div>

            <div style={{ marginBottom: 26 }}>
              {OG_BENEFITS.map((b) => (
                <div key={b} className="gz-benefit">
                  <CheckIcon />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a className="gz-btn gz-btn-cy" href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer">
                FILL THE APPLICATION →
              </a>
              <a className="gz-btn gz-btn-ghost" href={X_URL} target="_blank" rel="noopener noreferrer">
                <XIcon /> OFFICIAL X →
              </a>
            </div>
          </div>
        )}

        {/* ═══ 04 LEADERBOARD ═══ */}
        {tab === 'LEADERBOARD' && (
          <div className="gz-panel">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
              <div style={{ minWidth: 260, flex: 1 }}>
                <div className="gz-panel-tag">SWIRL://GENESIS/BOARD · LIVE</div>
                <h2 className="gz-h2">Ranked by what you <b>bring</b>.</h2>
                <p className="gz-desc">
                  Points decide the split of the {AIRDROP_TOTAL} SWIRL — every seated account, ranked live.
                </p>
              </div>
              {session && myRank?.breakdown && (
                <button
                  className="gz-btn gz-btn-cy gz-btn-sm"
                  style={{ flexShrink: 0, marginTop: 6 }}
                  onClick={() => setPointsOpen(true)}
                >
                  MY POINTS · {myRank.breakdown.total.toLocaleString('en-US')} vSWIRL
                </button>
              )}
            </div>

            {session && myRank && (
              <div className="gz-row" style={{ border: '1px solid rgba(0,212,255,.35)', borderRadius: 10, background: 'rgba(0,212,255,.06)', marginBottom: 14 }}>
                <span className="gz-rank top">#{myRank.rank}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  {session.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.avatar} alt="" style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--c-line)', flexShrink: 0 }} />
                  ) : (
                    <span style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--c-line)', flexShrink: 0, display: 'inline-block' }} />
                  )}
                  <span className="gz-mono" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{session.handle} · YOU</span>
                </span>
                <span style={{ textAlign: 'center' }}>{me?.og ? <span title="GENESIS OG" style={{ display: 'inline-flex' }}><OgIcon size={20} /></span> : <span style={{ color: 'var(--c-dim)' }}>—</span>}</span>
                <span style={{ textAlign: 'right', color: 'var(--c-muted)' }}>{(me?.direct ?? 0) + (me?.tier2 ?? 0)}</span>
                <span className="gz-mono" style={{ textAlign: 'right', color: 'var(--c-cyan)' }}>{(me?.points ?? 0).toLocaleString('en-US')}</span>
              </div>
            )}

            <div className="gz-row head">
              <span>RANK</span><span>SEAT</span>
              <span style={{ textAlign: 'center' }}>IDENTITY</span>
              <span style={{ textAlign: 'right' }}>INVITES</span>
              <span style={{ textAlign: 'right' }}>POINTS</span>
            </div>
            {board === null && (
              <div style={{ padding: '28px 6px', fontSize: 12, color: 'var(--c-dim)', fontFamily: 'var(--font-mono, monospace)', letterSpacing: 2 }}>
                READING THE CHAIN…
              </div>
            )}
            {board !== null && board.length === 0 && (
              <div style={{ padding: '28px 6px', fontSize: 13, color: 'var(--c-muted)' }}>
                No seats ranked yet — the first row could be yours.
              </div>
            )}
            {board?.map((r, i) => (
              <div key={r.handle} className="gz-row">
                <span className={`gz-rank${i < 3 ? ' top' : ''}`}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  {r.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.avatar} alt="" style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--c-line)', flexShrink: 0 }} />
                  ) : (
                    <span style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid var(--c-line)', flexShrink: 0, display: 'inline-block' }} />
                  )}
                  <span className="gz-mono" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{r.handle}</span>
                </span>
                <span style={{ textAlign: 'center' }}>
                  {r.og
                    ? <span title="GENESIS OG" style={{ display: 'inline-flex' }}><OgIcon size={20} /></span>
                    : <span style={{ color: 'var(--c-dim)' }}>—</span>}
                </span>
                <span style={{ textAlign: 'right', color: 'var(--c-muted)' }}>{r.direct + r.tier2}</span>
                <span className="gz-mono" style={{ textAlign: 'right', color: 'var(--c-cyan)' }}>{r.points.toLocaleString('en-US')}</span>
              </div>
            ))}

            <div className="gz-chips" style={{ marginTop: 24 }}>
              <span className="gz-chip">SCORING <b>+1,000 SET · +200 DIRECT · +50 TIER-2</b></span>
              <span className="gz-chip">IDENTITY <b>LIVE X PROFILE</b></span>
              <span className="gz-chip">SNAPSHOT <b className="cy">AT GENESIS BLOCK</b></span>
            </div>
          </div>
        )}

        {/* ═══ 05 RULES ═══ */}
        {tab === 'RULES' && (
          <div className="gz-panel">
            <div className="gz-panel-tag">SWIRL://GENESIS/RULES · FINAL</div>
            <h2 className="gz-h2">Airdrop <b>rules</b>.</h2>
            {[
              ['01', 'ONE ACCOUNT, ONE SEAT', 'One X account, one seat. Farmed accounts are cut at the snapshot.'],
              ['02', 'vSWIRL IS NOT SWIRL', 'Points are paid as vSWIRL — a voucher that cannot be transferred. At the snapshot, vSWIRL converts into SWIRL from the genesis allocation by weight. Unclaimed vSWIRL goes back to the DAO treasury.'],
              ['03', 'THE SNAPSHOT IS FINAL', 'Your X seat and points are locked at the snapshot. Nothing changes after it.'],
              ['04', '200 OG SEATS, NO MORE', 'OG status is granted by manual review only, capped at 200 seats forever.'],
            ].map(([n, t, d]) => (
              <div key={n} className="gz-rule">
                <span className="gz-rule-n">{n}</span>
                <div>
                  <div className="gz-rule-t">{t}</div>
                  <div className="gz-rule-d">{d}</div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* my points breakdown modal */}
      {pointsOpen && myRank?.breakdown && (
        <div
          onClick={() => setPointsOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.65)', backdropFilter: 'blur(3px)', zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <div className="gz-panel" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 400, width: '100%' }}>
            <div className="gz-panel-tag">SWIRL://GENESIS/POINTS · @{session?.handle}</div>
            <h2 className="gz-h2" style={{ marginBottom: 14 }}>Your points, by source</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {([
                ['TASK SET', '+1,000 for all three tasks', myRank.breakdown.tasks],
                ['DIRECT INVITES', '+200 per seat', myRank.breakdown.direct],
                ['TIER-2 INVITES', '+50 per seat', myRank.breakdown.tier2],
                ['DAILY CHECK-IN', '+5 per day', myRank.breakdown.daily],
                ['SHIELD + UNSHIELD', '+150 per day', myRank.breakdown.cycle],
                ['FEATURED POST', '+5,000 once, reviewed', myRank.breakdown.featured],
              ] as Array<[string, string, number]>).map(([label, hint, pts]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px dashed var(--c-line)', opacity: pts > 0 ? 1 : .45 }}>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: 1, fontFamily: 'var(--font-mono, monospace)' }}>{label}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--c-muted)' }}>{hint}</div>
                  </div>
                  <span className="gz-mono" style={{ fontSize: 14, color: pts > 0 ? 'var(--c-cyan)' : 'var(--c-dim)' }}>+{pts.toLocaleString('en-US')}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14 }}>
                <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: 1.5, fontFamily: 'var(--font-mono, monospace)' }}>TOTAL</span>
                <span className="gz-mono" style={{ fontSize: 17, fontWeight: 800, color: 'var(--c-gold)' }}>{myRank.breakdown.total.toLocaleString('en-US')} vSWIRL</span>
              </div>
              <button className="gz-btn gz-btn-cy gz-btn-sm" style={{ alignSelf: 'flex-end', marginTop: 10 }} onClick={() => setPointsOpen(false)}>
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
