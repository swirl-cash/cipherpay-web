import { ethers } from 'ethers';

export type ActivityKind = 'shield' | 'transfer' | 'public' | 'unshield' | 'mint';
export type ActivityStatus = 'pending' | 'confirmed';
export type ActivityRecord = {
  id: string;
  kind: ActivityKind;
  transactionHash: string;
  amount: string;
  counterparty?: string;
  timestamp: number;
  chainId: number;
  account: string;
  assetToken?: string;
  assetSymbol?: string;
  direction?: 'incoming' | 'outgoing';
  /* Undefined means confirmed: records written before the pending state existed. */
  status?: ActivityStatus;
};

const STORAGE_KEY = 'swirl.activity.v1';
const BLOCKSCOUT_API: Record<number, string> = {
  1: 'https://eth.blockscout.com',
  11155111: 'https://eth-sepolia.blockscout.com',
};

async function readAll(): Promise<ActivityRecord[]> {
  let value: unknown;
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    value = (await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY];
  } else {
    value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  }
  return Array.isArray(value) ? value as ActivityRecord[] : [];
}

async function writeAll(records: ActivityRecord[]): Promise<void> {
  const trimmed = records.sort((a, b) => b.timestamp - a.timestamp).slice(0, 500);
  if (typeof chrome !== 'undefined' && chrome.storage?.local) {
    await chrome.storage.local.set({ [STORAGE_KEY]: trimmed });
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export async function listActivity(chainId: number, account: string, assetToken?: string): Promise<ActivityRecord[]> {
  return (await readAll())
    .filter((item) => item.chainId === chainId && item.account.toLowerCase() === account.toLowerCase()
      && (!assetToken || item.assetToken?.toLowerCase() === assetToken.toLowerCase()))
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 100);
}

type ExplorerTransaction = {
  hash?: string;
  value?: string;
  status?: string;
  timestamp?: string;
  from?: { hash?: string };
  to?: { hash?: string } | null;
};

/* Public native transfers received from another wallet are not in localStorage.
   Read those public facts from Blockscout and merge them with local submissions. */
async function listNativeChainActivity(chainId: number, account: string): Promise<ActivityRecord[]> {
  const base = BLOCKSCOUT_API[chainId];
  if (!base || !ethers.isAddress(account)) return [];
  const response = await fetch(`${base}/api/v2/addresses/${account}/transactions`, {
    cache: 'no-store', signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`Public activity returned HTTP ${response.status}`);
  const data = await response.json() as { items?: ExplorerTransaction[] };
  const owner = account.toLowerCase();
  return (Array.isArray(data.items) ? data.items : []).flatMap((item) => {
    if (!item.hash || !/^0x[0-9a-fA-F]{64}$/.test(item.hash) || item.status !== 'ok') return [];
    let value: bigint;
    try { value = BigInt(item.value ?? '0'); } catch { return []; }
    if (value <= 0n) return [];
    const from = item.from?.hash ?? '';
    const to = item.to?.hash ?? '';
    const incoming = to.toLowerCase() === owner;
    const outgoing = from.toLowerCase() === owner;
    if (!incoming && !outgoing) return [];
    const timestamp = Date.parse(item.timestamp ?? '');
    return [{
      id: `chain:native:${item.hash}`, kind: 'public' as const, transactionHash: item.hash,
      amount: ethers.formatEther(value), counterparty: incoming ? from : to,
      timestamp: Number.isFinite(timestamp) ? timestamp : Date.now(), chainId, account,
      assetSymbol: 'ETH', direction: incoming ? 'incoming' as const : 'outgoing' as const,
    }];
  });
}

export async function listCombinedActivity(chainId: number, account: string): Promise<ActivityRecord[]> {
  const [local, chain] = await Promise.all([
    listActivity(chainId, account),
    listNativeChainActivity(chainId, account).catch(() => [] as ActivityRecord[]),
  ]);
  const merged = new Map<string, ActivityRecord>();
  for (const item of chain) merged.set(item.transactionHash.toLowerCase(), item);
  for (const item of local) merged.set(item.transactionHash.toLowerCase(), item);
  return [...merged.values()].sort((a, b) => b.timestamp - a.timestamp).slice(0, 100);
}

export async function addActivity(record: Omit<ActivityRecord, 'id' | 'timestamp'>): Promise<void> {
  const all = await readAll();
  const existing = all.find((item) => item.chainId === record.chainId && item.account.toLowerCase() === record.account.toLowerCase()
    && item.kind === record.kind && item.transactionHash.toLowerCase() === record.transactionHash.toLowerCase());
  if (existing) {
    // A broadcast already recorded as pending becomes confirmed in place,
    // keeping the original broadcast timestamp. Anything else is a duplicate.
    if (existing.status === 'pending' && record.status === 'confirmed') {
      Object.assign(existing, { ...record, id: existing.id, timestamp: existing.timestamp });
      await writeAll(all);
    }
    return;
  }
  all.push({ ...record, id: crypto.randomUUID(), timestamp: Date.now() });
  await writeAll(all);
}
