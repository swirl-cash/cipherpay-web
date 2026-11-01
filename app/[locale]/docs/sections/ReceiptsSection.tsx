'use client';

import { Callout, CodeBlock, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

export default function ReceiptsSection() {
  return (
    <>
      <SectionTitle>Privacy with a paper trail — yours alone</SectionTitle>
      <Paragraph>
        Every entry into the pool issues a <Strong>receipt</Strong>: a compact credential binding your entry
        commitment, the pool epoch it mixed against, and the terms of your exit authorization. The receipt is the only
        artifact that can ever reconnect the two sides of your mix — and it exists only for you, encrypted,
        never logged server-side.
      </Paragraph>

      <CodeBlock lang="receipt" code={`swirlrc1…
├── entry commitment     hash of your deposit into the pool
├── pool epoch           the live depth your entry mixed against
├── exit attestation     proof your payout left the pool
└── pool signature       the coordinator's attestation over all three`} />

      <SectionDivider />

      <SectionTitle>Proof of origin — selective disclosure</SectionTitle>
      <Paragraph>
        Exchanges, auditors and courts sometimes have a legitimate question: <em>where did these funds come
        from?</em> A receipt answers it without surrendering your privacy to everyone else. Paste the receipt
        into the console&apos;s PROOF OF ORIGIN panel and it produces a cryptographically verifiable report —
        entry transaction, pool membership, exit attestation — exportable as PDF.
      </Paragraph>
      <Paragraph>
        The report proves that <Strong>your</Strong> deposit and <Strong>your</Strong> exit both touched the same live pool.
        It does not, and cannot, reveal which of the pool's depositors you were to anyone who does not already hold
        the receipt. Selective disclosure means you choose the observer; the protocol never does.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>The receipt vault</SectionTitle>
      <Paragraph>
        Lose the receipt and the paper trail is gone forever — which is good for an adversary and bad for you.
        The vault solves this with <Strong>client-side encryption</Strong>: receipts are sealed with
        XChaCha20-Poly1305 under a key phrase generated on your device, and only the ciphertext is backed up to
        distributed storage. The pool stores blobs it cannot read; plaintext exists on your machine and nowhere
        else.
      </Paragraph>
      <Callout type="warning">
        The vault key phrase is unrecoverable by design. If you lose both the device and the phrase, no one —
        including the pool — can reconstruct your receipts. That is not a limitation; it is the guarantee.
      </Callout>
    </>
  );
}
