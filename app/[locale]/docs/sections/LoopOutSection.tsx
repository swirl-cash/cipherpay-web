'use client';

import { Callout, Code, CodeBlock, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

export default function LoopOutSection() {
  return (
    <>
      <SectionTitle>Leaving the network without a forwarding address</SectionTitle>
      <Paragraph>
        Everything up to this point hides a payment <em>inside</em> Lightning. But eventually value usually
        wants to rest on layer 1 — and the naive way to get there, closing a channel, is a confession: the
        closing transaction names the channel, the channel names the funding outpoint, and the funding outpoint
        names you. The submarine swap exists so that this last step inherits nothing.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Hashlock atomicity</SectionTitle>
      <Paragraph>
        A submarine swap trades a Lightning payment for an on-chain output through a single shared
        <Strong> preimage hash</Strong>. Your node pays an HTLC off-chain that is locked to hash <Code>H</Code>;
        the swap provider pays an on-chain output locked to the same <Code>H</Code>. Whoever reveals the preimage
        claims the on-chain funds, and that same preimage settles the off-chain HTLC. Either both legs execute
        or neither does — the construction is atomic, so neither side can be robbed mid-swap.
      </Paragraph>

      <CodeBlock lang="swap" code={`off-chain:   you ──HTLC(H)──▶ swap provider      (Lightning)
on-chain:    swap provider ──HTLC(H)──▶ fresh address  (Bitcoin)

claim:       preimage R revealed on-chain
             → settles the Lightning leg automatically

abort:       either leg expires unclaimed
             → both legs unwind, no funds move`} />

      <Paragraph>
        The output address is fresh, derived for this swap alone, and its only on-chain relationship is to the
        swap provider — a public utility whose outputs touch thousands of unrelated users. The chain sees
        <Strong> in ≠ out</Strong> as a structural fact, not as an obfuscation claim.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Current status</SectionTitle>
      <Paragraph>
        Loop-out ships behind <Code>swirl-loopout-enabled</Code> (default off) while the provider-integration
        surface is hardened against fee-griefing and probe attacks. When disabled, exits settle over Lightning
        only, and the on-chain confession simply never happens.
      </Paragraph>
      <Callout type="warning">
        A swap is atomic, not anonymous by itself: using one provider, at one fee tier, at predictable times
        re-introduces metadata. Loop-out composes with the deep pool, denominations, and jitter — it does not
        replace them.
      </Callout>
    </>
  );
}
