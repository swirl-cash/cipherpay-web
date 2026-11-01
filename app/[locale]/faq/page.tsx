import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ — SWIRL',
  description: 'Answers about SWIRL, self-custody, supported ecosystems, privacy boundaries and wallet recovery.',
};

const faqs = [
  { q: 'What is SWIRL?', a: 'SWIRL is non-custodial privacy infrastructure for Bitcoin and EVM. It brings public and private asset experiences into one wallet while keeping users in control of their keys and transaction approvals.' },
  { q: 'Is SWIRL a blockchain or a token?', a: 'No. SWIRL is privacy software and protocol infrastructure that works with existing blockchain ecosystems. You do not need to move to a new chain or buy a SWIRL token to use the wallet.' },
  { q: 'Which ecosystems does SWIRL support?', a: 'SWIRL is being built for Bitcoin and EVM. Available networks and features can differ by release; the wallet only enables networks that have a packaged, usable deployment.' },
  { q: 'Does SWIRL hold my assets or keys?', a: 'No. SWIRL Wallet is self-custodial. Your recovery phrase and spending keys remain under your control, and transactions require your approval. Losing your recovery phrase can mean losing access to your assets.' },
  { q: 'Does using SWIRL make me completely anonymous?', a: 'No privacy system can promise absolute anonymity. Public blockchain records, network metadata, timing, amounts, endpoint behavior and the size of the available privacy set can still reveal information. SWIRL is designed to reduce exposure, not to make impossible guarantees.' },
  { q: 'Do I need an account or identity verification to use the wallet?', a: 'The wallet does not require a SWIRL account, name or email address. You create or import a wallet locally and protect its encrypted data with your own password.' },
  { q: 'What data can network services see?', a: 'RPC endpoints, indexers, Relayers and similar infrastructure may process technical information needed to provide their service, such as IP addresses, chain requests, transaction payloads and timestamps. Public blockchains also maintain public records.' },
  { q: 'How do fees work?', a: 'Network fees and any applicable protocol or Relayer fee depend on the ecosystem and transaction route. Where supported, the wallet presents the relevant cost or quote before you approve a transaction.' },
  { q: 'Can SWIRL recover my wallet if I forget everything?', a: 'No. SWIRL cannot recover a lost recovery phrase or password. Keep an offline backup before using the wallet, and test your recovery process with small amounts first.' },
  { q: 'Where can I read the technical documentation?', a: 'The documentation explains the shared privacy model, EVM wallet architecture, Bitcoin-specific components, Relayers, PPOI, recovery and the current trust boundaries.' },
];

export default function FAQPage() {
  return (
    <div className="swirl-info-page">
      <SiteHeader />
      <main className="swirl-info-main">
        <div className="swirl-info-hero"><div className="swirl-kicker">SWIRL / FAQ</div><h1>Questions, answered.</h1><p>The product, the privacy model and the responsibilities that stay with you.</p></div>
        <div className="swirl-faq-list">
          {faqs.map((item, index) => (
            <details key={item.q} className="swirl-faq-item" open={index === 0}>
              <summary><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.q}</strong><i>+</i></summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
        <div className="swirl-info-cta"><span>Want the technical details?</span><Link href="/docs">Read the documentation →</Link></div>
      </main>
      <SiteFooter />
    </div>
  );
}
