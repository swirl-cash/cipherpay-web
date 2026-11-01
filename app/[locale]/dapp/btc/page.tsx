import type { Metadata } from 'next';
import { DappClient } from './DappClient';

export const metadata: Metadata = {
  title: 'DAPP — SWIRL Pool Mixer',
  description:
    'Pooled mixing on the Lightning Network. Unannounced channels in, blinded paths out. Entry ≠ exit, in ≠ out.',
};

export default function BtcDappPage() {
  return <DappClient />;
}
