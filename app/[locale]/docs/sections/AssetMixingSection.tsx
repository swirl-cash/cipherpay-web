'use client';

import { Callout, Code, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

export default function AssetMixingSection() {
  return (
    <>
      <SectionTitle>The problem we solve</SectionTitle>
      <Paragraph>
        Vanilla Lightning leaks identity at the invoice and topology layers. Vanilla RGB hides transfer data
        from the chain but hands the full asset lineage to every counterparty, and lets that lineage accumulate
        forever. Neither gives you a way to <Strong>break history</Strong> — to take an asset with a past and
        receive an asset without one. That is the primitive SWIRL adds, first for plain sats (live in the
        regtest harness today), and by design for RGB-20 assets over Lightning (the rail described here).
      </Paragraph>

      <SectionDivider />

      <SectionTitle>How the sat rail works today</SectionTitle>
      <Paragraph>
        The Lightning engine already implements the full mixing stack for sats: silent receiving over blinded
        BOLT12 paths, a continuously deepening anonymity pool with minimum-hold gating, denomination-lattice payouts, and
        delay-queued release schedules. The anonymity guarantee comes from structure, not promises: any live
        deposit in the pool could be the source of any chunk, and the transcript an observer can assemble
        contains no signal to rank them.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Extending the pool to RGB assets</SectionTitle>
      <Paragraph>
        The first asset lane beyond sats is <Strong>USDT</Strong>, carried over Lightning as a Taproot Asset
        and settled at the pool boundary with RGB consignments. The console already exposes the asset selector
        (BTC live in the harness, USDT marked SOON); the mechanics below are what switches it on.
      </Paragraph>
      <Paragraph>
        RGB over Lightning moves assets inside channel-level commitments, so the pool can operate on
        RGB-20 balances with the same mechanics as sats — but with an additional, deeper effect. When
        participants deposit an asset into a pool and withdraw <em>different state transitions</em>, the
        consignment lineage is severed at the pool boundary:
      </Paragraph>
      <Paragraph>
        <Strong>History truncation.</Strong> What you withdraw carries the pool&apos;s transition as its parent,
        not yours. The counterparty problem — every future holder learning your past — stops compounding at
        the pool. Your pre-pool history is no longer part of the asset you hold.
      </Paragraph>
      <Paragraph>
        <Strong>Seal anonymity.</Strong> Withdrawal seals are defined to fresh, blinded UTXOs. Even the pool
        coordinator does not learn which seal a given exit closes over — the same property the sat rail gets
        from blinded paths, applied one layer down at the UTXO.
      </Paragraph>
      <Paragraph>
        <Strong>Denomination alignment.</Strong> Asset amounts are quantized onto the same lattice discipline
        as sat payouts, so value remains a non-identifier at the asset layer too. A 1,000-unit transfer of a
        pooled RGB-20 asset looks like every other 1,000-unit chunk in the pool's whole history.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Why a pool instead of atomic swaps</SectionTitle>
      <Paragraph>
        KaleidoSwap demonstrated RGB atomic swaps on Lightning mainnet in September 2025 — trustless, but
        bilateral: a swap changes <em>what</em> you hold, not <em>who can trace it</em>. The lineage still runs
        payer→provider→payee with each hop visible to its counterparties. A deep anonymity pool is the stronger
        primitive for privacy precisely because it is many-to-many: the mapping from entries to exits is a
        uniform permutation, not a chain.
      </Paragraph>
      <Paragraph>
        The two compose. Swap-based ingress/egress lets a participant enter the pool holding one asset and
        leave holding another, adding value-type to the list of things that no longer correlate across the
        pool boundary.
      </Paragraph>

      <Callout type="warning">
        Status, stated honestly: the sat rail is implemented and covered by the end-to-end regtest suite. The
        RGB rail is a designed extension — the mixing engine, denomination logic, and timing layers carry over
        unchanged; the RGB-specific work is consignment management and seal handling at the pool boundary.
        It ships alongside mainnet parameters, and the console&apos;s asset selector will switch from SOON to
        live when it does.
      </Callout>
    </>
  );
}
