import type { Metadata } from 'next';
import { DappGateway } from './DappGateway';

export const metadata: Metadata = {
  title: 'SWIRL Wallet — One wallet. Every chain.',
  description: 'One self-custodial wallet for public and private assets across Bitcoin and EVM, available on the web and as a browser extension.',
};

export default function DappPage() {
  return <DappGateway />;
}
