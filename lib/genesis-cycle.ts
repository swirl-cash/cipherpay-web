import fs from 'node:fs';
import path from 'node:path';
import { ethers } from 'ethers';

/* Genesis daily privacy-cycle verification — mainnet only.
   A cycle = one Shield AND one Unshield involving the submitted address,
   both inside the current UTC day. Today's vault events come from our own
   Indexer; transaction sender and calldata come from public mainnet RPCs. */

type Deployment = {
  vault: string;
  indexerUrl: string;
  rpcUrl: string;
  rpcFallbackUrls?: string[];
  assets?: Array<{ gateway?: string }>;
};

let depCache: { at: number; dep: Deployment } | null = null;
function deployment(): Deployment {
  if (depCache && Date.now() - depCache.at < 300_000) return depCache.dep;
  const dep = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'public', 'wallet', 'deployment.ethereum.json'), 'utf8'),
  ) as Deployment;
  depCache = { at: Date.now(), dep };
  return dep;
}

const TRANSACT_IFACE = new ethers.Interface([
  'function transact((uint256[2] a, uint256[2][2] b, uint256[2] c) proof, bytes32 root, bytes32[2] nullifiers, bytes32[4] outputCommitments, bytes[4] ciphertexts, uint256 publicAmount, address publicRecipient, address token)',
]);
const TRANSACT_SELECTOR = TRANSACT_IFACE.getFunction('transact')!.selector.toLowerCase();

/* Native-asset exits go through the Gateway contract (unshieldNative), not the
   vault's transact. The gateway sends ETH to msg.sender, so tx.from matching
   the address is proof of the unshield. */
const GATEWAY_UNSHIELD_SELECTOR = ethers.id(
  'unshieldNative((uint256[2],uint256[2][2],uint256[2]),bytes32,bytes32[2],bytes32[4],bytes[4],uint256)',
).slice(0, 10).toLowerCase();

function gatewayAddresses(): Set<string> {
  const set = new Set<string>();
  for (const asset of deployment().assets ?? []) {
    if (asset.gateway) set.add(asset.gateway.toLowerCase());
  }
  return set;
}

async function rpcCall<T>(method: string, params: unknown[]): Promise<T> {
  const dep = deployment();
  const urls = [dep.rpcUrl, ...(dep.rpcFallbackUrls ?? [])];
  const errors: string[] = [];
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
        signal: AbortSignal.timeout(12_000),
      });
      const body = (await res.json()) as { result?: T; error?: { message?: string } };
      if (body.error) throw new Error(body.error.message || 'RPC error');
      return body.result as T;
    } catch (cause) {
      errors.push(`${new URL(url).hostname}: ${cause instanceof Error ? cause.message : String(cause)}`);
    }
  }
  throw new Error(`Mainnet RPCs unavailable: ${errors.join(' | ')}`);
}

type IndexerEvent = { kind: string; blockNumber: number; transactionHash: string };

/* Vault events inside the current UTC day. The block window is estimated
   from 12s slots with a wide margin, then filtered by real block timestamps. */
async function todayEvents(): Promise<IndexerEvent[]> {
  const dep = deployment();
  const res = await fetch(`${dep.indexerUrl.replace(/\/$/, '')}/events`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Indexer returned HTTP ${res.status}`);
  const snap = (await res.json()) as { events?: IndexerEvent[] };
  const events = Array.isArray(snap.events) ? snap.events : [];

  const latest = await rpcCall<{ number: string; timestamp: string }>('eth_getBlockByNumber', ['latest', false]);
  const latestNum = parseInt(latest.number, 16);
  const latestTs = parseInt(latest.timestamp, 16);
  const midnightUtcSec = Math.floor(Date.now() / 86_400_000) * 86_400;
  const secsIntoDay = Math.max(0, latestTs - midnightUtcSec);
  const fromBlock = Math.max(0, latestNum - Math.ceil(secsIntoDay / 12) - 600); // ~2h margin

  const candidates = events.filter((ev) => ev.blockNumber >= fromBlock).slice(-400);
  if (candidates.length === 0) return [];

  // Pin each candidate to its real block timestamp (few blocks, cached).
  const blockTs = new Map<number, number>();
  for (const ev of candidates) {
    if (!blockTs.has(ev.blockNumber)) {
      const block = await rpcCall<{ timestamp: string }>('eth_getBlockByNumber', [`0x${ev.blockNumber.toString(16)}`, false]);
      blockTs.set(ev.blockNumber, parseInt(block.timestamp, 16));
    }
  }
  return candidates.filter((ev) => (blockTs.get(ev.blockNumber) ?? 0) >= midnightUtcSec);
}

export type CycleCheck =
  | { ok: true; shieldTx: string; unshieldTx: string }
  | { ok: false; reason: 'no_shield' | 'no_unshield' };

export async function verifyCycle(address: string): Promise<CycleCheck> {
  const target = address.toLowerCase();
  const gateways = gatewayAddresses();
  const events = await todayEvents();
  let shieldTx = '';
  let unshieldTx = '';
  for (const ev of events) {
    if (shieldTx && unshieldTx) break;
    const tx = await rpcCall<{ from?: string; to?: string; input?: string } | null>('eth_getTransactionByHash', [ev.transactionHash]);
    if (!tx?.from) continue;
    const from = tx.from.toLowerCase();
    if (ev.kind === 'shield' && !shieldTx && from === target) {
      shieldTx = ev.transactionHash;
      continue;
    }
    if (ev.kind !== 'transacted' || unshieldTx || !tx.input) continue;
    const input = tx.input.toLowerCase();
    // Native unshield via the Gateway: ETH is paid to tx.from.
    if (gateways.has((tx.to ?? '').toLowerCase()) && input.startsWith(GATEWAY_UNSHIELD_SELECTOR)) {
      if (from === target) unshieldTx = ev.transactionHash;
      continue;
    }
    // ERC-20 unshield via vault.transact with a negative publicAmount.
    if (input.startsWith(TRANSACT_SELECTOR)) {
      try {
        const decoded = TRANSACT_IFACE.decodeFunctionData('transact', tx.input);
        const publicAmount = BigInt(decoded[5]);
        const recipient = String(decoded[6]).toLowerCase();
        // publicAmount is an int256 encoded as uint256: the top bit marks an
        // unshield (value leaving the pool to a public recipient).
        const isUnshield = publicAmount > (1n << 255n) && recipient !== '0x0000000000000000000000000000000000000000';
        if (isUnshield && (from === target || recipient === target)) unshieldTx = ev.transactionHash;
      } catch { /* not a decodable transact call — ignore */ }
    }
  }
  if (!shieldTx) return { ok: false, reason: 'no_shield' };
  if (!unshieldTx) return { ok: false, reason: 'no_unshield' };
  return { ok: true, shieldTx, unshieldTx };
}
