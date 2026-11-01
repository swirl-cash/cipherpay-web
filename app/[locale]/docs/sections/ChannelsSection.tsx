'use client';

import { Callout, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

export default function ChannelsSection() {
  return (
    <>
      <SectionTitle>The graph is the leak</SectionTitle>
      <Paragraph>
        Lightning&apos;s public channel graph is what makes cross-layer analysis possible: it binds a node
        identity to a set of on-chain funding outpoints, permanently. Every SWIRL node therefore runs behind
        <Strong> unannounced channels</Strong> — real channels with real liquidity that never enter the gossip
        store. The network can route to the pool; the graph cannot see the pool.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Ingress and egress are separate populations</SectionTitle>
      <Paragraph>
        Deposits and payouts deliberately travel over different channels, anchored at different nodes.
        An observer clustering ingress traffic learns nothing about egress, and vice versa; the two sets are
        rotated on separate schedules so that long-run observation accumulates infrastructure metadata, not
        user linkage.
      </Paragraph>
      <Paragraph>
        <Strong>Ingress</Strong> — payer-facing blinded path entries. These are pseudonymous by protocol
        (see <em>Silent Receiving</em>) and are regenerated per invoice.
      </Paragraph>
      <Paragraph>
        <Strong>Egress</Strong> — settlement-facing channels with enough inbound liquidity to drain full
        exit queues without rebalancing mid-flight. A payout that stalls for liquidity is not just slow; the stall
        itself is a timing signal. Egress capacity is therefore provisioned above peak queue size, deliberately.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Rotation and decay</SectionTitle>
      <Paragraph>
        Channels age. A channel that has carried thousands of pooled chunks becomes a soft identifier even
        without a name. The operations model treats channels as expendable: open quietly, carry flow, rotate
        out, close cooperatively into swap outputs that feed back into the sterile-settlement path. Nothing in
        the infrastructure layer is allowed to become a long-lived landmark.
      </Paragraph>
      <Callout type="tip">
        Unannounced channels are also why probing is uninformative: an attacker cannot send a fake payment to
        measure a balance on a channel whose existence is not public.
      </Callout>
    </>
  );
}
