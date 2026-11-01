'use client';

import { Callout, SectionDivider, Paragraph, SectionTitle, Strong, Step } from '../components/DocComponents';

export default function EvmOverviewSection() {
  return (
    <>
      <SectionTitle>Privacy within the EVM ecosystem</SectionTitle>
      <Paragraph>
        SWIRL for EVM is <Strong>self-custodial privacy software for existing EVM networks</Strong>. It does not ask users to move to a separate privacy chain or give their spending keys to a service. The wallet derives and stores credentials locally, while network-specific contracts hold the assets represented by private notes.
      </Paragraph>
      <Paragraph>
        The user experience has two sides: a <Strong>public EVM balance</Strong> controlled by the wallet&apos;s ordinary account, and a <Strong>private balance</Strong> represented by encrypted notes. Supported assets and contracts are packaged per network so users do not need to enter RPC endpoints or contract addresses manually.
      </Paragraph>

      <SectionDivider />
      <SectionTitle>The three core actions</SectionTitle>
      <Step n={1} title="Shield"><Paragraph>A public asset is deposited into the applicable on-chain vault. The wallet creates private note material locally and retains the encrypted information needed to recognize and spend it.</Paragraph></Step>
      <Step n={2} title="Private transfer"><Paragraph>The wallet constructs a transaction that spends existing notes and creates new encrypted outputs. A zero-knowledge proof demonstrates that the transaction follows the protocol rules without revealing the spending key.</Paragraph></Step>
      <Step n={3} title="Unshield"><Paragraph>A private note is spent and the asset is released to a public EVM address. Public chain observers can still see the vault interaction and public settlement; the protocol does not erase all network metadata.</Paragraph></Step>

      <SectionDivider />
      <SectionTitle>Shared architecture, network-specific deployments</SectionTitle>
      <Paragraph>Each supported EVM network requires its own verified deployment and asset configuration. A private address format can look consistent across networks, but notes, proofs, contracts and balances always belong to a specific chain. There is no automatic cross-chain transfer between those deployments.</Paragraph>
      <Callout type="info">A consistent wallet experience does not mean one global pool or one contract shared by every chain. Always confirm the selected network before approving a transaction.</Callout>
    </>
  );
}
