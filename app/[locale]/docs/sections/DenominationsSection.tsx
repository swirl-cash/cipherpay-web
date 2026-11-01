'use client';

import { Callout, Code, CodeBlock, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

export default function DenominationsSection() {
  return (
    <>
      <SectionTitle>Value must stop being a fingerprint</SectionTitle>
      <Paragraph>
        If a payer deposits 0.0187334 BTC and a payout of 0.0187334 BTC leaves the pool forty minutes later, no
        shuffle in the world unlinks them — the amount itself is a unique identifier. The denomination lattice
        exists to destroy that identifier: every payout is <Strong>cut from a fixed set of standard
        quanta</Strong>, so a chunk of a given size is indistinguishable from every other chunk of that size,
        across the whole pool, forever.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>The lattice</SectionTitle>
      <Paragraph>
        Payouts decompose into four fixed quanta — 0.001 / 0.01 / 0.1 / 1 BTC.
        A payout of 0.111 BTC does not leave as 0.111; it leaves as
        0.1 + 0.01 + 0.001, three chunks that each look exactly like everyone else&apos;s chunks of the
        same size.
      </Paragraph>

      <CodeBlock lang="decomposition" code={`payout:  0.111 BTC
lattice:  { 0.001, 0.01, 0.1, 1 }

cut:      0.1    ┐
         +0.01   ├─ 3 chunks, each a member of the
         +0.001  ┘  global anonymity set for its tier

residual: handled per policy — carried back into
          the pool as a fresh deposit, never paid as-is`} />

      <Paragraph>
        The residual — the sub-quantum remainder that cannot be expressed in lattice terms — is never released
        as itself. Releasing it would re-introduce a unique amount. Instead it is carried forward and re-enters
        the pool as a new deposit, where it merges with other residuals and deposits before
        being cut again.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Why uniform denominations are load-bearing</SectionTitle>
      <Paragraph>
        Classic Bitcoin mixers died by subset-sum: with unique input and output amounts, an analyst can solve
        for the subset of outputs that sums to each input. Uniform denominations make that problem
        underdetermined by construction — with <em>n</em> identical chunks per tier, the number of valid
        assignments grows combinatorially, and the analyst&apos;s posterior collapses to the uniform prior.
      </Paragraph>
      <Callout type="warning">
        This is also why you should not treat &quot;one deposit in, one payout out&quot; tooling as mixing.
        Without a denomination lattice there is no ambiguity to hide in; the shuffle is cosmetic.
      </Callout>

      <SectionDivider />

      <SectionTitle>Enforced, not advised</SectionTitle>
      <Paragraph>
        The lattice is not a recommendation you can ignore. Deposits are accepted in lattice quanta only —
        anything else is rejected at the API before it ever reaches a channel. This and the rest of the
        behavioral rules the protocol enforces on your behalf are documented under <Strong>Usage
        Discipline</Strong>.
      </Paragraph>
    </>
  );
}
