import type { Metadata } from 'next';
import { EvmFrame } from './EvmFrame';

export const metadata: Metadata = {
  title: 'SWIRL Wallet — EVM',
  description: 'SWIRL Wallet for Ethereum: self-custodial public balances, private assets and private transfers.',
};

export default function EvmPage() {
  return <EvmFrame />;
}
