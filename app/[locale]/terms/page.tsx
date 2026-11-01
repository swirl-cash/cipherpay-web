import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — SWIRL',
  description: 'Terms for using the SWIRL website, wallet and supported privacy infrastructure.',
};

const lastUpdated = 'October 29, 2026';

export default function TermsPage() {
  return (
    <div className="swirl-info-page">
      <SiteHeader />
      <main className="swirl-info-main swirl-legal-main">
        <div className="swirl-info-hero"><div className="swirl-kicker">SWIRL / LEGAL</div><h1>Terms of Service</h1><p>Last updated: {lastUpdated}</p></div>

        <Section id="01" title="Agreement and eligibility">
          <P>These Terms govern your use of the SWIRL website, browser wallet, applications and supported protocol interfaces. By using the software, you agree to these Terms. You must be legally able to enter this agreement and use the software only where doing so is lawful.</P>
        </Section>
        <Section id="02" title="Non-custodial software">
          <P>SWIRL provides non-custodial privacy infrastructure for Bitcoin and EVM. SWIRL is not a bank, exchange, broker, custodian or financial adviser. You control your recovery phrase, keys and transaction approvals. SWIRL cannot recover a lost recovery phrase or reverse a blockchain transaction.</P>
          <P>Available networks and features vary by release. Do not assume that a network shown as coming soon has a deployed or usable contract.</P>
        </Section>
        <Section id="03" title="Your credentials and recovery">
          <P>You are responsible for backing up and protecting your recovery phrase, password, receipt credentials, viewing keys and any other secret needed to access or withdraw assets. Some credentials can reveal sensitive transaction history; share them only when you understand the consequences.</P>
          <P>Loss of the required credentials, device and backups can permanently prevent recovery. SWIRL cannot recreate secrets that were generated or encrypted only on your device.</P>
        </Section>
        <Section id="04" title="Transactions, fees and third parties">
          <P>Transactions may require network fees, protocol fees or Relayer fees. Applicable costs are shown before submission where supported. Quotes can expire, networks can congest and transactions can fail.</P>
          <P>RPC providers, indexers, Relayers, dApps, token issuers, blockchains and external links are independent services. Their availability, conduct and terms are outside our control. A Relayer may submit transactions and pay gas but does not receive your spending keys.</P>
        </Section>
        <Section id="05" title="Privacy boundaries">
          <P>Privacy features do not guarantee absolute anonymity. Public blockchain records, network metadata, timing, amounts, endpoint behavior and the available privacy set can expose information. You are responsible for reviewing every address, network, amount and approval before confirming it.</P>
        </Section>
        <Section id="06" title="Acceptable use">
          <P>Do not use the software to violate applicable law, infringe rights, distribute malware, interfere with networks or services, bypass security controls, or facilitate fraud, theft or other unlawful activity. You are responsible for complying with sanctions, tax and other requirements that apply to you.</P>
        </Section>
        <Section id="07" title="Genesis campaign and vSWIRL">
          <P>The Genesis campaign binds one X account to one seat. vSWIRL is a non-transferable points credential used to calculate campaign allocations; it is not the SWIRL token, a security or a promise of future value. Seats obtained through spam, Sybil clusters or fake engagement may be removed.</P>
        </Section>
        <Section id="08" title="Software risk and no warranty">
          <P>Cryptographic systems, smart contracts, wallet software and third-party infrastructure may contain defects or be attacked. Features and deployments can change as the software develops. The software is provided “as is” and “as available”, without warranties to the maximum extent permitted by law.</P>
        </Section>
        <Section id="09" title="Limitation of liability">
          <P>To the maximum extent permitted by law, SWIRL contributors will not be liable for indirect, incidental, special or consequential losses arising from lost credentials, user error, failed transactions, unavailable services, malicious dApps, market movements or third-party infrastructure.</P>
        </Section>
        <Section id="10" title="Changes">
          <P>Features and these Terms may change as the software develops. Material changes will be posted on this page with an updated date and announced on <a href="https://x.com/swirlbtc" target="_blank" rel="noopener noreferrer">@swirlbtc</a>. Continued use after an update constitutes acceptance of the updated Terms.</P>
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
