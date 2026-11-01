'use client';

import { Callout, CodeBlock, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

export default function GovernanceSection() {
  return (
    <>
      <SectionTitle>SWIRL — one token, one job</SectionTitle>
      <Paragraph>
        SWIRL has a fixed supply of <Strong>21,000,000</Strong>, issued as an RGB-20 asset: client-side validated,
        committed into Taproot outputs, transferable without touching the public ledger beyond a single Bitcoin
        transaction. It exists for exactly one purpose — <Strong>governing the pool</Strong>. It is not a
        payment token, not a staking-yield instrument, and not a claim on pool funds.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Lock to vote</SectionTitle>
      <Paragraph>
        Voting power is locked SWIRL, nothing else. Lock more, weigh more; unlock only after a governance-set
        cooldown, so nobody can vote on a parameter and dump the consequences on those who remain. Delegation is
        first-class: assign your weight to an operator whose judgment you trust, and take it back at any time —
        undelegating is a single transaction, not a process.
      </Paragraph>

      <CodeBlock lang="actions" code={`LOCK          stake SWIRL, gain voting weight
UNLOCK        withdraw after the cooldown
DELEGATE      assign your weight to an operator
UNDELEGATE    take your weight back
CLAIM         collect accrued rewards`} />

      <SectionDivider />

      <SectionTitle>What governance decides</SectionTitle>
      <Paragraph>
        The parameters that define the pool&apos;s privacy and economics are governance-set, not operator-set:
        the denomination fee schedule, the minimum hold time, the introduction of new denomination
        lanes, the cross-chain gateway set, and the treasury split between liquidity incentives, mining rebates
        and reserve. If it changes how the pool behaves, it goes through a vote.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Distribution</SectionTitle>
      <Paragraph>
        The full supply is minted at genesis — there is no inflation, ever. The allocation:
      </Paragraph>

      <CodeBlock lang="allocation" code={`share   amount          destination            unlock
─────   ────────────    ─────────────────────    ──────────────────────────
 5%     1,050,000 SWIRL   early-user airdrop       voucher, redeemable 1 year
10%     2,100,000 SWIRL   anonymity mining         linear over 1 year
55%    11,550,000 SWIRL   DAO treasury             5-yr linear, 3-month cliff
30%     6,300,000 SWIRL   founders & early backers 3-yr linear, 1-year cliff
─────   ────────────
100%   21,000,000 SWIRL   fixed — no more, ever`} />

      <Paragraph>
        The airdrop rewards early pool users by deposit size and age on a logarithmic curve — a big deposit
        earns more, but not proportionally more, so whales and small users both end up with a voice. Mining
        weight converts directly into allocation, so the people who deepen the anonymity set are the people
        who govern it. The treasury is the pool&apos;s long-run budget: liquidity incentives, audits, and
        relayer subsidies, spendable only by locked-SWIRL vote.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Proposals</SectionTitle>
      <Paragraph>
        Creating a proposal requires <Strong>≥ 2,100 SWIRL locked</Strong> — 0.01% of total supply, high enough
        to keep spam off the floor, low enough that any committed participant can reach it. Voting is
        locked-weight; execution is timelocked on-chain, so a passed proposal cannot take effect before
        participants have had the chance to exit the pool if they disagree with it.
      </Paragraph>
      <Callout type="warning">
        SWIRL issuance is planned, not live. Everything in the console&apos;s GOVERNANCE tab is marked SOON and
        describes the specification being built — no SWIRL exists today, and any &quot;SWIRL&quot; trading anywhere
        is not us.
      </Callout>
    </>
  );
}
