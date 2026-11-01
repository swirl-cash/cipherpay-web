import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — SWIRL',
  description: 'How SWIRL handles local wallet data, network requests and Genesis campaign data.',
};

const lastUpdated = 'October 29, 2026';

export default function PrivacyPage() {
  return (
    <div className="swirl-info-page">
      <SiteHeader />
      <main className="swirl-info-main swirl-legal-main">
        <div className="swirl-info-hero"><div className="swirl-kicker">SWIRL / LEGAL</div><h1>Privacy Policy</h1><p>Last updated: {lastUpdated}</p></div>

        <Section id="01" title="Scope">
          <P>This policy covers the SWIRL website, SWIRL Wallet, supported Bitcoin and EVM interfaces, and the Genesis campaign. These components process different kinds of data; using a public blockchain is never the same as storing a wallet locally.</P>
        </Section>
        <Section id="02" title="Information stored on your device">
          <P>SWIRL Wallet does not require a name, email address or SWIRL account. Your recovery phrase is encrypted locally with your password. Wallet settings, activity labels and wallet state are stored in your browser profile. Passwords are not stored by the wallet.</P>
          <P>Your recovery phrase and spending keys are not sent to SWIRL. Anyone with access to your browser profile, device or recovery phrase may be able to access your wallet, so protect your device and keep an offline backup.</P>
        </Section>
        <Section id="03" title="Network and blockchain data">
          <P>When you synchronize balances or submit transactions, the wallet sends necessary requests to the configured RPC endpoint and may contact an indexer, Relayer, proof-of-innocence service or other protocol infrastructure. These services can observe technical data such as IP address, requested chain or contract, public account queries, transaction payloads and timestamps.</P>
          <P>Blockchain transactions, public addresses, token amounts and contract events may be publicly visible and permanent. Encryption and zero-knowledge proofs protect specific data; they do not erase all public metadata or guarantee anonymity.</P>
        </Section>
        <Section id="04" title="Bitcoin-specific credentials and infrastructure">
          <P>Bitcoin-facing features may use local receipt or wallet credentials and may contact Lightning, settlement or indexing infrastructure to complete a user-requested action. The exact observer depends on the selected route. Keep any credential that controls a withdrawal as carefully as a private key.</P>
        </Section>
        <Section id="05" title="Relayers, dApps and external services">
          <P>A Relayer can receive the proof and encrypted outputs needed to submit a private transaction, plus any fee material required by its quote. It does not receive your recovery phrase or spending key, but it may observe submission metadata or decline a request.</P>
          <P>When you connect to a dApp, you approve the account and actions shared with that site. RPC providers, price services, dApps, token issuers, blockchains and external websites have their own privacy practices.</P>
        </Section>
        <Section id="06" title="Genesis campaign data">
          <P>When you authorize X for Genesis, we receive your X user ID, handle, display name and avatar. Access is read-only: we do not post, follow, like or message on your behalf. The campaign also stores your invite code, referral chain, task completions and vSWIRL points, together with links you submit for manual review.</P>
          <P>A session cookie keeps you signed in. Genesis does not require you to submit a wallet address. X and any external form provider process data under their own privacy policies.</P>
        </Section>
        <Section id="07" title="Your choices and retention">
          <P>You can lock the wallet, disconnect dApps, hide supported networks, choose direct submission where available, clear local browser storage or remove the extension. Removing local data may delete the only encrypted wallet copy, so back up your recovery phrase first.</P>
          <P>Local wallet data remains on your device until you delete it. Data sent to blockchains or independent infrastructure is governed by those systems and may not be deletable. Operational logs, if any, should be limited to what is needed for security and reliability.</P>
        </Section>
        <Section id="08" title="Changes and contact">
          <P>Material changes to this policy will be posted on this page with an updated date and announced on <a href="https://x.com/swirlbtc" target="_blank" rel="noopener noreferrer">@swirlbtc</a>.</P>
        </Section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return <section className="swirl-legal-section"><div className="swirl-legal-section-title"><span>{id}</span><h2>{title}</h2></div><div>{children}</div></section>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="swirl-legal-paragraph">{children}</p>;
}
