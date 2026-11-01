'use client';

import { Callout, Code, CodeBlock, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

export default function ReceivingSection() {
  return (
    <>
      <SectionTitle>One code, infinite invoices</SectionTitle>
      <Paragraph>
        A BOLT12 offer is a static, reusable payment request — the Lightning equivalent of a address you can
        publish on a website, a bio, or a billboard. Unlike a BOLT11 invoice it never expires and never has to
        be regenerated per payer. Unlike a Lightning address, it needs <Strong>no server</Strong>: the negotiation
        happens inside the Lightning network itself, over onion-routed messages.
      </Paragraph>
      <Paragraph>
        The exchange is a three-message protocol. The payer sends an <Code>invoice_request</Code> wrapped in a
        Sphinx onion; your node answers with a freshly minted, single-use <Code>invoice</Code>; the payer then
        pays that invoice as normal. Each payer receives a different invoice. Nothing in the offer, the request,
        or the invoice ever contains your node ID.
      </Paragraph>

      <CodeBlock lang="terminal" code={`# Publish a silent offer (runs on your node, keys never leave it)
lightning-cli swirl-offer \\
  --description "swirl silent payment" \\
  --amount any

# → lno1zcpq8pj0xqjqcqp5d3hk…   post it anywhere`} />

      <SectionDivider />

      <SectionTitle>Blinded paths: the last hops are pseudonyms</SectionTitle>
      <Paragraph>
        The route inside every generated invoice terminates in a <Strong>blinded path</Strong>. Your node
        encrypts the final hops so that the payer — and every relay along the way — sees only an entry point and
        a chain of ECDH-derived pseudonymous node IDs. Those pseudonyms are valid for this invoice only; the
        next payer receives a different chain. There is no persistent identifier to accumulate around.
      </Paragraph>
      <Paragraph>
        Because an SWIRL node operates behind <Strong>unannounced channels</Strong> only, Core Lightning attaches
        the blinded path automatically — there is no public channel to point at, so the protocol never points.
        The payer&apos;s view of the network ends at a hop that cannot be resolved into the gossip graph.
      </Paragraph>

      <Callout type="tip">
        Receiving privately is the foundation everything else stands on. If the deposit leg leaks your identity,
        no amount of downstream mixing buys it back — the pool would be shuffling already-named coins.
      </Callout>

      <SectionDivider />

      <SectionTitle>Why not LNURL or Lightning addresses?</SectionTitle>
      <Paragraph>
        LNURL moves the negotiation to HTTPS: a web server now knows your node, your payers, and their IP
        addresses, and can be compelled or subpoenaed. BOLT12 keeps the entire exchange inside the onion-routed
        messaging layer of Lightning itself. There is no server to seize because there is no server.
      </Paragraph>
    </>
  );
}
