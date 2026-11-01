import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { Link } from '@/i18n/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SWIRL Wallet Extension — Privacy for your browser',
  description:
    'Install the SWIRL Wallet browser extension: a decentralized, self-custodial wallet for public and private balances. Private transfers of any amount, on Chrome, Brave and Edge.',
};

const CHROME_WEB_STORE_URL = 'https://chromewebstore.google.com/detail/swirl-wallet/eoclknfckmkgmodianenlaeikmghmmeg';

function Arrow({ direction = 'right' }: { direction?: 'right' | 'down' }) {
  return (
    <svg className={`swirl-arrow swirl-arrow--${direction}`} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const features = [
  {
    number: '01',
    title: 'Decentralized by design',
    text: 'No accounts, no sign-ups, no custodial servers holding your funds. Your keys are encrypted in your own browser, and every transaction settles on-chain.',
  },
  {
    number: '02',
    title: 'Private transfers of any size',
    text: 'Send privately with any amount you choose — no fixed denominations, no tiers. A small everyday payment gets the same privacy as a large transfer.',
  },
  {
    number: '03',
    title: 'Public + private, one wallet',
    text: 'Keep both balances side by side. Shield assets when you want privacy, unshield back to public whenever you like — the choice is always yours.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Add SWIRL to your browser',
    text: 'Install from the Chrome Web Store in Chrome, Brave or Edge, then pin SWIRL to your toolbar so it is always within reach.',
  },
  {
    number: '02',
    title: 'Create or import a wallet',
    text: 'Set up in under a minute. Your recovery phrase never leaves your device — write it down and keep it safe.',
  },
  {
    number: '03',
    title: 'Choose how you transact',
    text: 'Review every connection, signature and transfer before you approve. Switch between public and private at any time.',
  },
];

export default function ExtensionPage() {
  return (
    <div className="swirl-home">
      <SiteHeader />

      <main>
        <section className="swirl-hero">
          <div className="swirl-hero-orbit" aria-hidden="true"><i /><i /><i /></div>
          <div className="swirl-container swirl-hero-grid">
            <div className="swirl-hero-copy">
              <div className="swirl-eyebrow"><span /> SWIRL WALLET · BROWSER EXTENSION</div>
              <h1>SWIRL for your browser.<br /><em>Privacy where you browse.</em></h1>
              <p>A decentralized, self-custodial wallet for public and private balances. No accounts and no custodial servers — your keys stay on your own device, and privacy is built into every transfer.</p>
              <div className="swirl-hero-actions">
                <a href={CHROME_WEB_STORE_URL} target="_blank" rel="noopener noreferrer" className="swirl-button swirl-button--primary">Add to Chrome <Arrow /></a>
                <Link href="/dapp" className="swirl-button swirl-button--secondary">Open the web wallet <Arrow /></Link>
              </div>
              <div className="swirl-hero-proof swirl-chain-proof" aria-label="Available for Chrome, Brave and Edge via the Chrome Web Store">
                <span>WORKS WITH</span><strong>Chrome</strong><strong>Brave</strong><strong>Edge</strong>
              </div>
            </div>

            <div className="swirl-wallet-stage">
              <div className="swirl-wallet-glow" aria-hidden="true" />
              <div className="swirl-wallet-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/swirl-wallet-preview.png" alt="SWIRL Wallet extension showing public and private asset balances on Ethereum" />
              </div>
              <div className="swirl-wallet-note swirl-wallet-note--top"><i /> USER-HELD KEYS</div>
              <div className="swirl-wallet-note swirl-wallet-note--bottom">PUBLIC + PRIVATE<span>ONE OVERVIEW</span></div>
            </div>
          </div>
        </section>

        <section className="swirl-section swirl-principles">
          <div className="swirl-container">
            <div className="swirl-centered-heading">
              <div className="swirl-kicker">WHY THE EXTENSION</div>
              <h2>One install.<br />Your kind of privacy.</h2>
              <p>The wallet lives in your browser, not on our servers. Everything else follows from that.</p>
            </div>
            <div className="swirl-principle-grid">
              {features.map((item) => (
                <article key={item.number} className="swirl-principle-card">
                  <span>{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="swirl-section swirl-boundary">
          <div className="swirl-container swirl-boundary-grid">
            <div><div className="swirl-kicker">CLEAN PRIVACY</div><h2>Private.<br />And verifiably clean.</h2></div>
            <div>
              <p>SWIRL screens every deposit with Private Proof of Innocence: your funds are checked against sanctions lists without revealing your history to anyone. Privacy you can use, with a pool that stays clean.</p>
              <Link href="/docs">Explore the privacy model <Arrow /></Link>
            </div>
          </div>
        </section>

        <section className="swirl-section swirl-principles">
          <div className="swirl-container">
            <div className="swirl-centered-heading">
              <div className="swirl-kicker">GET STARTED</div>
              <h2>Three steps.<br />Then it is yours.</h2>
              <p>From install to your first private transfer in a few minutes.</p>
            </div>
            <div className="swirl-principle-grid">
              {steps.map((item) => (
                <article key={item.number} className="swirl-principle-card">
                  <span>{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="swirl-final-cta">
          <div className="swirl-final-orbit" aria-hidden="true" />
          <div className="swirl-container">
            <div className="swirl-kicker">SWIRL WALLET · CHROME · BRAVE · EDGE</div>
            <h2>Make room<br /><em>for privacy.</em></h2>
            <p>Installs from the Chrome Web Store. No analytics, no tracking pixels — the store link opens in a new tab.</p>
            <a href={CHROME_WEB_STORE_URL} target="_blank" rel="noopener noreferrer" className="swirl-button swirl-button--primary">Add to Chrome <Arrow /></a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
