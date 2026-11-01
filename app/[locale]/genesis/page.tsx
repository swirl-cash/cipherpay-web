import type { Metadata } from 'next';
import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import GenesisClient from './GenesisClient';

export const metadata: Metadata = {
  title: 'Genesis Campaign — SWIRL',
  description: 'The SWIRL genesis campaign: 5% of SWIRL (1,050,000) to the earliest believers. Invite-only entry, X-verified seats, ranked by the weight you bring to the pool.',
};

export default function GenesisPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        fontFamily: 'var(--font-geist-mono), monospace',
        fontSize: 13,
        lineHeight: 1.6,
      }}
    >
      <SiteHeader label="GENESIS" />
      <GenesisClient />
      <SiteFooter />
    </div>
  );
}
