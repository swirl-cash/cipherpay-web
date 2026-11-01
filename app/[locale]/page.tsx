import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Link } from '@/i18n/navigation';

function Arrow({ direction = 'right' }: { direction?: 'right' | 'down' }) {
  return (
    <svg className={`swirl-arrow swirl-arrow--${direction}`} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const principles = [
  { number: '01', title: 'Your keys stay yours', text: 'Non-custodial by design. You control your wallet, your approvals and your assets.' },
  { number: '02', title: 'Privacy at the protocol level', text: 'Privacy is part of the transaction experience, not an extra step you need to figure out.' },
  { number: '03', title: 'Open infrastructure', text: 'Public code, documented architecture and a wallet experience that can grow across ecosystems.' },
];

export default function LandingPage() {
  return (
    <div className="swirl-home">
      <SiteHeader />

      <main>
        <div className="swirl-genesis-strip">
          <Link href="/genesis" className="swirl-container swirl-genesis-link">
            <span className="swirl-genesis-badge">SWIRL GENESIS</span>
            <span className="swirl-genesis-copy">The early community campaign is live.</span>
            <span className="swirl-genesis-action">Join the campaign <Arrow /></span>
          </Link>
        </div>
        <section className="swirl-hero">
          <div className="swirl-hero-orbit" aria-hidden="true"><i /><i /><i /></div>
          <div className="swirl-container swirl-hero-grid">
            <div className="swirl-hero-copy">
              <div className="swirl-eyebrow"><span /> PRIVACY FOR BITCOIN &amp; EVM</div>
              <h1>SWIRL — Privacy for<br /><em>Bitcoin &amp; EVM</em></h1>
              <p>SWIRL is non-custodial privacy infrastructure for Bitcoin and EVM. One wallet experience, user-held keys, and privacy built into the way you transact.</p>
              <div className="swirl-hero-actions">
                <Link href="/dapp" className="swirl-button swirl-button--primary">Open SWIRL <Arrow /></Link>
                <Link href="/docs" className="swirl-button swirl-button--secondary">Explore the protocol <Arrow /></Link>
              </div>
              <div className="swirl-hero-proof swirl-chain-proof" aria-label="Bitcoin, Ethereum, BNB Smart Chain, Arbitrum and Polygon">
                <span>CHAINS</span><strong>Bitcoin</strong><strong>Ethereum</strong><strong>BNB Smart Chain</strong><strong>Arbitrum</strong><strong>Polygon</strong>
              </div>
            </div>

            <div className="swirl-protocol-visual swirl-protocol-visual--animated">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/swirl-protocol-animated.gif" alt="SWIRL private transaction flow connecting Bitcoin and EVM" />
            </div>
          </div>
        </section>

        <section className="swirl-section swirl-networks" id="protocol">
          <div className="swirl-container">
            <div className="swirl-section-heading">
              <div><div className="swirl-kicker">INSIDE SWIRL · ZERO-KNOWLEDGE</div><h2>Private by math.<br />Clean by proof.</h2></div>
              <p>SWIRL hides the link between sender and receiver with zero-knowledge proofs, and proves your funds are clean with Private Proof of Innocence. Both proofs are generated on your own device — nothing to trust, everything to verify.</p>
            </div>
            <div className="swirl-principle-grid">
              <article className="swirl-principle-card">
                <span>01</span>
                <h3>Shield</h3>
                <p>Deposit public assets into the SWIRL vault. Your wallet creates a private note locally — observers see a deposit, never your private balance.</p>
              </article>
              <article className="swirl-principle-card">
                <span>02</span>
                <h3>Transact privately</h3>
                <p>Send any amount you choose — no fixed denominations. A Groth16 zero-knowledge proof, generated in your browser, authorizes the transfer without revealing sender, receiver or amount.</p>
              </article>
              <article className="swirl-principle-card">
                <span>03</span>
                <h3>Unshield</h3>
                <p>Spend your private note to any public address. The vault releases the assets; your private history stays hidden.</p>
              </article>
            </div>
          </div>
        </section>

        <section className="swirl-section swirl-boundary">
          <div className="swirl-container swirl-boundary-grid">
            <div><div className="swirl-kicker">PRIVATE PROOF OF INNOCENCE</div><h2>Prove it is clean.<br />Reveal nothing.</h2></div>
            <div>
              <p>Every deposit is screened against public sanctions and high-risk lists. Your wallet then produces a zero-knowledge proof that your funds are unlinked from those sources — verified by the network, with no identity, no history and nothing extra exposed. Bad actors stay out of the pool; honest users keep their privacy.</p>
              <Link href="/docs">Read the PPOI docs <Arrow /></Link>
            </div>
          </div>
        </section>

        <section className="swirl-section swirl-wallet-section">
          <div className="swirl-container swirl-wallet-grid">
            <div className="swirl-wallet-copy">
              <div className="swirl-kicker">SWIRL WALLET</div>
              <h2>Your privacy.<br /><em>One wallet.</em></h2>
              <p>A focused wallet experience for public and private assets. Create or import a wallet, approve every action, and keep your recovery phrase on your own device.</p>
              <ul>
                <li><span>✓</span><div><strong>Self-custodial by default</strong><small>Your encrypted wallet stays in your browser.</small></div></li>
                <li><span>✓</span><div><strong>Clear transaction control</strong><small>Review connections, signatures and transfers before approval.</small></div></li>
                <li><span>✓</span><div><strong>Built for more than one ecosystem</strong><small>A single product direction across Bitcoin and EVM.</small></div></li>
              </ul>
              <Link href="/extension" className="swirl-button swirl-button--primary">Download the privacy wallet <Arrow /></Link>
            </div>
            <div className="swirl-wallet-stage">
              <div className="swirl-wallet-glow" aria-hidden="true" />
              <div className="swirl-wallet-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/swirl-wallet-preview.png" alt="SWIRL Wallet showing public and private asset balances on Ethereum" />
              </div>
              <div className="swirl-wallet-note swirl-wallet-note--top"><i /> USER-HELD KEYS</div>
              <div className="swirl-wallet-note swirl-wallet-note--bottom">PUBLIC + PRIVATE<span>ONE OVERVIEW</span></div>
            </div>
          </div>
        </section>

        <section className="swirl-section swirl-principles">
          <div className="swirl-container">
            <div className="swirl-centered-heading"><div className="swirl-kicker">BUILT DIFFERENTLY</div><h2>Less trust. More control.</h2><p>The product is simple because the principles are not negotiable.</p></div>
            <div className="swirl-principle-grid">
              {principles.map((item) => <article key={item.number} className="swirl-principle-card"><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="swirl-section swirl-boundary">
          <div className="swirl-container swirl-boundary-grid">
            <div><div className="swirl-kicker">PRIVACY BY DESIGN</div><h2>Privacy.<br />Not empty promises.</h2></div>
            <div><p>SWIRL is built to protect your financial privacy while keeping you in control. With self-custody, open-source infrastructure and privacy-preserving transactions, your assets and your choices stay in your hands.</p><Link href="/docs/threat-model">Explore the privacy model <Arrow /></Link></div>
          </div>
        </section>

        <section className="swirl-final-cta">
          <div className="swirl-final-orbit" aria-hidden="true" />
          <div className="swirl-container"><div className="swirl-kicker">SWIRL — PRIVACY FOR BITCOIN &amp; EVM</div><h2>Your chain.<br /><em>Your business.</em></h2><p>Open the wallet and choose where you want to begin.</p><Link href="/dapp" className="swirl-button swirl-button--primary">Enter SWIRL <Arrow /></Link></div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
