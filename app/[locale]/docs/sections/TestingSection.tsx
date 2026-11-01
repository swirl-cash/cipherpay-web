'use client';

import { Callout, CodeBlock, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

export default function TestingSection() {
  return (
    <>
      <SectionTitle>Verify the component you actually use</SectionTitle>
      <Paragraph>SWIRL has multiple implementations and deployment targets. A Bitcoin regtest result does not prove an EVM contract is safe, and a wallet UI test does not prove a settlement route is private. Verification must match the network, release and component being evaluated.</Paragraph>

      <SectionDivider />
      <SectionTitle>Wallet build and browser checks</SectionTitle>
      <Paragraph>The extension verification covers the production build, manifest boundaries, wallet creation, local encrypted storage, incorrect-password rejection, locking, reloading and native browser loading. It also checks core wallet navigation and rendering.</Paragraph>
      <CodeBlock lang="terminal" code={`# from the SWIRL protocol workspace
npm run build -w @swirl/extension
npm run verify:extension`} />

      <SectionDivider />
      <SectionTitle>Protocol and contract checks</SectionTitle>
      <Paragraph>The monorepo test command runs the wallet, contract, Relayer, indexer and PPOI test suites. Deployment verification additionally needs the expected chain ID, contract addresses, asset configuration and transaction results for the exact release.</Paragraph>
      <CodeBlock lang="terminal" code={`npm test

# browser-extension package verification
python apps/extension/scripts/package-extension.py`} />

      <SectionDivider />
      <SectionTitle>Bitcoin infrastructure</SectionTitle>
      <Paragraph>Bitcoin-specific components use their own regtest and integration harnesses for Lightning nodes, channels, deposits, settlement and refund behavior. These checks belong to the Bitcoin implementation and should not be presented as evidence for unrelated EVM contracts.</Paragraph>

      <SectionDivider />
      <SectionTitle>What a test does not prove</SectionTitle>
      <Paragraph>Passing tests do not guarantee absolute anonymity, production security or the absence of every implementation defect. They provide reproducible evidence for defined behavior. Mainnet use also requires deployment verification, failure handling, recovery testing and an honest review of remaining trust assumptions.</Paragraph>
      <Callout type="warning">Before relying on a release, test wallet restoration and the complete transaction flow with a small amount. Confirm that the packaged contract and network match the deployment you independently verified.</Callout>
    </>
  );
}
