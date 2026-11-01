'use client';

import { Callout, Code, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

const COMPARE: { prop: string; onchain: string; rgb: string }[] = [
  { prop: 'Who validates', onchain: 'Every full node validates every transaction', rgb: 'Only the recipient validates their own receipt' },
  { prop: 'On-chain data', onchain: 'Full transaction data and contract state', rgb: 'A single hash commitment per transfer' },
  { prop: 'Privacy', onchain: 'All transfers publicly visible', rgb: 'Transfer data known only to the parties involved' },
  { prop: 'Scaling', onchain: 'Vertical — every node processes everything', rgb: 'Horizontal — each contract is its own shard' },
  { prop: 'Consensus changes', onchain: 'New features need network upgrades', rgb: 'None — Bitcoin is used as-is' },
];

export default function CsvRgbSection() {
  return (
    <>
      <SectionTitle>Validation without a global ledger</SectionTitle>
      <Paragraph>
        Client-side validation (CSV) is the paradigm Peter Todd articulated at Scaling Bitcoin Milan in 2016:
        if every full node already re-validates everything, the network is paying for massive redundancy.
        CSV removes that redundancy — the blockchain keeps only the two jobs that genuinely require global
        consensus (<Strong>timestamping and double-spend prevention</Strong>), while all contract logic and
        state validation move off-chain, to the clients that actually hold the asset. Only a compact
        cryptographic commitment is ever written on-chain; the full state transition travels peer-to-peer
        between sender and recipient.
      </Paragraph>
      <Paragraph>
        The cryptographic foundation is the <Strong>single-use seal</Strong>: a primitive that can be closed
        over a message exactly once. Bitcoin UTXOs are natural single-use seals — globally unique, and
        spendable exactly once by consensus rule. Binding asset state to a UTXO means spending that UTXO
        commits you to one and only one state transition. Bitcoin enforces uniqueness without understanding
        anything about the asset; the asset protocol enforces validity without touching the blockchain.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>How an RGB transfer actually works</SectionTitle>
      <Paragraph>
        RGB — designed by Giacomo Zucco and Peter Todd, developed by Maxim Orlovsky and the LNP/BP Standards
        Association, live on Bitcoin mainnet since July 2025 — is the most complete CSV implementation.
        A transfer has three moving parts:
      </Paragraph>
      <Paragraph>
        <Strong>1. The state transition.</Strong> Constructed off-chain, it declares which sealed UTXOs are
        being opened, which new seals the assets move to, the asset ID, amounts, and any additional spending
        conditions. Contracts are instances of <Strong>schemas</Strong> — RGB-20 for fungible assets, RGB-21
        for collectibles — executed on <Strong>AluVM</Strong>, a register-based deterministic VM (redesigned in
        v0.12 as zk-AluVM with 40 instructions, enabling zero-knowledge proofs of contract execution).
      </Paragraph>
      <Paragraph>
        <Strong>2. The anchor.</Strong> A Bitcoin transaction spends the seal UTXO and embeds a commitment to
        the transition — either as an unspendable Taproot script leaf (<Code>Tapret</Code>, leaving no visible
        footprint beyond a normal Taproot spend) or in an OP_RETURN output (<Code>Opret</Code>).
      </Paragraph>
      <Paragraph>
        <Strong>3. The consignment.</Strong> The full transition data plus the chain of prior transitions back
        to genesis is delivered to the recipient over an encrypted peer-to-peer channel. The recipient
        validates the entire lineage — issuance, every transfer, every commitment against the chain — before
        accepting the payment. No miner, no node, no third party ever sees this data.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>RGB versus on-chain validation</SectionTitle>
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--cp-border)' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--cp-text-muted)', fontWeight: 600, fontSize: 10, letterSpacing: 0.5 }}>PROPERTY</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--cp-text-muted)', fontWeight: 600, fontSize: 10, letterSpacing: 0.5 }}>ON-CHAIN (ETHEREUM MODEL)</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--cp-text-muted)', fontWeight: 600, fontSize: 10, letterSpacing: 0.5 }}>CLIENT-SIDE (RGB)</th>
            </tr>
          </thead>
          <tbody>
            {COMPARE.map(r => (
              <tr key={r.prop} style={{ borderBottom: '1px solid var(--cp-border)' }}>
                <td style={{ padding: '10px 12px', color: 'var(--cp-text)', fontWeight: 600, whiteSpace: 'nowrap' }}>{r.prop}</td>
                <td style={{ padding: '10px 12px', color: 'var(--cp-text-dim)' }}>{r.onchain}</td>
                <td style={{ padding: '10px 12px', color: 'var(--cp-text-dim)' }}>{r.rgb}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paragraph>
        The structural insight: in RGB each contract is an independent shard (a <em>Partially Replicated State
        Machine</em>), validated only by its participants. A million contracts can coexist without any single
        node processing all of them. And because RGB assets can be assigned to channel-level commitments, the
        same model extends onto the Lightning Network — assets moving inside payment channels, settling at
        Lightning speed, anchored to Bitcoin only when channels open or close.
      </Paragraph>

      <Callout type="info">
        The design space is moving fast: Taproot Assets (Lightning Labs) ships a narrower asset-focused CSV
        with live Lightning integration and USDT issuance; Shielded CSV (Nick, Eagen, Linus — ePrint
        2025/068) pushes the paradigm to full privacy with nullifiers and recursive proofs. The next two
        sections map where vanilla RGB&apos;s privacy ends — and where SWIRL begins.
      </Callout>
    </>
  );
}
