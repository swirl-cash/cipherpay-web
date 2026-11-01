'use client';

import { Callout, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';
import type { DocSectionId } from '@/lib/docs-sections';

const MAP: { title: string; bestFor: string; link: DocSectionId }[] = [
  { title: 'Privacy & Threat Model', bestFor: 'What SWIRL protects, what remains visible and where trust remains', link: 'threat-model' },
  { title: 'EVM Overview', bestFor: 'Public and private balances, encrypted notes and network deployments', link: 'evm-overview' },
  { title: 'Wallet & Recovery', bestFor: 'Local encryption, recovery phrases and disaster planning', link: 'evm-wallet' },
  { title: 'Relayer & PPOI', bestFor: 'Submission routes, gas, screening and their trust boundaries', link: 'evm-relayer' },
  { title: 'Bitcoin Overview', bestFor: 'How Bitcoin-specific components fit into the shared product direction', link: 'bitcoin-overview' },
  { title: 'Testing & Verification', bestFor: 'How to reproduce technical checks and evaluate a release', link: 'testing' },
];

export default function OverviewSection({ onNavigate }: { onNavigate: (id: DocSectionId) => void }) {
  return (
    <>
      <SectionTitle>What is SWIRL?</SectionTitle>
      <Paragraph>
        <Strong>SWIRL — Privacy for Bitcoin &amp; EVM.</Strong> SWIRL is non-custodial privacy infrastructure designed to give users a consistent wallet and transaction experience across different blockchain ecosystems.
      </Paragraph>
      <Paragraph>
        SWIRL is not a new blockchain, a custodial account or a requirement to buy a project token. Users keep control of their credentials and approve their own transactions. Each ecosystem uses architecture appropriate to its chain; the shared brand does not imply identical cryptography or identical trust assumptions.
      </Paragraph>

      <SectionDivider />
      <SectionTitle>One protocol direction, two implementations</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 22 }}>
        <div style={{ padding: 18, background: 'var(--cp-bg)', border: '1px solid var(--cp-border)', borderRadius: 6 }}>
          <div style={{ color: 'var(--cp-purple)', fontSize: 10, letterSpacing: 1.5, marginBottom: 10 }}>EVM</div>
          <div style={{ color: 'var(--cp-text)', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Public and private balances</div>
          <div style={{ color: 'var(--cp-text-dim)', fontSize: 11, lineHeight: 1.8 }}>A self-custodial wallet, encrypted notes, zero-knowledge proofs and network-specific contract deployments.</div>
        </div>
        <div style={{ padding: 18, background: 'var(--cp-bg)', border: '1px solid var(--cp-border)', borderRadius: 6 }}>
          <div style={{ color: 'var(--cp-cyan)', fontSize: 10, letterSpacing: 1.5, marginBottom: 10 }}>BITCOIN</div>
          <div style={{ color: 'var(--cp-text)', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Bitcoin-specific privacy</div>
          <div style={{ color: 'var(--cp-text-dim)', fontSize: 11, lineHeight: 1.8 }}>Bitcoin and Lightning components for receiving, settlement and credential-based control, documented separately from EVM.</div>
        </div>
      </div>

      <SectionDivider />
      <SectionTitle>Principles shared across ecosystems</SectionTitle>
      <Paragraph><Strong>Self-custody.</Strong> Users control the secrets required to spend or withdraw. A website interface is not the owner of those secrets.</Paragraph>
      <Paragraph><Strong>Explicit approval.</Strong> Connections, signatures and transactions should be presented for user review, with supported costs and route information visible before submission.</Paragraph>
      <Paragraph><Strong>Honest privacy boundaries.</Strong> Public chain records, network metadata, timing, amounts, endpoint behavior and the available privacy set still matter. SWIRL reduces exposure; it does not promise invisibility.</Paragraph>
      <Paragraph><Strong>Recovery without the website.</Strong> A usable recovery path requires the user&apos;s credentials, compatible software and the relevant chain data or infrastructure. A hosted interface is never a substitute for backups.</Paragraph>

      <SectionDivider />
      <SectionTitle>Read by ecosystem</SectionTitle>
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <tbody>
            {MAP.map((item) => (
              <tr key={item.link} style={{ borderBottom: '1px solid var(--cp-border)', cursor: 'pointer' }} onClick={() => onNavigate(item.link)}>
                <td style={{ padding: '11px 12px', whiteSpace: 'nowrap' }}><span style={{ color: 'var(--cp-cyan)', fontWeight: 600 }}>{item.title}</span></td>
                <td style={{ padding: '11px 12px', color: 'var(--cp-text-dim)' }}>{item.bestFor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Callout type="info">Available networks and features are release-specific. Only use a deployment that is enabled in the official wallet and never send assets to a placeholder or an unverified contract address.</Callout>
    </>
  );
}
