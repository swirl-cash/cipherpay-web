import fs from 'node:fs';
import path from 'node:path';
import { randomBytes } from 'node:crypto';

/* Genesis seat registry — flat JSON store, atomic writes, in-process cache.
   Lives outside the deploy dir so redeploys never touch it. */

const DIR = process.env.GENESIS_DATA_DIR || '/var/lib/sbt20';
const FILE = path.join(DIR, 'genesis.json');

export type FeaturedStatus = 'pending' | 'approved' | 'rejected';

export interface SeatRec {
  id: string;              // X numeric user id
  handle: string;
  name: string;
  avatar: string;
  code: string;            // fixed personal invite code, generated once — short form SWIRL-XXXX
  referrer: string | null; // inviter's X id, bound once, never rebound
  t1: boolean;             // FOLLOW task verified
  t2: boolean;             // BOOST (like + repost) task
  t3: boolean;             // POST task verified via oEmbed
  wallet: string | null;   // RGB wallet address for the snapshot settlement
  og: boolean;             // Genesis OG mark — granted on application approval, permanent
  lastCheckin: string | null; // UTC date of the last daily check-in (YYYY-MM-DD)
  checkinDays: number;        // total check-in days — +5 vSWIRL each
  featured: { url: string; status: FeaturedStatus; at: number } | null; // featured post — manual review, one-time
  taskWallet: string | null;   // EVM address submitted for the privacy-cycle task
  cycleLastClaim: string | null; // UTC date of the last privacy-cycle claim
  cycleDays: number;            // completed Shield+Unshield cycle days — +150 vSWIRL each
  createdAt: number;
}

interface Store {
  seats: Record<string, SeatRec>;
  cycleClaims?: Record<string, string>; // `${YYYY-MM-DD}:${address}` -> seat id — one claim per address per day
}

let cache: Store | null = null;

function load(): Store {
  if (cache) return cache;
  try {
    cache = JSON.parse(fs.readFileSync(FILE, 'utf8')) as Store;
  } catch {
    cache = { seats: {} };
  }
  if (!cache.seats) cache.seats = {};
  // one-time migrations
  let dirty = false;
  if (!cache.cycleClaims) { cache.cycleClaims = {}; dirty = true; }
  for (const u of Object.values(cache.seats)) {
    if (u.code.startsWith('sbt20-genesis-')) {
      u.code = newCode(cache);
      dirty = true;
    }
    // rebrand migration: SBT20-XXXX → SWIRL-XXXX (tail kept, old links
    // still resolve via the alias in lookupByCode / bindReferrer)
    if (u.code.startsWith('SBT20-')) {
      const c = `SWIRL-${u.code.slice(6)}`;
      if (!Object.values(cache.seats).some((x) => x !== u && x.code === c)) {
        u.code = c;
        dirty = true;
      }
    }
    if (typeof u.t2 !== 'boolean') { u.t2 = false; dirty = true; }
    if (typeof u.t3 !== 'boolean') { u.t3 = false; dirty = true; }
    if (typeof u.og !== 'boolean') { u.og = false; dirty = true; }
    if (typeof u.lastCheckin !== 'string' && u.lastCheckin !== null) { u.lastCheckin = null; dirty = true; }
    if (typeof u.checkinDays !== 'number') { u.checkinDays = 0; dirty = true; }
    if (typeof u.featured === 'undefined') { u.featured = null; dirty = true; }
    if (typeof u.taskWallet !== 'string' && u.taskWallet !== null) { u.taskWallet = null; dirty = true; }
    if (typeof u.cycleLastClaim !== 'string' && u.cycleLastClaim !== null) { u.cycleLastClaim = null; dirty = true; }
    if (typeof u.cycleDays !== 'number') { u.cycleDays = 0; dirty = true; }
  }
  if (dirty) save(cache);
  return cache;
}

