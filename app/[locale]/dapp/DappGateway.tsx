'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { ethers, HDNodeWallet, type Signer } from 'ethers';
import { QRCodeSVG } from 'qrcode.react';
import { Logo, LogoMark } from '@/components/Logo';
import { WalletMark } from '@/components/WalletMark';
import { AnimatedSwirlMark } from './AnimatedSwirlMark';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { SwirlWallet } from '@/lib/swirl-wallet/index.js';
import {
  DEFAULT_NETWORK, activateNetwork, loadNetwork, loadNetworks, protocolReady,
  type AssetConfig, type NetworkConfig,
} from '@/lib/swirl/network';
import { addActivity, listCombinedActivity, type ActivityRecord } from '@/lib/swirl/activity';
import { assetUsdPrice, formatUsd, usdValue } from '@/lib/swirl/prices';
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type WalletSettings } from '@/lib/swirl/settings';
import { errorMessage, transactionExplorer } from '@/lib/swirl/feedback';
import { nextPendingPoiReviewAt, notePoiLabel } from '@/lib/swirl/poi-timing';
import type { OwnedNote, PrivateTransactionResult, SyncedNotes } from '@/lib/swirl/protocol';
import './dapp-gateway.css';
import './dapp-premium.css';

type IconProps = { size?: number };
const iconProps = (size = 18) => ({ width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.55, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true });
const Grid = ({ size }: IconProps) => <svg {...iconProps(size)}><rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor" opacity=".13" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor" opacity=".13" /></svg>;
const ArrowUp = ({ size }: IconProps) => <svg {...iconProps(size)}><path d="M7 17 17 7M7 7h10v10" /><path d="M5 5h4" opacity=".45" /></svg>;
const ArrowDown = ({ size }: IconProps) => <svg {...iconProps(size)}><path d="m17 7-10 10M17 17H7V7" /><path d="M15 19h4" opacity=".45" /></svg>;
const ArrowRight = ({ size }: IconProps) => <svg {...iconProps(size)}><path d="M4 12h15m-6-6 6 6-6 6" /></svg>;
const Shield = ({ size }: IconProps) => <svg {...iconProps(size)}><path d="M12 3 5 6v5c0 4.6 2.9 8.1 7 10 4.1-1.9 7-5.4 7-10V6l-7-3Z" fill="currentColor" opacity=".08" /><path d="M12 3 5 6v5c0 4.6 2.9 8.1 7 10 4.1-1.9 7-5.4 7-10V6l-7-3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></svg>;
const ShieldOff = ({ size }: IconProps) => <svg {...iconProps(size)}><path d="M12 3 5 6v5c0 4.6 2.9 8.1 7 10 4.1-1.9 7-5.4 7-10V6l-7-3Z" /><path d="m8.5 15 7-7M10 8h5v5" /></svg>;
const Fuel = ({ size }: IconProps) => <svg {...iconProps(size)}><path d="M5 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17M3 21h14" /><rect x="7" y="6" width="6" height="5" rx="1" /><path d="m15 8 3 3v6.5a1.5 1.5 0 0 0 3 0V12l-2-2" /></svg>;
const ActivityIcon = ({ size }: IconProps) => <svg {...iconProps(size)}><path d="M3 12h3.5l2-5 4 11 3-8 1.5 2H21" /><path d="M5 4h2M17 20h2" opacity=".4" /></svg>;
const SettingsIcon = ({ size }: IconProps) => <svg {...iconProps(size)}><path d="M4 7h5m4 0h7M4 17h9m4 0h3M4 12h1m4 0h11" /><circle cx="11" cy="7" r="2" fill="var(--db-panel)" /><circle cx="15" cy="17" r="2" fill="var(--db-panel)" /><circle cx="7" cy="12" r="2" fill="var(--db-panel)" /></svg>;
const Globe = ({ size }: IconProps) => <svg {...iconProps(size)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.4 3 14.6 0 18M12 3c-3 3.4-3 14.6 0 18" /></svg>;
const Vote = ({ size }: IconProps) => <svg {...iconProps(size)}><path d="M9 4h11a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9" /><path d="m3 4 3 3 5-5M8 13h8M8 16h5" /></svg>;
const Mining = ({ size }: IconProps) => <svg {...iconProps(size)}><path d="m14 5 5 5M12 7l5 5M3 21l9-9" /><path d="M13 3c3-2 7-1 9 2s1 7-2 9l-3-3c2-1 2-4 0-6s-5-2-6 0l-3-3c1-1 3-2 5-2Z" fill="currentColor" opacity=".08" /><path d="m5 14 5 5" /></svg>;
const Copy = ({ size }: IconProps) => <svg {...iconProps(size)}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>;
const Refresh = ({ size }: IconProps) => <svg {...iconProps(size)}><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6.1 8a7 7 0 0 1 11.8-1L20 12M4 12l2.1 5a7 7 0 0 0 11.8-1" /></svg>;
const Lock = ({ size }: IconProps) => <svg {...iconProps(size)}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>;
const Close = ({ size }: IconProps) => <svg {...iconProps(size)}><path d="m6 6 12 12M18 6 6 18" /></svg>;
const External = ({ size }: IconProps) => <svg {...iconProps(size)}><path d="M14 4h6v6m0-6-9 9" /><path d="M18 13v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h6" /></svg>;

type View = 'overview' | 'transfer' | 'receive' | 'shield' | 'unshield' | 'gas' | 'activity' | 'settings' | 'governance' | 'mining';
type AuthMode = 'closed' | 'choice' | 'create' | 'import' | 'unlock' | 'backup';
type PortfolioEntry = { publicAmount: bigint; privateAmount: bigint; price: number; loaded: boolean; error?: string };
type StoredPortfolioEntry = Omit<PortfolioEntry, 'publicAmount' | 'privateAmount'> & { publicAmount: string; privateAmount: string };
type WalletViewSnapshot = { portfolio: Record<string, StoredPortfolioEntry>; activities: ActivityRecord[] };
type AssetSymbol = 'ETH' | 'BTC' | 'BNB' | 'ARB' | 'POL' | 'USDT' | 'USDC';

function parseWalletViewSnapshot(snapshot: WalletViewSnapshot | null) {
  if (!snapshot || typeof snapshot !== 'object' || !snapshot.portfolio || typeof snapshot.portfolio !== 'object') return null;
  try {
    const portfolio = Object.fromEntries(Object.entries(snapshot.portfolio).map(([token, entry]) => {
      if (typeof entry.publicAmount !== 'string' || typeof entry.privateAmount !== 'string'
        || typeof entry.price !== 'number' || !Number.isFinite(entry.price) || typeof entry.loaded !== 'boolean') throw new Error('Invalid cached balance');
      return [token, { ...entry, publicAmount: BigInt(entry.publicAmount), privateAmount: BigInt(entry.privateAmount) }];
    })) as Record<string, PortfolioEntry>;
    return { portfolio, activities: Array.isArray(snapshot.activities) ? snapshot.activities : [] };
  } catch { return null; }
}

const emptySynced = (): SyncedNotes => ({ notes: [], tree: undefined as never });
const short = (value: string, left = 8, right = 6) => value ? `${value.slice(0, left)}…${value.slice(-right)}` : '';
const chainIcon: Record<number, { src: string; name: string }> = {
  0: { src: '/chains/btc.svg', name: 'Bitcoin' }, 1: { src: '/chains/eth.svg', name: 'Ethereum' },
  56: { src: '/chains/bnb.svg', name: 'BNB Smart Chain' }, 137: { src: '/chains/matic.svg', name: 'Polygon' },
  42161: { src: '/chains/arb.svg', name: 'Arbitrum One' }, 11155111: { src: '/chains/eth.svg', name: 'Sepolia Testnet' },
};
const assetIcon: Record<string, string> = { ETH: '/chains/eth.svg', BTC: '/chains/btc.svg', USDT: '/chains/usdt.svg', USDC: '/chains/usdc.svg' };
const assetDisplayName: Record<string, string> = {
  ETH: 'Ether', BTC: 'Bitcoin', BNB: 'BNB', ARB: 'Arbitrum', POL: 'Polygon Ecosystem Token', USDT: 'Tether USD', USDC: 'USD Coin',
};
const ecosystem = [
  { name: 'Bitcoin', symbol: 'BTC' as AssetSymbol, src: '/chains/btc.svg', live: false },
  { name: 'Ethereum', symbol: 'ETH' as AssetSymbol, src: '/chains/eth.svg', live: true },
  { name: 'BNB Chain', symbol: 'BNB' as AssetSymbol, src: '/chains/bnb.svg', live: false },
  { name: 'Arbitrum', symbol: 'ARB' as AssetSymbol, src: '/chains/arb.svg', live: false },
  { name: 'Polygon', symbol: 'POL' as AssetSymbol, src: '/chains/matic.svg', live: false },
];
const viewDetails: Record<View, { title: string; subtitle: string }> = {
  overview: { title: 'Overview', subtitle: 'Real public and private balances on the selected network.' },
  transfer: { title: 'Transfer', subtitle: 'Send assets publicly or privately from this page.' },
  receive: { title: 'Receive', subtitle: 'Receive to your public EVM or private SWIRL address.' },
  shield: { title: 'Shield', subtitle: 'Move public assets into the private pool.' },
  unshield: { title: 'Unshield', subtitle: 'Withdraw a private note to a public address.' },
  gas: { title: 'Gas account', subtitle: 'Fund the dedicated account used for direct private transactions.' },
  activity: { title: 'Activity', subtitle: 'Public on-chain transfers and local submissions.' },
  settings: { title: 'Settings', subtitle: 'Submission, security and local wallet preferences.' },
  governance: { title: 'Governance', subtitle: 'Community direction and protocol decisions.' },
  mining: { title: 'Anonymous Mining', subtitle: 'Privacy-preserving participation and rewards.' },
};

function ChainIcon({ src, name, size = 26 }: { src: string; name: string; size?: number }) {
  return <img className="chain-icon" src={src} width={size} height={size} alt={name} title={name} />;
}
function NavButton({ active, onClick, icon: Icon, children }: { active?: boolean; onClick: () => void; icon: React.ComponentType<IconProps>; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} className={`sidebar-link sidebar-button${active ? ' active' : ''}`}><span className="sidebar-nav-icon"><Icon size={18} /></span><span className="sidebar-nav-label">{children}</span>{active && <i />}</button>;
}
function AssetSelect({ assets, value, onChange, disabled }: { assets: AssetConfig[]; value: string; onChange: (value: string) => void; disabled?: boolean }) {
  return <label className="form-field"><span>Asset</span><select value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled}>{assets.map((item) => <option value={item.symbol} key={item.token}>{assetDisplayName[item.symbol] ?? item.name} — {item.symbol}</option>)}</select></label>;
}

