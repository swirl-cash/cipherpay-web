'use client';

import { Callout, CodeBlock, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

export default function FeesSection() {
  return (
    <>
      <SectionTitle>The fee is part of the privacy, not an add-on</SectionTitle>
      <Paragraph>
        The mix fee is deducted <Strong>inside the pool</Strong>, before payouts are cut — and it is always
        denominated in the asset being mixed: sats in the BTC lane, USDT in the asset lane once it opens.
        Routing cost, per-exit
        jitter and the blinded-path settlement are priced into it — there is no separate network fee at the exit,
        so the amount that leaves the pool is exactly a lattice quantum, never a quantum minus a surprise.
        A fee collected outside the pool would reintroduce unique amounts; a fee collected inside it leaves no
        trace on the payout at all.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Fee bound in the payout authorization</SectionTitle>
      <Paragraph>
        When a participant authorizes a payout, the fee rate and the destination offer are signed
        <Strong> together</Strong>. The coordinator cannot raise the fee after the fact without invalidating the
        authorization, and a relay cannot skim by substituting a cheaper-looking payout. What you signed is what
        settles, or nothing settles.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>The schedule, and why small lanes are subsidized</SectionTitle>

      <Paragraph>
        Reading the table: <Strong>50 bps = 0.50%</Strong>. Mix 0.01 BTC and the pool keeps 0.00005 BTC before
        payouts are cut — that is the entire cost, routing and exit included.
      </Paragraph>

      <CodeBlock lang="schedule" code={`lane          at launch           target
────────────    ──────────────────    ──────────────────────
  1 BTC       50 bps · 0.50%        50 bps · 0.50%
  0.1 BTC     50 bps · 0.50%        40 bps · 0.40%
  0.01 BTC    50 bps · 0.50%        25 bps · 0.25%
  0.001 BTC   50 bps · 0.50%         0 bps · free`} />

      <Paragraph>
        Anonymity is a shared good: a deep 0.001-BTC lane makes the 0.01 lane above it uninteresting to an analyst,
        because every large payout dissolves into the same small quanta. The target schedule therefore prices the
        smallest lane at zero — the pool subsidizes the density it hides behind. Discounts activate per lane by
        governance vote, not by operator discretion.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Where the fee goes</SectionTitle>
      <Paragraph>
        Collected fees accrue to the pool treasury: liquidity incentives for entry and exit operators first,
        anonymity-mining rebate funding second, and a governance-controlled reserve last. The split is a
        governance parameter and is expected to be one of the first proposals voted on once SWIRL locking opens.
      </Paragraph>
      <Callout type="info">
        Fee rebates are never claimed by asking — they are earned by holding a commitment inside the pool. See
        <em> Anonymity Mining</em>.
      </Callout>
    </>
  );
}
