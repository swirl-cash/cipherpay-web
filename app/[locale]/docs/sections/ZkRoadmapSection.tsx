'use client';

import { Callout, CodeBlock, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

export default function ZkRoadmapSection() {
  return (
    <>
      <SectionTitle>Why the receipt is not the end state</SectionTitle>
      <Paragraph>
        Today the pool knows one thing it should not need to know: which receipt matches which exit.
        Timing, denominations and blinded paths hide the link from <em>outside</em> observers, but the
        coordinator still settles each exit against a receipt it can see. The fix is to replace
        &ldquo;show the receipt&rdquo; with <Strong>&ldquo;prove you own a receipt&rdquo;</Strong> — a
        zero-knowledge proof. This section is the roadmap: what ships first, what follows the Lightning
        protocol itself, and what waits for research to harden.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Route 1 — Commitments and SNARK exits (core engineering)</SectionTitle>
      <Paragraph>
        Deposits stop issuing a plain receipt and start publishing a <Strong>commitment</Strong> — a hash
        of a secret only you hold. The pool keeps every live commitment in a Merkle tree. The tree is
        public state; your secret never leaves your device.
      </Paragraph>
      <Paragraph>
        At exit you produce a <Strong>Groth16 proof</Strong> that says two things at once: your secret sits
        inside the tree, and its nullifier has never been spent. The proof names neither the secret nor the
        deposit. The pool verifies the proof and pays out through the usual path — uniform denomination,
        random delay, blinded route. What changes is what the pool learns: <em>someone</em> with a valid
        deposit withdrew, and nothing more. Double-spends are still impossible, because the nullifier can
        only appear once.
      </Paragraph>

      <CodeBlock lang="exit" code={`deposit   →  commitment = hash(secret, amount, epoch)   →  into the Merkle tree
exit      →  SNARK proves:  "my secret is in the tree"
                            "my nullifier is fresh"
payout    →  pool verifies proof → standard lane → jitter → blinded path
coordinator learns:  a valid withdrawal happened.  nothing else.`} />

      <Callout type="info">
        The receipt does not disappear — it becomes the commitment. The vault, the backup flow and the
        proof-of-origin export all keep working on top of the same secret.
      </Callout>

      <SectionDivider />

      <SectionTitle>Route 1.5 — Federation and non-custodial locking (before BitVM3)</SectionTitle>
      <Paragraph>
        The zero-knowledge routes make the coordinator <em>blind</em>. This route makes it <em>unable to
        steal</em> — and it does not wait for BitVM. Three moves, all buildable on today&apos;s Lightning:
      </Paragraph>
      <Paragraph>
        <Strong>Anyone can run a coordinator.</Strong> The coordinator ships as open source with a
        one-command deploy. Users pick their coordinator, or spread funds across several running in
        parallel. A single point of failure becomes a reputation market.
      </Paragraph>
      <Paragraph>
        <Strong>Federated rounds keep the anonymity set whole.</Strong> Many coordinators would normally
        split the pool into shallow slices. The counter-design is joint settlement: coordinators merge
        their commitment trees and settle one shared round, so every depositor mixes against the full
        network, not one operator&apos;s slice.
      </Paragraph>
      <Paragraph>
        <Strong>Funds never sit in a hot wallet.</Strong> Entries lock inside Lightning HTLCs — and later
        PTLCs — with a timelocked refund path back to the depositor. The on-chain legs of submarine swaps
        sit in multisig: 2-of-2 with the user, or k-of-n across the federation. The coordinator&apos;s worst
        possible move shrinks from <em>take the funds</em> to <em>refuse to settle</em> — and even then the
        refund path pays the depositor back on its own.
      </Paragraph>
      <Callout type="info">
        This is the trust model until BitVM3 matures: blinded by proofs, boxed in by time locks and
        multisig, replaceable by exit to another coordinator.
      </Callout>

      <SectionDivider />

      <SectionTitle>Route 2 — PTLCs (follows the Lightning protocol)</SectionTitle>
      <Paragraph>
        Today every hop of a Lightning payment carries the same hash lock, so colluding hops can link the
        route. <Strong>PTLCs</Strong> — point time-locked contracts — replace the hash with an elliptic
        curve point that re-blinds at every hop. No two hops see the same lock, and the payment stops being
        traceable through the graph itself.
      </Paragraph>
      <Paragraph>
        This is orthogonal to the pool: Route 1 hides who paid whom inside the pool; PTLCs hide the path
        outside it. The primitive is adaptor signatures, and the work lives upstream in LND and Core
        Lightning. We track both implementations and adopt PTLC channels as they reach stable releases —
        no fork, no custom network.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Route 3 — BitVM3 (long horizon, large lanes)</SectionTitle>
      <Paragraph>
        BitVM lets Bitcoin verify arbitrary computation through fraud proofs instead of trusted operators.
        Applied to the pool, the payout condition becomes objective: <em>release the funds if a valid SNARK
        exists, and let anyone challenge a false claim on-chain.</em> The coordinator stops being trusted
        for settlement at all.
      </Paragraph>
      <Paragraph>
        The first generation worked but was expensive — challenge transactions of several megabytes.
        <Strong>BitVM3</Strong> moves the SNARK verifier into garbled circuits evaluated off-chain. The
        on-chain footprint collapses: an assertion of roughly 56&nbsp;kB and a fraud proof of roughly 200
        bytes — about a thousand times cheaper to enforce than BitVM2. That is what makes trustless
        settlement practical for the large lanes and the cross-chain gateway.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Order of work</SectionTitle>
      <Paragraph>
        Route 1 is active engineering — the commitment tree, the nullifier set and the Groth16 verifier
        are being built and tested on regtest against the same harness that validates the live pool.
        Route 1.5 is the parallel operations track — open-source coordinator, refund paths, multisig
        legs. Route 2 is a watch-and-adopt track pinned to Lightning client releases. Route 3 is the
        long-horizon design track for trustless settlement. Each route strips a different power from the
        coordinator: its sight, its custody, its cover in the network graph, and finally its role in
        settlement itself.
      </Paragraph>
    </>
  );
}
