'use client';

import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Logo } from '@/components/Logo';

export function SiteFooter() {
  const t = useTranslations('nav');

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <span className="footer-brand">
          <Logo size="md" />
        </span>
        <div className="footer-links footer-links-primary">
          <Link href="/docs">{t('docs')}</Link>
          <Link href="/faq">{t('faq')}</Link>
          <Link href="/brand">{t('brand')}</Link>
          <Link href="/privacy">{t('privacy')}</Link>
          <Link href="/terms">{t('terms')}</Link>
          <a href="https://github.com/swirl-cash" target="_blank" rel="noopener noreferrer">GITHUB</a>
          <a href="https://x.com/swirlbtc" target="_blank" rel="noopener noreferrer" aria-label="X">𝕏</a>
        </div>
        <span className="footer-copy">© {new Date().getFullYear()} SWIRL · Privacy for Bitcoin &amp; EVM</span>
      </div>
    </footer>
  );
}