export function DappGateway() {
  const [view, setView] = useState<View>('overview');
  const [wallet, setWallet] = useState<SwirlWallet | null>(null);
  const [walletExists, setWalletExists] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>('closed');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [mnemonic, setMnemonic] = useState('');
  const [overwriteConfirmed, setOverwriteConfirmed] = useState(false);
  const [backupConfirmed, setBackupConfirmed] = useState(false);
  const [config, setConfig] = useState<NetworkConfig>(DEFAULT_NETWORK);
  const [networks, setNetworks] = useState<NetworkConfig[]>([]);
  const [assetSymbol, setAssetSymbol] = useState('');
  const [portfolio, setPortfolio] = useState<Record<string, PortfolioEntry>>({});
  const [syncing, setSyncing] = useState(false);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [synced, setSynced] = useState<SyncedNotes>(emptySynced);
  const [publicBalance, setPublicBalance] = useState<bigint | null>(null);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [settings, setSettings] = useState<WalletSettings>(DEFAULT_SETTINGS);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  /* Notes with a broadcast-but-unconfirmed spend stay visible but disabled. */
  const [pendingSpendLeaves, setPendingSpendLeaves] = useState<number[]>([]);
  /* Only one note-spending transaction at a time: a second spend would reuse
     the same unspent notes and revert on-chain, wasting Gas. */
  const privateInFlight = useRef(false);
  const [amount, setAmount] = useState('0');
  const [recipient, setRecipient] = useState('');
  const [transferKind, setTransferKind] = useState<'public' | 'private'>('private');
  const [selectedNote, setSelectedNote] = useState<OwnedNote | null>(null);
  const [receiveKind, setReceiveKind] = useState<'public' | 'private'>('private');
  const [copied, setCopied] = useState('');
  const [gasBalance, setGasBalance] = useState<bigint | null>(null);
  const [gasAccount, setGasAccount] = useState('');
  const [gasAmount, setGasAmount] = useState('0');
  const [gasEstimates, setGasEstimates] = useState<{ operation: string; bufferedCost: bigint }[]>([]);
  const [showRecovery, setShowRecovery] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [clock, setClock] = useState(Date.now());
  const refreshId = useRef(0);
  const portfolioRef = useRef(portfolio);
  portfolioRef.current = portfolio;
  const busyRef = useRef(busy);
  busyRef.current = busy;

  const evmAccount = useMemo(() => wallet ? HDNodeWallet.fromPhrase(wallet.mnemonic) : null, [wallet]);
  const evmAddress = evmAccount?.address ?? '';
  const evmPrivateKey = evmAccount?.privateKey ?? '';
  const asset = config.assets.find((item) => item.symbol === assetSymbol) ?? config.assets[0];
  const configReady = protocolReady(config) && Boolean(asset);
  const currentEntry = asset ? portfolio[asset.token] : undefined;
  const relayerSupported = Boolean(asset && config.relayerUrl && config.relayerVault.toLowerCase() === asset.vault.toLowerCase());
  const directSubmission = settings.submission !== 'relayer' || !relayerSupported;
  const gasSubmission = settings.submission === 'gas' && directSubmission;
  const relayerFeeAction = settings.submission === 'relayer' && relayerSupported
    && ((view === 'transfer' && transferKind === 'private') || (view === 'unshield' && asset?.kind !== 'native'));
  const receiveAddress = receiveKind === 'private' ? wallet?.address ?? '' : evmAddress;
  const details = viewDetails[view];
  const currentChain = chainIcon[config.chainId] ?? chainIcon[1];
  const hasPendingPoi = synced.notes.some((note) => !note.spent && note.poiStatus === 'ShieldPending');
  const nextPoiReviewAt = nextPendingPoiReviewAt(synced.notes);

  useEffect(() => {
    void Promise.all([loadNetwork(), loadNetworks(), loadSettings(), import('@/lib/swirl/storage').then(({ hasEncryptedWallet }) => hasEncryptedWallet())])
      .then(async ([network, catalog, preferences, exists]) => {
        setConfig(network); setNetworks(catalog); setAssetSymbol(network.assets[0]?.symbol ?? '');
        setSettings(preferences); setWalletExists(exists);
        const session = await import('@/lib/swirl/session');
        const restored = await session.restoreUnlockedSession(network.chainId);
        if (restored) {
          const account = HDNodeWallet.fromPhrase(restored.mnemonic).address;
          const cached = parseWalletViewSnapshot(await session.restoreWalletViewSnapshot<WalletViewSnapshot>(network.chainId, account));
          if (cached) {
            setPortfolio(cached.portfolio); setActivities(cached.activities);
            const firstAsset = network.assets[0];
            const firstBalance = firstAsset ? cached.portfolio[firstAsset.token]?.publicAmount : undefined;
            setPublicBalance(firstBalance ?? null);
            setNotice('Wallet session restored. Balances restored; syncing latest…');
          } else setNotice('Wallet session restored. Loading real balances…');
          setWallet(restored);
        }
      }).catch((cause) => setError(errorMessage(cause)));
  }, []);

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => { setNotice(''); setTransactionHash(''); }, 5000);
    return () => window.clearTimeout(timer);
  }, [notice]);

  useEffect(() => {
    if (!error) return;
    // Errors carrying a broadcast hash (confirmation timeout, on-chain revert) stay
    // visible until dismissed or the next action: they hold the transaction link.
    if (transactionHash && error.includes(transactionHash)) return;
    const timer = window.setTimeout(() => setError(''), 8000);
    return () => window.clearTimeout(timer);
  }, [error, transactionHash]);

  const refresh = useCallback(async () => {
    if (!wallet || !asset || !configReady) {
      setPortfolio({}); setSigner(null); setPublicBalance(null); setSynced(emptySynced()); setActivities([]); setSyncing(false); return;
    }
    const requestId = ++refreshId.current;
    const noteSyncs = new Map<string, Promise<SyncedNotes>>();
    setSyncing(true); setError('');
    try {
      const protocol = await import('@/lib/swirl/protocol');
      const results = await Promise.all(config.assets.map(async (item) => {
        const previous = portfolioRef.current[item.token];
        try {
          const connected = await protocol.connectNetwork(config, wallet, item);
          const balanceRequest = item.kind === 'native' ? connected.provider.getBalance(connected.account) : connected.token.balanceOf(connected.account);
          const syncKey = item.vault.toLowerCase();
          let noteSync = noteSyncs.get(syncKey);
          if (!noteSync) {
            noteSync = protocol.syncNotes(connected.vault, wallet, config.indexerUrl, protocol.poiClientFor(config, item), config.deploymentBlock ?? 0);
            noteSyncs.set(syncKey, noteSync);
          }
          const notesRequest = noteSync.then(
            (value) => ({ value, error: null }), (error: unknown) => ({ value: null, error }),
          );
          const priceRequest = assetUsdPrice(item, config.chainId).catch(() => previous?.price ?? 0);
          const [balance, price, onChainDecimals] = await Promise.all([
            balanceRequest, priceRequest, connected.token.decimals(),
          ]);
          if (Number(onChainDecimals) !== item.decimals) throw new Error(`${item.symbol} decimals do not match the deployment`);
          const publicEntry: PortfolioEntry = {
            publicAmount: balance,
            privateAmount: previous?.privateAmount ?? 0n,
            price, loaded: true,
          };
          // Public chain data is useful before the slower private-note scan finishes.
          if (requestId === refreshId.current) {
            setPortfolio((current) => ({ ...current, [item.token]: publicEntry }));
            if (item.token === asset.token) {
              setSigner(connected.signer);
              setPublicBalance(balance);
            }
          }
          const notesResult = await notesRequest;
          const availableNotes = notesResult.value?.notes.filter((note) => !note.spent && note.note.token === BigInt(item.token));
          const entry: PortfolioEntry = {
            ...publicEntry,
            privateAmount: availableNotes ? availableNotes.reduce((sum, note) => sum + note.note.amount, 0n) : previous?.privateAmount ?? 0n,
            ...(notesResult.error ? { error: `Private note sync failed: ${errorMessage(notesResult.error)}` } : {}),
          };
          return { item, entry, connected, nextNotes: notesResult.value ?? undefined, balance };
        } catch (cause) {
          // An RPC or price outage must not replace a confirmed balance with zero.
          const entry: PortfolioEntry = previous
            ? { ...previous, error: errorMessage(cause) }
            : { publicAmount: 0n, privateAmount: 0n, price: 0, loaded: false, error: errorMessage(cause) };
          return { item, entry };
        }
      }));
      if (requestId !== refreshId.current) return;
      const nextPortfolio = Object.fromEntries(results.map((result) => [result.item.token, result.entry])) as Record<string, PortfolioEntry>;
      setPortfolio(nextPortfolio);
      const current = results.find((result) => result.item.token === asset.token);
      if (current?.connected && current.balance !== undefined) {
        const notes = current.nextNotes?.notes.filter((note) => note.note.token === BigInt(asset.token));
        const nextActivities = await listCombinedActivity(config.chainId, current.connected.account).catch(() => null);
        if (requestId !== refreshId.current) return;
        setSigner(current.connected.signer);
        if (current.nextNotes && notes) {
          setSynced({ ...current.nextNotes, notes });
          setSelectedNote((existing) => existing ? notes.find((note) => note.note.leafIndex === existing.note.leafIndex && protocol.isNoteSpendable(note, Boolean(config.poiNodeUrl))) ?? null : null);
        }
        setPublicBalance(current.balance);
        if (nextActivities) {
          setActivities(nextActivities);
          // Reconcile broadcasts that confirmed after their submission window
          // closed (tab closed, or the confirmation wait elapsed before mining).
          for (const item of nextActivities.filter((entry) => entry.status === 'pending')) {
            void protocol.waitForTransactionReceipt({ hash: item.transactionHash, config, timeoutMs: 1 })
              .then(async (receipt) => {
                if (receipt.status !== 1) return;
                await addActivity({ ...item, status: 'confirmed' });
              })
              .catch(() => undefined);
          }
          const snapshot: WalletViewSnapshot = {
            portfolio: Object.fromEntries(Object.entries(nextPortfolio).map(([token, entry]) => [token, {
              ...entry, publicAmount: entry.publicAmount.toString(), privateAmount: entry.privateAmount.toString(),
            }])),
            activities: nextActivities,
          };
          try {
            const { saveWalletViewSnapshot } = await import('@/lib/swirl/session');
            await saveWalletViewSnapshot(config.chainId, current.connected.account, snapshot);
          } catch { /* A view-cache failure must not block live on-chain data. */ }
        }
        if (current.entry.error) setError(current.entry.error);
      } else {
        setSigner(null); setSynced(emptySynced()); setPublicBalance(null);
        if (current?.entry.error) setError(current.entry.error);
      }
    } catch (cause) {
      if (requestId === refreshId.current) { setSigner(null); setError(errorMessage(cause)); }
    } finally { if (requestId === refreshId.current) setSyncing(false); }
  }, [asset, config, configReady, wallet]);
  useEffect(() => { void refresh(); }, [refresh]);

  useEffect(() => {
    if (!hasPendingPoi) return;
    setClock(Date.now());
    const refreshPending = () => { if (!busyRef.current) void refresh(); };
    const clockTimer = window.setInterval(() => setClock(Date.now()), 1000);
    const pollTimer = window.setInterval(refreshPending, 30_000);
    const reviewTimer = nextPoiReviewAt === undefined ? undefined : window.setTimeout(
      refreshPending, Math.max(0, nextPoiReviewAt - Date.now() + 2500),
    );
    return () => {
      window.clearInterval(clockTimer); window.clearInterval(pollTimer);
      if (reviewTimer !== undefined) window.clearTimeout(reviewTimer);
    };
  }, [hasPendingPoi, nextPoiReviewAt, refresh]);

  const refreshGas = useCallback(async () => {
    if (!wallet || !config.rpcUrl) { setGasBalance(null); setGasAccount(''); setGasEstimates([]); return; }
    try {
      const { gasSnapshot } = await import('@/lib/swirl/gas');
      const snapshot = await gasSnapshot(config, wallet.mnemonic);
      setGasAccount(snapshot.address); setGasBalance(snapshot.balance); setGasEstimates(snapshot.estimates);
    } catch { setGasBalance(null); setGasEstimates([]); }
  }, [config, wallet]);
  useEffect(() => { void refreshGas(); }, [refreshGas]);

  useEffect(() => {
    if (!wallet || !asset || !config.poiNodeUrl || !configReady) return;
    let active = true;
    void import('@/lib/swirl/poi').then(({ retryPendingPOI }) => retryPendingPOI(wallet, config, asset)).then(async (result) => {
      if (active && result.completed > 0) {
        await refresh();
        if (active) setNotice(`${result.completed} confirmed transaction${result.completed === 1 ? '' : 's'} now have valid PPOI outputs.`);
      }
    }).catch(() => undefined);
    return () => { active = false; };
  }, [asset, config, configReady, refresh, wallet]);

  useEffect(() => {
    if (!wallet) return;
    const markActivity = () => setLastActivity(Date.now());
    const events = ['pointerdown', 'keydown', 'touchstart'] as const;
    events.forEach((event) => window.addEventListener(event, markActivity, { passive: true }));
    const timer = window.setInterval(() => {
      if (!busyRef.current && settings.autoLockMinutes > 0 && Date.now() - lastActivity >= settings.autoLockMinutes * 60_000) lockWallet();
    }, 1000);
    return () => { window.clearInterval(timer); events.forEach((event) => window.removeEventListener(event, markActivity)); };
  }, [wallet, settings.autoLockMinutes, lastActivity]);

  function clearSensitiveForm() { setPassword(''); setConfirmation(''); setMnemonic(''); setOverwriteConfirmed(false); setBackupConfirmed(false); }
  function openAuth() { setError(''); setNotice(''); setAuthMode(walletExists ? 'unlock' : 'choice'); }
  function closeAuth() { if (!busy) { clearSensitiveForm(); setAuthMode('closed'); } }
  async function persistUnlockedSession(value: SwirlWallet) {
    const { saveUnlockedSession } = await import('@/lib/swirl/session');
    await saveUnlockedSession(value);
  }
  function lockWallet() {
    void import('@/lib/swirl/session').then(({ clearUnlockedSession }) => clearUnlockedSession()).catch(() => undefined);
    setWallet(null); setSigner(null); setSynced(emptySynced()); setPublicBalance(null); setPortfolio({}); setActivities([]);
    setSelectedNote(null); setGasBalance(null); setGasAccount(''); setShowRecovery(false); setNotice('Wallet locked.'); setError('');
  }
  async function createWallet(event: FormEvent, importing: boolean) {
    event.preventDefault();
    if (password !== confirmation) return setError('Passwords do not match');
    if (walletExists && !overwriteConfirmed) return setError('Confirm that you want to replace the wallet saved in this browser');
    setBusy('Encrypting wallet on this device…'); setError('');
    try {
      const { createEncryptedWallet } = await import('@/lib/swirl/storage');
      const next = await createEncryptedWallet(password, importing ? mnemonic : undefined, config.chainId);
      await persistUnlockedSession(next);
      setWallet(next); setWalletExists(true); clearSensitiveForm(); setAuthMode('backup');
    } catch (cause) { setError(errorMessage(cause)); } finally { setBusy(''); }
  }
  async function unlock(event: FormEvent) {
    event.preventDefault(); setBusy('Decrypting wallet…'); setError('');
    try {
      const { unlockEncryptedWallet } = await import('@/lib/swirl/storage');
      const next = await unlockEncryptedWallet(password, config.chainId);
      await persistUnlockedSession(next);
      setWallet(next); clearSensitiveForm(); setAuthMode('closed'); setNotice('Wallet unlocked. Loading real balances…');
    } catch (cause) { setError(errorMessage(cause)); } finally { setBusy(''); }
  }
  async function copyValue(key: string, value: string) {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value); setCopied(key);
      setNotice(key === 'backup' ? 'Recovery credentials copied to the clipboard.' : 'Address copied to the clipboard.');
      window.setTimeout(() => setCopied(''), 1400);
    }
    catch (cause) { setError(`Copy failed: ${errorMessage(cause)}`); }
  }
  async function selectNetwork(chainId: number) {
    if (chainId === config.chainId) return;
    setBusy('Switching network…'); setError(''); setNotice('');
    try {
      const next = await activateNetwork(chainId);
      refreshId.current += 1; setConfig(next); setNetworks(await loadNetworks()); setAssetSymbol(next.assets[0]?.symbol ?? '');
      setSelectedNote(null); setRecipient(''); setAmount('0'); setPortfolio({});
      if (wallet && wallet.chainId !== next.chainId) {
        const { createSwirlWallet } = await import('@/lib/swirl-wallet/index.js');
        const switchedWallet = await createSwirlWallet(next.chainId, wallet.mnemonic);
        await persistUnlockedSession(switchedWallet);
        setWallet(switchedWallet);
      }
      setNotice(`Switched to ${next.name}.`);
    } catch (cause) { setError(errorMessage(cause)); } finally { setBusy(''); }
  }
  function selectAsset(symbol: string) {
    setAssetSymbol(symbol); setSelectedNote(null); setRecipient(''); setAmount('0'); setError(''); setNotice('');
  }
  function openAction(next: 'transfer' | 'shield' | 'unshield', symbol?: string) {
    if (symbol) selectAsset(symbol);
    setView(next); setError(''); setNotice(''); setRecipient(''); setSelectedNote(null);
  }
  function updateSettings(patch: Partial<WalletSettings>) {
    const next = { ...settings, ...patch }; setSettings(next); setError(''); setNotice('');
    const message = patch.submission
      ? `Fee payer updated to ${{ relayer: 'Relayer', gas: 'Dedicated Gas account', main: 'Main EVM wallet' }[patch.submission]}.`
      : patch.autoLockMinutes !== undefined
        ? patch.autoLockMinutes === 0 ? 'Auto-lock disabled.' : `Auto-lock set to ${patch.autoLockMinutes} minute${patch.autoLockMinutes === 1 ? '' : 's'}.`
        : 'Settings saved.';
    void saveSettings(next).then(() => setNotice(message)).catch((cause) => {
      setSettings(settings); setError(`Settings were not saved: ${errorMessage(cause)}`);
    });
  }
  function formatAmount(value: bigint | undefined, decimals: number) {
    if (value === undefined) return syncing ? 'Syncing…' : '—';
    const formatted = Number(ethers.formatUnits(value, decimals));
    if (!Number.isFinite(formatted)) return '0';
    return formatted.toLocaleString('en-US', { maximumFractionDigits: decimals === 6 ? 2 : 6 });
  }
  function privateSpendable() {
    if (!asset) return 0n;
    return synced.notes.filter((note) => !note.spent && note.note.token === BigInt(asset.token)
      && (!config.poiNodeUrl || note.poiStatus === 'Valid'))
      .sort((a, b) => a.note.amount > b.note.amount ? -1 : 1).slice(0, 2).reduce((sum, note) => sum + note.note.amount, 0n);
  }
  async function fillMax() {
    if (!asset || !wallet) return;
    setError('');
    try {
      let maximum = 0n;
      if (view === 'shield' || (view === 'transfer' && transferKind === 'public')) {
        maximum = publicBalance ?? 0n;
        if (asset.kind === 'native' && maximum > 0n && signer?.provider) {
          if (view === 'shield') {
            const protocol = await import('@/lib/swirl/protocol');
            maximum = await protocol.maximumNativeShieldAmount({ signer, config, asset, wallet, available: maximum });
          } else {
            const feeData = await signer.provider.getFeeData();
            const unitFee = feeData.maxFeePerGas ?? feeData.gasPrice;
            if (unitFee) { const reserve = unitFee * 21_000n * 120n / 100n; maximum = maximum > reserve ? maximum - reserve : 0n; }
          }
        }
      } else {
        maximum = privateSpendable();
        if (relayerFeeAction && signer) {
          const protocol = await import('@/lib/swirl/protocol');
          const fee = await protocol.estimatePrivateTransferRelayFee({ signer, config, asset, wallet, synced });
          maximum = maximum > fee ? maximum - fee : 0n;
        }
      }
      setAmount(ethers.formatUnits(maximum, asset.decimals));
    } catch (cause) { setError(errorMessage(cause)); }
  }

  async function submitAction(event: FormEvent) {
    event.preventDefault();
    if (!wallet) return openAuth();
    if (!signer || !asset || (view !== 'shield' && view !== 'transfer' && view !== 'unshield')) return setError('Sync the configured network before submitting a transaction');
    const action = view;
    const noteSpending = action === 'unshield' || (action === 'transfer' && transferKind === 'private');
    if (noteSpending && privateInFlight.current) {
      return setError('A private transaction is still confirming. Its hash is in Activity — wait for it before spending more notes.');
    }
    // Set synchronously before any await so a fast double-submit cannot slip past the guard.
    if (noteSpending) privateInFlight.current = true;
    setBusy(action === 'shield' ? 'Creating encrypted note…' : action === 'transfer' && transferKind === 'public' ? 'Sending public transfer…' : action === 'unshield' ? 'Preparing prover resources…' : 'Generating Groth16 proof…');
    setError(''); setNotice(''); setTransactionHash('');
    try {
      const protocol = await import('@/lib/swirl/protocol');
      const gas = await import('@/lib/swirl/gas');
      let receipt: PrivateTransactionResult['receipt'];
      let privateResult: PrivateTransactionResult | undefined;
      let activityAmount = amount;
      const activityKind = action === 'transfer' && transferKind === 'public' ? 'public' : action;
      const privateAction = action === 'unshield' || (action === 'transfer' && transferKind === 'private');
      const submitDirectly = directSubmission || (action === 'unshield' && asset.kind === 'native');
      const useGasAccount = privateAction && submitDirectly && gasSubmission;
      const actionSigner = useGasAccount ? gas.gasWallet(wallet.mnemonic, gas.createProvider(config)) : signer;
      const recordBroadcast = (hash: string) => {
        setTransactionHash(hash);
        setNotice(`Transaction submitted ${hash.slice(0, 10)}…${hash.slice(-6)}. Waiting for ${config.name} confirmation — safe to close this tab; the hash is saved in Activity.`);
        // Upstream wallets release the interface at broadcast and let confirmation
        // resolve in the background; the pending record below is the durable state.
        setBusy('');
        if (action === 'unshield' && selectedNote) setPendingSpendLeaves((current) => [...current, selectedNote.note.leafIndex]);
        // Record the broadcast immediately: the hash survives a closed tab or a
        // confirmation timeout, and confirmation updates this record in place.
        void addActivity({ kind: activityKind, transactionHash: hash, amount: activityAmount, counterparty: recipient || undefined, chainId: config.chainId, account: evmAddress, assetToken: asset.token, assetSymbol: asset.symbol, direction: 'outgoing', status: 'pending' })
          .then(() => listCombinedActivity(config.chainId, evmAddress)).then(setActivities).catch(() => undefined);
      };
      const prefetchPoiAssets = () => {
        if (!config.poiNodeUrl) return;
        // Confirmed PPOI runs after the transaction. Warm its shared cache during the confirmation wait.
        void import('@/lib/swirl/proving-assets')
          .then(({ getPoiProvingAssets }) => getPoiProvingAssets())
          .catch(() => undefined);
      };
      if (useGasAccount) await gas.assertGasAvailable({ config, signer: actionSigner, operation: action === 'unshield' ? 'unshield' : 'transfer' });
      if (action === 'shield') {
        const parsed = ethers.parseUnits(amount || '0', asset.decimals);
        if (parsed <= 0n) throw new Error('Enter an amount greater than zero');
        receipt = await protocol.shieldTokens({
          signer, config, asset, wallet, grossAmount: parsed,
          onStage: (stage) => setBusy(stage === 'approving' ? 'Checking token approval…' : stage === 'estimating' ? 'Estimating Shield network fee…' : 'Signing and broadcasting Shield…'),
          onSubmitted: (hash) => {
            recordBroadcast(hash);
            // Use the confirmation wait to warm the exact shared promise consumed by Unshield.
            // A failed prefetch is silent; the normal loading path will retry with visible progress.
            void import('@/lib/swirl/proving-assets')
              .then(({ getTransferProvingAssets }) => getTransferProvingAssets())
              .catch(() => undefined);
          },
        });
      } else if (action === 'transfer') {
        const parsed = ethers.parseUnits(amount || '0', asset.decimals);
        if (parsed <= 0n) throw new Error('Enter an amount greater than zero');
        if (transferKind === 'public') receipt = await protocol.publicTransfer({ signer, config, asset, recipient, amount: parsed, onSubmitted: recordBroadcast });
        else {
          privateResult = await protocol.privateTransfer({
            signer: actionSigner, config, asset, wallet, synced, recipient, amount: parsed, directSubmission: submitDirectly,
            onSubmitted: (hash) => { recordBroadcast(hash); prefetchPoiAssets(); },
          });
          receipt = privateResult.receipt;
        }
      } else {
        if (!selectedNote || !protocol.isNoteSpendable(selectedNote, Boolean(config.poiNodeUrl))) throw new Error('Select an unspent note with valid PPOI');
        activityAmount = ethers.formatUnits(selectedNote.note.amount, asset.decimals);
        privateResult = await protocol.unshieldTokens({
          signer: actionSigner, config, asset, wallet, synced, note: selectedNote, recipient, directSubmission: submitDirectly,
          onStage: (stage) => setBusy(stage === 'resources' ? 'Loading prover resources…'
            : stage === 'proving' ? 'Generating Groth16 proof…'
              : stage === 'estimating' ? 'Estimating Unshield network fee…' : 'Signing and broadcasting Unshield…'),
          onSubmitted: (hash) => { recordBroadcast(hash); prefetchPoiAssets(); },
          onProgress: (progress) => setBusy(`Loading prover resources… ${progress}%`),
        });
        receipt = privateResult.receipt;
      }
      if (!receipt) throw new Error('Transaction receipt was not returned. Check Activity before retrying.');
      if (receipt.status !== 1) throw new Error(`The transaction ${receipt.hash} was included but reverted. Review the details before retrying.`);
      let poiWarning = '';
      if (privateResult && config.poiNodeUrl) {
        setBusy('Submitting confirmed PPOI proof…');
        try {
          const { savePendingPOI, submitPendingPOI } = await import('@/lib/swirl/poi');
          const pending = await savePendingPOI(privateResult, wallet);
          await submitPendingPOI(pending, wallet, config, asset);
        } catch (cause) { poiWarning = ` PPOI is pending: ${errorMessage(cause)}. The transaction is confirmed; do not submit it again.`; }
      }
      let postConfirmationWarning = poiWarning;
      try {
        await addActivity({ kind: activityKind, transactionHash: receipt.hash, amount: activityAmount, counterparty: recipient || undefined, chainId: config.chainId, account: evmAddress, assetToken: asset.token, assetSymbol: asset.symbol, direction: 'outgoing', status: 'confirmed' });
      } catch { postConfirmationWarning += ' Activity could not be saved locally, but the transaction is confirmed.'; }
      // The confirmed inputs' nullifiers are spent on-chain. Hide those notes
      // immediately instead of waiting for the background sync to catch up.
      if (privateResult) {
        const spentLeaves = new Set(privateResult.poi.inputs.map((spent) => spent.note.leafIndex));
        setSynced((current) => ({ ...current, notes: current.notes.map((note) => spentLeaves.has(note.note.leafIndex) ? { ...note, spent: true } : note) }));
      }
      try {
        setActivities(await listCombinedActivity(config.chainId, evmAddress));
      } catch { postConfirmationWarning += ' Activity could not be refreshed, but the transaction is confirmed.'; }
      // Confirmation is final. Reconcile balances and notes in the background instead
      // of holding the success state behind Indexer, PPOI or Gas RPC requests.
      void Promise.all([refresh(), refreshGas()]).catch(() => undefined);
      const successNotice = (action === 'shield' ? 'Shield confirmed. Your encrypted note is now in the vault.'
        : action === 'transfer' ? transferKind === 'public' ? 'Public transfer confirmed.' : 'Private transfer confirmed. The input nullifiers are now spent.'
          : 'Unshield confirmed. Public assets were sent to the recipient.') + ` Amount: ${activityAmount} ${asset.symbol}.${postConfirmationWarning}`;
      setError(''); setNotice(successNotice); setTransactionHash(receipt.hash); setRecipient(''); setSelectedNote(null); setAmount('0');
    } catch (cause) { setError(errorMessage(cause)); } finally {
      privateInFlight.current = false;
      if (selectedNote) setPendingSpendLeaves((current) => current.filter((leaf) => leaf !== selectedNote.note.leafIndex));
      setBusy('');
    }
  }
  async function topUpGas(event: FormEvent) {
    event.preventDefault();
    if (!wallet) return openAuth();
    setBusy('Funding Gas account…'); setError(''); setNotice('');
    try {
      const parsed = ethers.parseEther(gasAmount || '0');
      if (parsed <= 0n) throw new Error('Enter a Gas top-up amount greater than zero');
      const { topUpGasAccount } = await import('@/lib/swirl/gas');
      const receipt = await topUpGasAccount({
        config, mnemonic: wallet.mnemonic, amount: parsed,
        onSubmitted: (hash) => {
          setTransactionHash(hash);
          setNotice(`Gas top-up submitted ${hash.slice(0, 10)}…${hash.slice(-6)}. Waiting for ${config.name} confirmation.`);
          setBusy('');
        },
      });
      if (!receipt || receipt.status !== 1) throw new Error('The Gas top-up was included but reverted. Review the transaction before retrying.');
      // The recipient balance increases by exactly the confirmed top-up amount.
      setGasBalance((current) => (current ?? 0n) + parsed);
      void Promise.all([refresh(), refreshGas()]).catch(() => undefined);
      setNotice(`Gas account funded with ${gasAmount} ETH.`); setTransactionHash(receipt.hash); setGasAmount('0');
    } catch (cause) { setError(errorMessage(cause)); } finally { setBusy(''); }
  }

  const totals = Object.values(portfolio).reduce((sum, entry) => ({
    public: sum.public + usdValue(entry.publicAmount, config.assets.find((item) => portfolio[item.token] === entry)?.decimals ?? 18, entry.price),
    private: sum.private + usdValue(entry.privateAmount, config.assets.find((item) => portfolio[item.token] === entry)?.decimals ?? 18, entry.price),
  }), { public: 0, private: 0 });
  const entries = Object.values(portfolio);
  const publicPriceMissing = entries.some((entry) => entry.publicAmount > 0n && entry.price <= 0);
  const privatePriceMissing = entries.some((entry) => entry.privateAmount > 0n && entry.price <= 0);
  const totalUsdText = publicPriceMissing || privatePriceMissing ? '—' : formatUsd(totals.public + totals.private);
  const publicUsdText = publicPriceMissing ? '—' : formatUsd(totals.public);
  const privateUsdText = privatePriceMissing ? '—' : formatUsd(totals.private);
  const availablePrivate = currentEntry?.privateAmount;
  const spendableNotes = asset ? synced.notes.filter((note) => note.note.token === BigInt(asset.token)) : [];

  return <main className="dashboard-shell">
    <aside className="dashboard-sidebar">
      <div className="sidebar-brand"><Link href="/" aria-label="SWIRL home"><Logo size="lg" /></Link><span>WEB APP</span></div>
      <button type="button" className="sidebar-wallet" onClick={wallet ? () => setView('overview') : openAuth}>
        <span className="sidebar-wallet-mark"><WalletMark size={38} /></span>
        <span className="sidebar-wallet-copy"><strong>{wallet ? short(evmAddress, 7, 5) : 'Connect web wallet'}</strong><span>{wallet ? config.name : 'Your keys stay on this device'}</span></span><span className={`wallet-status${wallet ? ' online' : ''}`} />
      </button>
      <nav className="sidebar-nav" aria-label="Web application navigation">
        <span className="sidebar-label">WALLET</span>
        <NavButton active={view === 'overview'} onClick={() => setView('overview')} icon={Grid}>Overview</NavButton>
        <NavButton active={view === 'transfer'} onClick={() => openAction('transfer')} icon={ArrowUp}>Transfer</NavButton>
        <NavButton active={view === 'receive'} onClick={() => setView('receive')} icon={ArrowDown}>Receive</NavButton>
        <NavButton active={view === 'shield'} onClick={() => openAction('shield')} icon={Shield}>Shield</NavButton>
        <NavButton active={view === 'unshield'} onClick={() => openAction('unshield')} icon={ShieldOff}>Unshield</NavButton>
        <span className="sidebar-label sidebar-label-manage">ECOSYSTEM</span>
        <NavButton active={view === 'governance'} onClick={() => setView('governance')} icon={Vote}>Governance</NavButton>
        <NavButton active={view === 'mining'} onClick={() => setView('mining')} icon={Mining}>Anonymous Mining</NavButton>
        <span className="sidebar-label sidebar-label-manage">MANAGE</span>
        <NavButton active={view === 'gas'} onClick={() => setView('gas')} icon={Fuel}>Gas account</NavButton>
        <NavButton active={view === 'activity'} onClick={() => setView('activity')} icon={ActivityIcon}>Activity</NavButton>
        <NavButton active={view === 'settings'} onClick={() => setView('settings')} icon={SettingsIcon}>Settings</NavButton>
      </nav>
      <div className="sidebar-bottom"><Globe size={15} /><span>Real on-chain web application</span></div>
    </aside>

    <section className="dashboard-main">
      <header className="dashboard-topbar">
        <div className="topbar-title"><span className="topbar-path">WEB APP&nbsp;&nbsp;/&nbsp;&nbsp;{details.title.toUpperCase()}</span><h1>{details.title}</h1><p>{details.subtitle}</p></div>
        <div className="topbar-actions">
          <button type="button" className="icon-action" onClick={() => { void refresh(); void refreshGas(); }} disabled={!wallet || syncing} aria-label="Refresh balances" title="Refresh balances"><Refresh size={17} /></button>
          <ThemeToggle />
          <label className="network-select" title="Select network"><ChainIcon src={currentChain.src} name={currentChain.name} size={22} /><select value={config.chainId} onChange={(event) => void selectNetwork(Number(event.target.value))} disabled={Boolean(busy)} aria-label="Select network">{networks.map((network) => <option key={network.chainId} value={network.chainId} disabled={![1, 11155111].includes(network.chainId)}>{network.name}{![1, 11155111].includes(network.chainId) ? ' · Soon' : ''}</option>)}</select></label>
          <button type="button" className="connect-button" onClick={wallet ? lockWallet : openAuth}>{wallet ? <><Lock size={15} /> Lock</> : 'Connect wallet'}</button>
        </div>
      </header>

      <nav className="mobile-wallet-nav" aria-label="Mobile web application navigation">{(['overview', 'transfer', 'receive', 'shield', 'unshield', 'activity'] as View[]).map((item) => <button type="button" key={item} onClick={() => item === 'transfer' || item === 'shield' || item === 'unshield' ? openAction(item) : setView(item)} className={view === item ? 'active' : ''}>{viewDetails[item].title}</button>)}</nav>

      {(error || notice) && <div className={`app-feedback${error ? ' error' : ''}`} role="status"><span>{error || notice}</span>{transactionHash && transactionExplorer(config.chainId, transactionHash) && <a href={transactionExplorer(config.chainId, transactionHash)} target="_blank" rel="noreferrer">View transaction <External size={13} /></a>}<button type="button" onClick={() => { setError(''); setNotice(''); setTransactionHash(''); }} aria-label="Dismiss notification"><Close size={15} /></button></div>}
      {busy && <div className="busy-bar"><span className="spinner" />{busy}</div>}

      {view === 'overview' && <div className="dashboard-content">
        <section className="portfolio-grid">
          <div className="portfolio-panel">
            <div className="panel-eyebrow">TOTAL PORTFOLIO <span>{config.name.toUpperCase()}</span></div>
            <div className="portfolio-value">{wallet ? totalUsdText : '—'}</div>
            <p>{wallet ? 'Live balances read from the chain and your encrypted notes.' : 'Connect or restore a wallet to load real public and private balances.'}</p>
            <div className="balance-grid"><div><span>Public wallet</span><strong>{wallet ? publicUsdText : '—'}</strong></div><div><span>Private wallet</span><strong>{wallet ? privateUsdText : '—'}</strong></div><div><span>Network</span><strong>{config.name}</strong></div><div><span>Status</span><strong className="live-value"><i />{syncing ? 'Syncing' : wallet ? 'On-chain' : 'Not connected'}</strong></div></div>
            {!wallet && <button type="button" className="primary-inline" onClick={openAuth}>Connect wallet to load balances <ArrowRight size={15} /></button>}
          </div>
          <div className="network-panel">
            <div className="network-orbit"><div><AnimatedSwirlMark size={82} /><span>SWIRL</span></div></div>
            <div><span className="panel-eyebrow">MULTI-CHAIN ACCESS</span><h2>One interface. Real assets.</h2><p>Official network identities, with unavailable chains clearly marked.</p><div className="network-dots">{ecosystem.map((network) => <span key={network.name} className={network.live ? 'live' : 'soon'} title={`${network.name}${network.live ? '' : ' · Soon'}`}><ChainIcon src={network.src} name={network.name} size={30} /></span>)}</div><small>ETHEREUM LIVE · OTHER NETWORKS SOON</small></div>
          </div>
        </section>

        <section className="dashboard-section"><div className="section-heading"><div><h2>Quick actions</h2><p>Each action runs here in the web application.</p></div></div><div className="quick-grid">{[
          { name: 'Transfer', note: 'Public or private transfer', icon: ArrowUp, action: () => openAction('transfer') },
          { name: 'Receive', note: 'EVM or SWIRL address', icon: ArrowDown, action: () => setView('receive') },
          { name: 'Shield', note: 'Enter the private pool', icon: Shield, action: () => openAction('shield') },
          { name: 'Unshield', note: 'Withdraw to a public address', icon: ShieldOff, action: () => openAction('unshield') },
        ].map(({ name, note, icon: Icon, action }) => <button type="button" className="quick-card" key={name} onClick={action}><span className="quick-icon"><Icon size={19} /></span><span className="quick-copy"><strong>{name}</strong><span>{note}</span></span><ArrowRight size={16} /></button>)}</div></section>

        <section className="dashboard-section assets-section"><div className="section-heading"><div><h2>Assets</h2><p>Real balances on {config.name}.</p></div><span className="asset-total">{wallet ? totalUsdText : '—'} <small>{config.assets.length} ASSETS</small></span></div>
          <div className="asset-filter"><span className="active">All assets</span><span><Globe size={13} /> Public + Private</span><span className="asset-network-filter">{config.name}</span></div>
          <div className="asset-table-wrap"><table className="asset-table"><thead><tr><th>ASSET</th><th>NETWORK</th><th>PUBLIC</th><th>PRIVATE</th><th>TOTAL</th><th /></tr></thead><tbody>{config.assets.map((item) => {
            const entry = portfolio[item.token];
            const total = entry ? entry.publicAmount + entry.privateAmount : undefined;
            return <tr key={item.token}><td><ChainIcon src={assetIcon[item.symbol] ?? '/chains/eth.svg'} name={item.symbol} size={32} /><div><strong>{item.name}</strong><span>{item.symbol}</span></div></td><td>{config.name}</td><td><strong>{wallet ? `${formatAmount(entry?.publicAmount, item.decimals)} ${item.symbol}` : '—'}</strong></td><td><strong>{wallet ? `${formatAmount(entry?.privateAmount, item.decimals)} ${item.symbol}` : '—'}</strong></td><td><strong>{wallet ? `${formatAmount(total, item.decimals)} ${item.symbol}` : '—'}</strong>{entry?.loaded && total !== undefined && <small>{entry.price > 0 || total === 0n ? formatUsd(usdValue(total, item.decimals, entry.price)) : 'USD unavailable'}</small>}</td><td><button type="button" onClick={() => openAction('transfer', item.symbol)} aria-label={`Transfer ${item.name}`}><ArrowRight size={16} /></button></td></tr>;
          })}</tbody></table></div>
        </section>
      </div>}

      {['transfer', 'shield', 'unshield'].includes(view) && <div className="dashboard-content narrow-content"><section className="operation-layout"><div className="operation-card">
        <div className="operation-heading"><span className="operation-icon">{view === 'shield' ? <Shield size={23} /> : view === 'unshield' ? <ShieldOff size={23} /> : <ArrowUp size={23} />}</span><div><h2>{details.title} assets</h2><p>{details.subtitle}</p></div></div>
        <form onSubmit={submitAction}>
          {view === 'transfer' && <div className="segment-control"><button type="button" className={transferKind === 'private' ? 'active' : ''} onClick={() => setTransferKind('private')}><Shield size={15} /> Private</button><button type="button" className={transferKind === 'public' ? 'active' : ''} onClick={() => setTransferKind('public')}><Globe size={15} /> Public</button></div>}
          <AssetSelect assets={config.assets} value={asset?.symbol ?? ''} onChange={selectAsset} disabled={Boolean(busy)} />
          <div className="available-row"><span>{view === 'shield' || (view === 'transfer' && transferKind === 'public') ? 'Available public balance' : 'Available private balance'}</span><strong>{wallet && asset ? `${formatAmount(view === 'shield' || (view === 'transfer' && transferKind === 'public') ? publicBalance ?? undefined : availablePrivate, asset.decimals)} ${asset.symbol}` : 'Connect wallet'}</strong></div>
          {view !== 'unshield' && <label className="form-field"><span>Amount</span><div className="amount-input"><input type="text" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.0" required /><button type="button" onClick={() => void fillMax()} disabled={!wallet}>MAX</button><span>{asset?.symbol}</span></div></label>}
          {view === 'unshield' && <label className="form-field"><span>Private note</span><select value={selectedNote?.note.leafIndex ?? ''} onChange={(event) => setSelectedNote(spendableNotes.find((note) => note.note.leafIndex === Number(event.target.value)) ?? null)} required><option value="">Select a note to withdraw</option>{spendableNotes.map((note) => <option key={note.note.leafIndex} value={note.note.leafIndex} disabled={note.spent || pendingSpendLeaves.includes(note.note.leafIndex) || Boolean(config.poiNodeUrl) && note.poiStatus !== 'Valid'}>#{note.note.leafIndex} · {ethers.formatUnits(note.note.amount, asset?.decimals ?? 18)} {asset?.symbol} · {pendingSpendLeaves.includes(note.note.leafIndex) ? 'Spend pending confirmation' : notePoiLabel(note, clock)}</option>)}</select></label>}
          {view === 'unshield' && hasPendingPoi && <div className="inline-notice">PPOI status refreshes automatically. Notes become selectable after the waiting period and review.</div>}
          {view !== 'shield' && <label className="form-field"><span>{view === 'unshield' ? 'Public recipient' : transferKind === 'private' ? 'Private SWIRL recipient' : 'Public recipient'}</span><input value={recipient} onChange={(event) => setRecipient(event.target.value)} placeholder={view === 'transfer' && transferKind === 'private' ? 'swirl1…' : '0x…'} required spellCheck={false} /></label>}
          <div className="transaction-meta"><div><span>Network</span><strong>{config.name}</strong></div><div><span>Fee payer</span><strong>{view === 'shield' || (view === 'transfer' && transferKind === 'public') ? 'Your EVM wallet' : settings.submission === 'relayer' && relayerSupported && !(view === 'unshield' && asset?.kind === 'native') ? 'Relayer' : settings.submission === 'gas' ? 'Gas account' : 'Your EVM wallet'}</strong></div>{view === 'shield' && <div><span>Protocol fee</span><strong>{(config.feeBps / 100).toFixed(2)}%</strong></div>}</div>
          {!wallet && <div className="inline-notice">Connect your wallet in this page to review and submit this transaction.</div>}
          <button className="submit-operation" type={wallet ? 'submit' : 'button'} onClick={wallet ? undefined : openAuth} disabled={Boolean(busy) || (syncing && !signer)}>{busy ? <><span className="spinner" />{busy}</> : <>{wallet ? `Confirm ${details.title}` : 'Connect wallet to continue'}<ArrowRight size={17} /></>}</button>
        </form>
      </div><aside className="operation-aside"><span className="panel-eyebrow">HOW IT WORKS</span><h3>{view === 'shield' ? 'Public in. Private out.' : view === 'unshield' ? 'Private note. Public withdrawal.' : transferKind === 'private' ? 'Private sender. Private recipient.' : 'Standard on-chain transfer.'}</h3><p>{view === 'shield' ? 'The web app creates an encrypted note and submits the real Shield transaction to the deployed vault.' : view === 'unshield' ? 'Select one spendable note. The app generates the proof locally and withdraws its value to your recipient.' : transferKind === 'private' ? 'The app selects PPOI-valid notes, creates a Groth16 proof locally and submits through your selected fee payer.' : 'This sends a normal public transaction from your main EVM account.'}</p><div className="security-line"><Lock size={15} /> Keys and proofs stay on this device.</div></aside></section></div>}

      {view === 'receive' && <div className="dashboard-content narrow-content"><section className="receive-card"><div className="segment-control"><button type="button" className={receiveKind === 'private' ? 'active' : ''} onClick={() => setReceiveKind('private')}><Shield size={15} /> Private SWIRL</button><button type="button" className={receiveKind === 'public' ? 'active' : ''} onClick={() => setReceiveKind('public')}><Globe size={15} /> Public EVM</button></div>{wallet ? <><div className="qr-wrap"><QRCodeSVG value={receiveAddress} size={196} bgColor="#ffffff" fgColor="#101216" level="M" /></div><span className="panel-eyebrow">{receiveKind === 'private' ? 'PRIVATE ADDRESS' : `${config.name.toUpperCase()} ADDRESS`}</span><h2>{receiveKind === 'private' ? 'Receive private assets' : 'Receive public assets'}</h2><div className="address-box"><code>{receiveAddress}</code></div><button type="button" className="submit-operation" onClick={() => void copyValue('receive', receiveAddress)}>{copied === 'receive' ? 'Copied' : 'Copy address'}<Copy size={16} /></button></> : <div className="locked-panel"><LogoMark size={54} /><h2>Connect to view your addresses</h2><p>Your addresses are derived locally from your recovery phrase.</p><button type="button" className="submit-operation" onClick={openAuth}>Connect wallet</button></div>}</section></div>}

      {view === 'gas' && <div className="dashboard-content narrow-content"><section className="operation-layout"><div className="operation-card"><div className="operation-heading"><span className="operation-icon"><Fuel size={23} /></span><div><h2>Dedicated Gas account</h2><p>Used only when Gas account is selected in Settings.</p></div></div><div className="gas-balance"><span>Available for network fees</span><strong>{wallet ? gasBalance === null ? 'Unavailable' : `${ethers.formatEther(gasBalance)} ETH` : '—'}</strong></div><div className="address-box"><code>{wallet ? gasAccount || 'Loading Gas address…' : 'Connect wallet to derive your Gas account'}</code>{gasAccount && <button type="button" onClick={() => void copyValue('gas', gasAccount)} aria-label="Copy Gas address"><Copy size={15} /></button>}</div><form onSubmit={topUpGas}><label className="form-field"><span>Top-up amount</span><div className="amount-input"><input value={gasAmount} onChange={(event) => setGasAmount(event.target.value)} inputMode="decimal" placeholder="0.0" required /><span>ETH</span></div></label><button className="submit-operation" type={wallet ? 'submit' : 'button'} onClick={wallet ? undefined : openAuth} disabled={Boolean(busy)}>{wallet ? 'Fund Gas account' : 'Connect wallet to continue'}<ArrowRight size={17} /></button></form></div><aside className="operation-aside"><span className="panel-eyebrow">ESTIMATED CAPACITY</span>{gasEstimates.map((estimate) => <div className="estimate-row" key={estimate.operation}><span>{estimate.operation === 'transfer' ? 'Private transfer' : 'Unshield'}</span><strong>{ethers.formatEther(estimate.bufferedCost)} ETH</strong></div>)}<p>These are live network-fee estimates. Relayer submissions instead use the Relayer quote.</p></aside></section></div>}

      {view === 'activity' && <div className="dashboard-content"><section className="activity-panel"><div className="section-heading"><div><h2>Transaction activity</h2><p>Public on-chain and local activity for {wallet ? short(evmAddress) : 'your wallet'} on {config.name}.</p></div><button type="button" className="secondary-button" onClick={() => void refresh()} disabled={!wallet || syncing}><Refresh size={15} /> Refresh</button></div>{!wallet ? <div className="empty-state"><ActivityIcon size={32} /><h3>Connect to load your activity</h3><button type="button" className="primary-inline" onClick={openAuth}>Connect wallet</button></div> : activities.length === 0 ? <div className="empty-state"><ActivityIcon size={32} /><h3>No transactions recorded yet</h3><p>Public transfers and transactions submitted from this browser will appear here.</p></div> : <div className="activity-list">{activities.map((item) => <a key={item.id} href={transactionExplorer(item.chainId, item.transactionHash)} target="_blank" rel="noreferrer"><span className="activity-kind">{item.status === 'pending' ? `${item.kind} · pending` : item.kind}</span><span><strong>{item.amount} {item.assetSymbol ?? ''}</strong><small>{new Date(item.timestamp).toLocaleString()}</small></span><code>{short(item.transactionHash, 10, 8)}</code><External size={15} /></a>)}</div>}</section></div>}

      {view === 'settings' && <div className="dashboard-content narrow-content"><section className="settings-list"><details className="settings-card" open><summary><span><strong>Transaction submission</strong><small>Choose who pays network Gas for private transactions</small></span></summary><div className="settings-detail"><label className="form-field"><span>Fee payer</span><select value={settings.submission} onChange={(event) => updateSettings({ submission: event.target.value as WalletSettings['submission'] })}><option value="main">Your EVM wallet · direct Gas</option><option value="relayer">Relayer · quoted token fee</option><option value="gas">Dedicated Gas account</option></select></label><p>Your own EVM wallet pays network Gas by default. Relayer and the dedicated Gas account remain optional for private transactions.</p></div></details><details className="settings-card"><summary><span><strong>Security & recovery</strong><small>Auto-lock and locally stored recovery credentials</small></span></summary><div className="settings-detail"><label className="form-field"><span>Auto-lock after inactivity</span><select value={settings.autoLockMinutes} onChange={(event) => updateSettings({ autoLockMinutes: Number(event.target.value) })}><option value={0}>Disabled</option><option value={1}>1 minute</option><option value={5}>5 minutes</option><option value={15}>15 minutes</option><option value={30}>30 minutes</option></select></label>{wallet && <>{!showRecovery ? <button type="button" className="secondary-button" onClick={() => setShowRecovery(true)}>Reveal recovery credentials</button> : <div className="recovery-data"><label>Recovery phrase<code>{wallet.mnemonic}</code></label><label>EVM private key<code>{evmPrivateKey}</code></label><button type="button" className="secondary-button" onClick={() => setShowRecovery(false)}>Hide credentials</button></div>}</>}</div></details><details className="settings-card"><summary><span><strong>Wallet session</strong><small>Lock the decrypted wallet on this device</small></span></summary><div className="settings-detail"><p>Your encrypted wallet remains in this browser. You will need your password to unlock it again.</p><button type="button" className="danger-button" onClick={wallet ? lockWallet : openAuth}>{wallet ? 'Lock wallet' : 'Connect wallet'}<Lock size={15} /></button></div></details></section></div>}

      {(view === 'governance' || view === 'mining') && <div className="dashboard-content soon-content"><section className="soon-panel"><div className="soon-orbit" aria-hidden="true"><i /><i /></div><span className="soon-icon">{view === 'governance' ? <Vote size={32} /> : <Mining size={32} />}</span><span className="soon-label">SWIRL ECOSYSTEM · COMING SOON</span><h2>{details.title}</h2><p>{view === 'governance' ? 'Protocol governance will have its home here. The module is not live yet.' : 'Anonymous mining will have its home here. The module is not live yet.'}</p><span className="soon-status"><i /> SOON</span><button type="button" onClick={() => setView('overview')} className="soon-back">Back to overview <ArrowRight size={14} /></button></section></div>}

      <footer className="dashboard-footer"><span>SWIRL.CASH</span><span>NON-CUSTODIAL · REAL ON-CHAIN WEB APP</span></footer>
    </section>

    {authMode !== 'closed' && <div className="auth-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) closeAuth(); }}><section className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title"><button type="button" className="auth-close" onClick={closeAuth} aria-label="Close wallet dialog"><Close size={18} /></button>
      <div className="auth-brand"><LogoMark size={48} /><span>SWIRL WEB WALLET</span></div>
      {authMode === 'choice' && <><h2 id="auth-title">Use SWIRL on the web</h2><p>Create a new wallet or restore the same wallet used in your extension. Your recovery phrase is encrypted locally.</p><button type="button" className="submit-operation" onClick={() => setAuthMode('create')}>Create new wallet<ArrowRight size={16} /></button><button type="button" className="secondary-button full-button" onClick={() => setAuthMode('import')}>Import recovery phrase</button></>}
      {(authMode === 'create' || authMode === 'import') && <form onSubmit={(event) => void createWallet(event, authMode === 'import')}><h2 id="auth-title">{authMode === 'create' ? 'Create your wallet' : 'Restore your wallet'}</h2><p>{authMode === 'create' ? 'Set a password to encrypt the wallet on this device.' : 'Enter your recovery phrase. It never leaves this page.'}</p>{authMode === 'import' && <label className="form-field"><span>Recovery phrase</span><textarea value={mnemonic} onChange={(event) => setMnemonic(event.target.value)} rows={3} required autoComplete="off" /></label>}<label className="form-field"><span>Encryption password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={12} placeholder="At least 12 characters" required autoComplete="new-password" /></label><label className="form-field"><span>Confirm password</span><input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} minLength={12} required autoComplete="new-password" /></label>{walletExists && <label className="confirm-check"><input type="checkbox" checked={overwriteConfirmed} onChange={(event) => setOverwriteConfirmed(event.target.checked)} /><span>Replace the encrypted wallet currently saved in this browser.</span></label>}<button className="submit-operation" type="submit" disabled={Boolean(busy)}>{busy || authMode === 'create' ? busy || 'Create encrypted wallet' : 'Restore encrypted wallet'}<ArrowRight size={16} /></button><button type="button" className="secondary-button full-button" onClick={() => setAuthMode(walletExists ? 'unlock' : 'choice')}>Back</button></form>}
      {authMode === 'unlock' && <form onSubmit={(event) => void unlock(event)}><h2 id="auth-title">Unlock web wallet</h2><p>Decrypt the wallet stored in this browser to use real balances and transactions.</p><label className="form-field"><span>Wallet password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoFocus autoComplete="current-password" /></label><button className="submit-operation" type="submit" disabled={Boolean(busy)}>{busy || 'Unlock wallet'}<Lock size={16} /></button><button type="button" className="secondary-button full-button" onClick={() => setAuthMode('import')}>Import a different wallet</button><button type="button" className="text-button" onClick={() => setAuthMode('create')}>Create a new wallet</button></form>}
      {authMode === 'backup' && wallet && <><h2 id="auth-title">Back up your wallet</h2><p>Write these credentials down offline. Anyone with them can control your assets.</p><div className="recovery-data"><label>Recovery phrase<code>{wallet.mnemonic}</code></label><label>EVM private key<code>{evmPrivateKey}</code></label></div><button type="button" className="secondary-button full-button" onClick={() => void copyValue('backup', `${wallet.mnemonic}\n${evmPrivateKey}`)}>{copied === 'backup' ? 'Copied' : 'Copy recovery credentials'}<Copy size={15} /></button><label className="confirm-check"><input type="checkbox" checked={backupConfirmed} onChange={(event) => setBackupConfirmed(event.target.checked)} /><span>I have saved my recovery credentials securely.</span></label><button type="button" className="submit-operation" disabled={!backupConfirmed} onClick={() => { setAuthMode('closed'); setNotice('Wallet ready. Loading real on-chain balances…'); }}>Open web wallet<ArrowRight size={16} /></button></>}
    </section></div>}
  </main>;
}
