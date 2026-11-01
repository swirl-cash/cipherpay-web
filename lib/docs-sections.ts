export const DOC_SECTIONS = [
  { id: 'overview', title: 'SWIRL Protocol Overview', shortTitle: 'Overview' },
  { id: 'threat-model', title: 'Privacy & Threat Model', shortTitle: 'Threat Model' },
  { id: 'evm-overview', title: 'EVM Privacy Architecture', shortTitle: 'EVM Overview' },
  { id: 'evm-wallet', title: 'EVM Wallet, Assets & Recovery', shortTitle: 'Wallet & Recovery' },
  { id: 'evm-relayer', title: 'Relayers, PPOI & Submission', shortTitle: 'Relayer & PPOI' },
  { id: 'bitcoin-overview', title: 'Bitcoin Privacy Architecture', shortTitle: 'Bitcoin Overview' },
  { id: 'receiving', title: 'Silent Receiving (BOLT12)', shortTitle: 'Receiving' },
  { id: 'rounds', title: 'Pool Depth & Anonymity', shortTitle: 'The Pool' },
  { id: 'denominations', title: 'Denomination Lattice', shortTitle: 'Denominations' },
  { id: 'timing', title: 'Timing & Order Randomization', shortTitle: 'Timing' },
  { id: 'discipline', title: 'Usage Discipline, Enforced', shortTitle: 'Discipline' },
  { id: 'loop-out', title: 'Submarine Loop-Out', shortTitle: 'Loop-Out' },
  { id: 'channels', title: 'Channels & Liquidity', shortTitle: 'Channels' },
  { id: 'csv-rgb', title: 'Client-Side Validation & RGB', shortTitle: 'RGB Basics' },
  { id: 'rgb-privacy', title: 'RGB’s Privacy Surface', shortTitle: 'RGB Privacy' },
  { id: 'asset-mixing', title: 'Privacy at the Asset Layer', shortTitle: 'Asset Privacy' },
  { id: 'bridge', title: 'Cross-Chain Gateway', shortTitle: 'Bridge' },
  { id: 'fees', title: 'Fee Schedule & Subsidies', shortTitle: 'Fees' },
  { id: 'receipts', title: 'Receipts & Compliance Proofs', shortTitle: 'Receipts' },
  { id: 'zk-roadmap', title: 'Zero-Knowledge Trust Roadmap', shortTitle: 'ZK Roadmap' },
  { id: 'mining', title: 'Anonymity Mining', shortTitle: 'Mining' },
  { id: 'governance', title: 'SWIRL Token & Governance', shortTitle: 'Governance' },
  { id: 'cli', title: 'CLI Reference', shortTitle: 'CLI' },
  { id: 'testing', title: 'Test Harness & Verification', shortTitle: 'Testing' },
] as const;

export type DocSectionId = (typeof DOC_SECTIONS)[number]['id'];

export const DOC_SIDEBAR_GROUPS = [
  { label: 'Start Here', icon: 'start' as const, ids: ['overview', 'threat-model'] as DocSectionId[] },
  { label: 'EVM', icon: 'guides' as const, ids: ['evm-overview', 'evm-wallet', 'evm-relayer'] as DocSectionId[] },
  { label: 'Bitcoin', icon: 'reference' as const, ids: ['bitcoin-overview', 'receiving', 'rounds', 'denominations', 'timing', 'discipline', 'loop-out', 'channels'] as DocSectionId[] },
  { label: 'Research', icon: 'agents' as const, ids: ['csv-rgb', 'rgb-privacy', 'asset-mixing', 'zk-roadmap'] as DocSectionId[] },
  { label: 'Ecosystem', icon: 'reference' as const, ids: ['bridge', 'fees', 'receipts', 'mining', 'governance'] as DocSectionId[] },
  { label: 'Reference', icon: 'guides' as const, ids: ['cli', 'testing'] as DocSectionId[] },
] as const;

export type DocSidebarGroupIcon = (typeof DOC_SIDEBAR_GROUPS)[number]['icon'];

const SECTION_IDS = new Set<string>(DOC_SECTIONS.map((s) => s.id));

export function isDocSectionId(id: string): id is DocSectionId {
  return SECTION_IDS.has(id);
}

export function getDocSection(id: string) {
  return DOC_SECTIONS.find((s) => s.id === id);
}

export function docsSectionPath(sectionId: DocSectionId | string): '/docs' | `/docs/${string}` {
  if (sectionId === 'overview') return '/docs';
  return `/docs/${sectionId}`;
}

export function hiddenDocSectionIds(_testnet: boolean): DocSectionId[] {
  return [];
}

export function visibleDocSections(testnet: boolean) {
  const hidden = new Set(hiddenDocSectionIds(testnet));
  return DOC_SECTIONS.filter((s) => !hidden.has(s.id));
}

export function visibleDocSidebarGroups(testnet: boolean) {
  const hidden = new Set(hiddenDocSectionIds(testnet));
  return DOC_SIDEBAR_GROUPS.map((group) => ({
    ...group,
    ids: group.ids.filter((id) => !hidden.has(id)),
  })).filter((group) => group.ids.length > 0);
}
