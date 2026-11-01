'use client';

import { Callout, CodeBlock, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

export default function DisciplineSection() {
  return (
    <>
      <SectionTitle>Discipline is a protocol rule, not advice</SectionTitle>
      <Paragraph>
        The hardest lesson from a decade of on-chain mixing: the cryptography held, the users didn&apos;t.
        Deposits withdrawn ten minutes later, unique amounts, the same address on both sides of the pool —
        every well-known deanonymization was a behavioral failure, not a mathematical one. SWIRL therefore
        moves discipline out of the README and into the protocol: the rules below are enforced by the pool
        itself, and there is no way to opt out of them.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Fixed denominations at entry</SectionTitle>
      <Paragraph>
        Deposits are accepted in lattice quanta only — 0.001 / 0.01 / 0.1 / 1 BTC.
        A deposit of 0.0187334 BTC is not rounded, it is <Strong>rejected</Strong>: a unique amount is a
        unique fingerprint, and the pool refuses to carry it. Larger positions enter as multiple quanta —
        0.111 BTC arrives as 0.1 + 0.01 + 0.001, three chunks indistinguishable from everyone
        else&apos;s.
      </Paragraph>

      <CodeBlock lang="api" code={`POST /v1/mix/deposit
{ "amount": 1873340 }

→ 422 lattice_violation
{
  "error":    "amount_not_on_lattice",
  "accepted": [100000, 1000000, 10000000, 100000000],
  "hint":     "enter as multiple quanta — e.g. 10000000 + 1000000 + ..."
}`} />

      <SectionDivider />

      <SectionTitle>Minimum hold, randomized release</SectionTitle>
      <Paragraph>
        No payout settles before a <Strong>60-minute minimum hold</Strong>, and the actual release adds a
        random jitter of up to 15 minutes on top, independently per chunk. Δt matching — the correlation of
        entry and exit timestamps — dies here. Users in a hurry are the analyst&apos;s best friend, so the
        pool simply does not let you be one.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Single-use exit offers</SectionTitle>
      <Paragraph>
        Every exit requires a <Strong>fresh BOLT12 offer</Strong>; the pool refuses any offer it has seen
        before. Address reuse is the classic self-dox in mixing history — here it returns a 409, not a
        warning.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>The network layer</SectionTitle>
      <Paragraph>
        The mixing interface is reachable over Tor. Mixing over clearnet links your IP to your entry timing —
        half the puzzle handed to the observer before the first sat moves.
      </Paragraph>

      <Callout type="warning">
        Discipline raises the floor, not the ceiling. The ceiling is the anonymity set: five participants
        means five suspects, and no rule changes that. These constraints make sure you never subtract from
        your own privacy — only other users can add to it. See the Threat Model for the full boundary.
      </Callout>
    </>
  );
}
