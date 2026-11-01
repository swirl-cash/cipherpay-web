'use client';

import { Callout, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

export default function EvmWalletSection() {
  return (
    <>
      <SectionTitle>Create, import and unlock</SectionTitle>
      <Paragraph>SWIRL Wallet can create a new recovery phrase or import an existing compatible phrase. The wallet encrypts the phrase locally using the password chosen by the user. Unlocking decrypts it in the local wallet session; the password itself is not stored.</Paragraph>
      <Paragraph>The wallet stores its encrypted record and settings in the browser profile. It does not require a SWIRL account, email address or hosted wallet account. Locking the wallet removes unlocked key material from the wallet page.</Paragraph>
      <Callout type="warning">Keep an offline copy of the recovery phrase before using the wallet. SWIRL cannot recover a forgotten password or reconstruct a lost phrase.</Callout>

      <SectionDivider />
      <SectionTitle>Public and private balances</SectionTitle>
      <Paragraph>The portfolio separates <Strong>public assets</Strong> from <Strong>private assets</Strong>. Public balances are read through the selected network&apos;s RPC endpoint. Private balances are calculated from unspent encrypted notes that the wallet can decrypt and prove ownership of.</Paragraph>
      <Paragraph>Asset prices are estimates and can be unavailable without changing the underlying balance. A synchronization error should not be interpreted as a loss of funds; the vault and note history remain on their respective systems.</Paragraph>

      <SectionDivider />
      <SectionTitle>Recovery and disaster planning</SectionTitle>
      <Paragraph>Recovery requires more than a login. A user needs the recovery phrase, access to compatible wallet software, the correct network deployment and enough chain or indexer data to reconstruct note ownership. Direct chain recovery is preferred when available; an unavailable website must not be treated as a backup.</Paragraph>
      <Paragraph>Before relying on significant balances, test wallet restoration with a small amount. Keep the recovery phrase offline and retain the official extension package or another independently verifiable way to run the recovery code.</Paragraph>

      <SectionDivider />
      <SectionTitle>Network availability</SectionTitle>
      <Paragraph>Only packaged and usable deployments should be enabled for transactions. Networks shown as coming soon are not an instruction to send funds to a placeholder address. Contract and token configuration belong in the release, not in manual user input.</Paragraph>
    </>
  );
}
