import type { Metadata } from 'next';
import ShareRedirect from './ShareRedirect';

const ORIGIN = process.env.GENESIS_ORIGIN || 'https://swirl.cash';

/* Share landing — crawlers (X card bot) read the og tags; humans get
   redirected straight into the genesis console with the ref planted. */

export async function generateMetadata(
  { params }: { params: Promise<{ code: string }> },
): Promise<Metadata> {
  const { code } = await params;
  // ?v=3 — busts the card cache X stored with the old PAY.SWIRL.DEV artwork
  const card = `${ORIGIN}/card/${encodeURIComponent(code)}?v=3`;
  return {
    title: 'SWIRL Genesis — a seat is waiting',
    description:
      'Silent payments on Lightning. Unannounced channels in, blinded paths out, zero on-chain trace. The first 5% of SWIRL belongs to the earliest seats.',
    openGraph: {
      title: 'SWIRL Genesis — a seat is waiting',
      description:
        'Silent payments on Lightning. Unannounced channels in, blinded paths out, zero on-chain trace. The first 5% of SWIRL belongs to the earliest seats.',
      images: [{ url: card, width: 1200, height: 630 }],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'SWIRL Genesis — a seat is waiting',
      description:
        'Silent payments on Lightning. Unannounced channels in, blinded paths out, zero on-chain trace.',
      images: [card],
    },
  };
}

export default async function SharePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <ShareRedirect code={code} />;
}
