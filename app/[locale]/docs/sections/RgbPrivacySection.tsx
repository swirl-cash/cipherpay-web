'use client';

import { Callout, Code, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

export default function RgbPrivacySection() {
  return (
    <>
      <SectionTitle>What RGB hides — and what it cannot</SectionTitle>
      <Paragraph>
        RGB&apos;s privacy is real, and it is frequently oversold. A blockchain observer sees an ordinary
        Bitcoin transaction — with Tapret commitments, indistinguishable from any other Taproot spend. No
        asset ID, no amount, no contract call ever touches the public ledger. Against the chain-analysis
        adversary, this is a genuinely strong posture. But the chain is only one of several places privacy
        leaks, and RGB&apos;s own architecture leaves four of them open.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>1. The counterparty sees everything</SectionTitle>
      <Paragraph>
        Client-side validation means the recipient must receive and verify the <Strong>complete consignment</Strong>:
        the full transfer lineage back to genesis, including every UTXO that ever sealed the asset. RGB&apos;s
        blinding secrets protect you while you hold — you disclose only a hash of your seal when invoicing —
        but the secrets are <em>revealed to the next recipient</em> when you spend. The consequence, stated
        plainly by the protocol&apos;s own authors: privacy is perfect in the present and
        <Strong> degrades monotonically</Strong> as the asset moves. Every future holder learns more of your
        past, until the privacy of your history converges to that of ordinary Bitcoin.
      </Paragraph>

      <SectionTitle>2. The anchor is still a Bitcoin transaction</SectionTitle>
      <Paragraph>
        Every RGB state transition requires spending the seal UTXO on-chain. The commitment hides the asset
        data, but not the transaction itself: its timing, its fee profile, its input clustering, and its
        change outputs are all public metadata. An adversary who knows <em>when</em> an RGB transfer happened —
        because the recipient told them, or because an exchange logged it — can find the anchor and attach the
        transfer to a real wallet cluster.
      </Paragraph>

      <SectionTitle>3. The graph between counterparties is exposed</SectionTitle>
      <Paragraph>
        Consignments travel peer-to-peer. That removes global broadcast, but it creates a different graph:
        sender and recipient must be mutually reachable and must exchange data directly (RGB uses encrypted
        channels via the Storm protocol). Every transfer is a bilateral event in which <Strong>both parties
        learn the other&apos;s involvement and the full history</Strong>. There is no notion of receiving
        assets from an anonymous sender, or paying a merchant without handing them your asset&apos;s lineage.
      </Paragraph>

      <SectionTitle>4. Data availability is the user&apos;s problem</SectionTitle>
      <Paragraph>
        With no global ledger, <em>you</em> are the ledger. Consignment chains grow with every transfer —
        Peter Todd&apos;s 2017 estimate put the cost at roughly 13&nbsp;MB per year per actively moved
        indivisible token — and if your local data is lost without backup, the assets sealed to your UTXOs
        become unverifiable and effectively unrecoverable. RGB v0.12&apos;s streaming consignments cut
        verification memory from megabytes to hundreds of bytes, and zk-compression of history is on the
        horizon — but custody of proof remains the user&apos;s burden today.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Where the frontier is</SectionTitle>
      <Paragraph>
        The research frontier already points at the gap. <Strong>Shielded CSV</Strong> (Nick, Eagen, Linus,
        ePrint 2025/068) replaces history-sharing with proof-carrying data: transactions leak nothing even to
        the recipient, double-spends are prevented by 64-byte nullifiers posted on-chain, and coin proofs stay
        constant-size regardless of history length — at the cost of recursive-STARK machinery that is still
        research-stage. The direction is clear: <Strong>hide the history, not just the ledger</Strong>.
      </Paragraph>

      <Callout type="warning">
        Summary of the gap: RGB removes the global observer, but not the counterparty, not the anchor&apos;s
        metadata, and not the accumulating past. A mixing layer that breaks the lineage <em>between</em> consenting
        holders — before history compounds — is the missing primitive. That is the layer SWIRL builds.
      </Callout>
    </>
  );
}