function save(s: Store) {
  fs.mkdirSync(DIR, { recursive: true });
  const tmp = `${FILE}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(s, null, 1));
  fs.renameSync(tmp, FILE);
  cache = s;
}

const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no 0/O/1/I/L — stays readable in tweets

function newCode(s: Store): string {
  for (let i = 0; i < 50; i++) {
    const raw = randomBytes(4);
    const tail = Array.from(raw).map((b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
    const c = `SWIRL-${tail}`;
    if (!Object.values(s.seats).some((u) => u.code === c)) return c;
  }
  return `SWIRL-${randomBytes(5).toString('hex').toUpperCase().slice(0, 6)}`;
}

export function getSeatAvatar(id: string): string {
  return load().seats[id]?.avatar || '';
}

/* Create the seat on first login; refresh profile fields on every login.
   The invite code is minted once and never changes. */
export function ensureSeat(p: { id: string; handle: string; name: string; avatar: string }): SeatRec {
  const s = load();
  const existing = s.seats[p.id];
  if (existing) {
    existing.handle = p.handle;
    existing.name = p.name;
    // Older session cookies may not contain an avatar. Never erase a
    // previously saved profile image with an empty value from those cookies.
    if (p.avatar) existing.avatar = p.avatar;
    save(s);
    return existing;
  }
  const rec: SeatRec = {
    ...p,
    code: newCode(s),
    referrer: null,
    t1: false,
    t2: false,
    t3: false,
    wallet: null,
    og: false,
    lastCheckin: null,
    checkinDays: 0,
    featured: null,
    taskWallet: null,
    cycleLastClaim: null,
    cycleDays: 0,
    createdAt: Date.now(),
  };
  s.seats[p.id] = rec;
  save(s);
  return rec;
}

/* Legacy SBT20-XXXX invite codes keep working after the SWIRL rebrand. */
function normCode(code: string): string {
  return code.startsWith('SBT20-') ? `SWIRL-${code.slice(6)}` : code;
}

/* Bind a referrer once: code must exist, no self-invite, never rebound. */
export function bindReferrer(id: string, refCode: string): { ok: boolean; reason?: string } {
  const s = load();
  const me = s.seats[id];
  if (!me) return { ok: false, reason: 'no_seat' };
  if (me.referrer) return { ok: false, reason: 'already_bound' };
  const inviter = Object.values(s.seats).find((u) => u.code === normCode(refCode));
  if (!inviter) return { ok: false, reason: 'bad_code' };
  if (inviter.id === id) return { ok: false, reason: 'self_invite' };
  me.referrer = inviter.id;
  save(s);
  return { ok: true };
}

export function markT1(id: string) {
  const s = load();
  const me = s.seats[id];
  if (me && !me.t1) {
    me.t1 = true;
    save(s);
  }
}

export function markT2(id: string) {
  const s = load();
  const me = s.seats[id];
  if (me && !me.t2) {
    me.t2 = true;
    save(s);
  }
}

export function markT3(id: string) {
  const s = load();
  const me = s.seats[id];
  if (me && !me.t3) {
    me.t3 = true;
    save(s);
  }
}

/* Public, minimal view of a seat for the share card — no wallet, no stats. */
export function lookupByCode(code: string): { handle: string; name: string; avatar: string; code: string } | null {
  const s = load();
  const seat = Object.values(s.seats).find((u) => u.code === normCode(code));
  if (!seat) return null;
  return { handle: seat.handle, name: seat.name, avatar: seat.avatar, code: seat.code };
}

/* Grant / revoke the Genesis OG mark. Manual operator action after review. */
export function setOg(id: string, flag: boolean) {
  const s = load();
  const me = s.seats[id];
  if (me) {
    me.og = flag;
    save(s);
  }
}

/* ── scoring ── */
export const CHECKIN_POINTS = 5;
export const FEATURED_POINTS = 5000;
export const CYCLE_POINTS = 150;

function pointsOf(all: SeatRec[], me: SeatRec): { direct: number; tier2: number; points: number } {
  const direct = all.filter((u) => u.referrer === me.id);
  const directIds = new Set(direct.map((u) => u.id));
  const tier2 = all.filter((u) => u.referrer && directIds.has(u.referrer)).length;
  const fullSet = me.t1 && me.t2 && me.t3;
  // featured bonus: one-time, and OG seats already hold their grant — no stacking
  const featuredBonus = me.featured?.status === 'approved' && !me.og ? FEATURED_POINTS : 0;
  const points =
    direct.length * 200 +
    tier2 * 50 +
    (fullSet ? 1000 : 0) +
    me.checkinDays * CHECKIN_POINTS +
    me.cycleDays * CYCLE_POINTS +
    featuredBonus;
  return { direct: direct.length, tier2, points };
}

/* ── daily check-in ── */
export function todayUtc(): string {
  return new Date().toISOString().slice(0, 10);
}

export function checkin(id: string): { ok: boolean; already?: boolean; days?: number } {
  const s = load();
  const me = s.seats[id];
  if (!me) return { ok: false };
  const today = todayUtc();
  if (me.lastCheckin === today) return { ok: true, already: true, days: me.checkinDays };
  me.lastCheckin = today;
  me.checkinDays += 1;
  save(s);
  return { ok: true, days: me.checkinDays };
}

/* ── daily privacy cycle (Shield + Unshield on mainnet) ── */

/* Remember the address a seat verifies with, so returning players prefill. */
export function bindTaskWallet(id: string, address: string) {
  const s = load();
  const me = s.seats[id];
  if (!me) return;
  me.taskWallet = address.toLowerCase();
  save(s);
}

/* Award today's cycle once per seat, and once per address across all seats —
   on-chain activity cannot be double-claimed by two X accounts. */
export function claimCycle(id: string, address: string): { ok: boolean; already?: boolean; reason?: string; days?: number } {
  const s = load();
  const me = s.seats[id];
  if (!me) return { ok: false, reason: 'no_seat' };
  const today = todayUtc();
  if (me.cycleLastClaim === today) return { ok: true, already: true, days: me.cycleDays };
  const claims = s.cycleClaims ?? (s.cycleClaims = {});
  const key = `${today}:${address.toLowerCase()}`;
  const holder = claims[key];
  if (holder && holder !== id) return { ok: false, reason: 'address_used' };
  claims[key] = id;
  me.cycleLastClaim = today;
  me.cycleDays += 1;
  save(s);
  return { ok: true, days: me.cycleDays };
}

/* ── featured post (manual review) ── */
export function submitFeatured(id: string, url: string): { ok: boolean; reason?: string } {
  const s = load();
  const me = s.seats[id];
  if (!me) return { ok: false, reason: 'no_seat' };
  if (me.og) return { ok: false, reason: 'og_excluded' };
  if (me.featured?.status === 'pending') return { ok: false, reason: 'in_review' };
  if (me.featured?.status === 'approved') return { ok: false, reason: 'already_rewarded' };
  me.featured = { url, status: 'pending', at: Date.now() };
  save(s);
  return { ok: true };
}

/* Operator review action on a featured submission. */
export function reviewFeatured(id: string, status: FeaturedStatus) {
  const s = load();
  const me = s.seats[id];
  if (me?.featured) {
    me.featured.status = status;
    save(s);
  }
}

export interface SeatStats {
  code: string;
  direct: number;   // seats I brought
  tier2: number;    // seats my invitees brought
  points: number;   // invites + full set + check-ins + cycles + featured bonus
  t1: boolean;
  t2: boolean;
  t3: boolean;
  referrer: string | null;
  og: boolean;
  checkinDays: number;
  checkedInToday: boolean;
  featured: FeaturedStatus | 'none';
  taskWallet: string | null;
  cycleDays: number;
  cycleClaimedToday: boolean;
}

export function statsFor(id: string): SeatStats | null {
  const s = load();
  const me = s.seats[id];
  if (!me) return null;
  const { direct, tier2, points } = pointsOf(Object.values(s.seats), me);
  return {
    code: me.code,
    direct,
    tier2,
    points,
    t1: me.t1,
    t2: me.t2,
    t3: me.t3,
    referrer: me.referrer,
    og: me.og,
    checkinDays: me.checkinDays,
    checkedInToday: me.lastCheckin === todayUtc(),
    featured: me.featured?.status ?? 'none',
    taskWallet: me.taskWallet,
    cycleDays: me.cycleDays,
    cycleClaimedToday: me.cycleLastClaim === todayUtc(),
  };
}

export interface BoardRow {
  handle: string;
  name: string;
  avatar: string;
  og: boolean;
  direct: number;
  tier2: number;
  points: number;
}

/* Public leaderboard: every seated account, ranked by points. */
function rankedRows(): Array<BoardRow & { id: string }> {
  const s = load();
  const all = Object.values(s.seats);
  const rows = all.map((me) => {
    const { direct, tier2, points } = pointsOf(all, me);
    return {
      id: me.id,
      handle: me.handle,
      name: me.name,
      avatar: me.avatar,
      og: !!me.og,
      direct,
      tier2,
      points,
    };
  });
  rows.sort((a, b) => b.points - a.points || b.direct - a.direct || a.handle.localeCompare(b.handle));
  return rows;
}

export function leaderboard(limit = 50): BoardRow[] {
  return rankedRows().slice(0, limit).map(({ id: _id, ...r }) => r);
}

/* Where one seat stands in the full ranking (1-based), even beyond the public top list. */
export function seatRank(id: string): { rank: number; total: number } | null {
  const s = load();
  if (!s.seats[id]) return null;
  const rows = rankedRows();
  const idx = rows.findIndex((r) => r.id === id);
  if (idx < 0) return null;
  return { rank: idx + 1, total: rows.length };
}

/* Per-source point breakdown for one seat — tasks / invites / daily / cycles / featured. */
export function pointsBreakdown(id: string): { tasks: number; direct: number; tier2: number; daily: number; cycle: number; featured: number; total: number } | null {
  const s = load();
  const me = s.seats[id];
  if (!me) return null;
  const all = Object.values(s.seats);
  const direct = all.filter((u) => u.referrer === me.id).length;
  const directIds = new Set(all.filter((u) => u.referrer === me.id).map((u) => u.id));
  const tier2 = all.filter((u) => u.referrer && directIds.has(u.referrer)).length;
  const fullSet = me.t1 && me.t2 && me.t3;
  const tasks = fullSet ? 1000 : 0;
  const directPts = direct * 200;
  const tier2Pts = tier2 * 50;
  const daily = me.checkinDays * CHECKIN_POINTS;
  const cycle = me.cycleDays * CYCLE_POINTS;
  const featured = me.featured?.status === 'approved' && !me.og ? FEATURED_POINTS : 0;
  return { tasks, direct: directPts, tier2: tier2Pts, daily, cycle, featured, total: tasks + directPts + tier2Pts + daily + cycle + featured };
}
