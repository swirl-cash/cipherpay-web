'use client';

import { Callout, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

const ROWS = [
  { observer: 'Public chain observer', sees: 'Contract calls, public settlement, addresses and events that the underlying chain makes public.', boundary: 'Private note data and proofs can hide specific relationships; they do not erase the public transaction itself.' },
  { observer: 'RPC or indexer', sees: 'IP address, balance or note queries, requested chain, contract and timestamps.', boundary: 'Infrastructure choice and query patterns matter. Use trusted or independently operated endpoints where appropriate.' },
  { observer: 'Relayer or coordinator', sees: 'Submission payloads, route-specific metadata, timing and any information required to provide the service.', boundary: 'It should not receive spending keys, but availability, metadata and route-specific trust still remain.' },
  { observer: 'dApp or website', sees: 'The account and actions the user approves, plus ordinary web and wallet-connection metadata.', boundary: 'Review every connection and signature. A private balance does not make a malicious approval safe.' },
  { observer: 'Device or browser attacker', sees: 'Potentially local storage, unlocked sessions, clipboard contents or recovery material.', boundary: "Local encryption helps at rest, but device security and offline backups remain the user's responsibility." },
];

export default function ThreatModelSection() {
  return (
    <>
      <SectionTitle>Privacy is a boundary, not a slogan</SectionTitle>
      <Paragraph>SWIRL is designed to reduce unnecessary exposure across Bitcoin and EVM while keeping users in control. The protection differs by implementation, but the core question is always the same: <Strong>who can observe which information, and what can they do with it?</Strong></Paragraph>
      <Paragraph>The model includes passive chain analysts, infrastructure operators, network observers, malicious websites and device attackers. No single mechanism addresses all of them. Wallet encryption, zero-knowledge proofs, route privacy, credential design and user behavior each cover a different part of the system.</Paragraph>

      <SectionDivider />
      <SectionTitle>What different observers can learn</SectionTitle>
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead><tr style={{ borderBottom: '1px solid var(--cp-border)' }}><th style={{ textAlign: 'left', padding: 10, color: 'var(--cp-text-muted)' }}>OBSERVER</th><th style={{ textAlign: 'left', padding: 10, color: 'var(--cp-text-muted)' }}>WHAT IT MAY SEE</th><th style={{ textAlign: 'left', padding: 10, color: 'var(--cp-text-muted)' }}>THE BOUNDARY</th></tr></thead>
          <tbody>{ROWS.map((row) => <tr key={row.observer} style={{ borderBottom: '1px solid var(--cp-border)' }}><td style={{ padding: 10, color: 'var(--cp-text)', fontWeight: 600, whiteSpace: 'nowrap' }}>{row.observer}</td><td style={{ padding: 10, color: 'var(--cp-text-dim)' }}>{row.sees}</td><td style={{ padding: 10, color: 'var(--cp-text-dim)' }}>{row.boundary}</td></tr>)}</tbody>
        </table>
      </div>

      <SectionDivider />
      <SectionTitle>What SWIRL does not promise</SectionTitle>
      <Paragraph>SWIRL does not promise absolute anonymity, untraceable public settlement or protection from every endpoint mistake. Timing, amounts, network fingerprints, address reuse and the size of the available privacy set can reveal information even when cryptography works as intended.</Paragraph>
      <Paragraph>SWIRL also does not remove all trust. Smart contracts, wallet code, list providers, Relayers, coordinators, RPC endpoints and indexers have different roles. A production evaluation must identify which of those components is actually deployed and which trust assumptions remain.</Paragraph>
      <Callout type="warning">Do not protect a large balance with an untested recovery process. Keep offline backups, verify addresses and deployments, and test the complete transaction and recovery flow with a small amount first.</Callout>
    </>
  );
}
