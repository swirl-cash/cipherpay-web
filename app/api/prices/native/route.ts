import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type NativePriceProfile = { coinGeckoId: string; symbol: string };
const profiles: Record<number, NativePriceProfile> = {
  1: { coinGeckoId: 'ethereum', symbol: 'ETH' },
  56: { coinGeckoId: 'binancecoin', symbol: 'BNB' },
  137: { coinGeckoId: 'polygon-ecosystem-token', symbol: 'POL' },
  42161: { coinGeckoId: 'ethereum', symbol: 'ETH' },
  11155111: { coinGeckoId: 'ethereum', symbol: 'ETH' },
  80002: { coinGeckoId: 'polygon-ecosystem-token', symbol: 'POL' },
};
const cache = new Map<number, { price: number; timestamp: number }>();
const validPrice = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0;

async function readPrice(url: string, extract: (data: unknown) => unknown): Promise<number> {
  const response = await fetch(url, { signal: AbortSignal.timeout(7_000), cache: 'no-store' });
  if (!response.ok) throw new Error(`Price source returned HTTP ${response.status}`);
  const price = extract(await response.json());
  if (!validPrice(price)) throw new Error('Price source returned an invalid quote');
  return price;
}

const responseHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Cache-Control': 'no-store',
};
const priceJson = (body: unknown, status = 200) => NextResponse.json(body, { status, headers: responseHeaders });

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: responseHeaders });
}

export async function GET(request: Request) {
  const chainId = Number(new URL(request.url).searchParams.get('chainId'));
  const profile = profiles[chainId];
  if (!profile) return priceJson({ error: 'Unsupported network' }, 400);
  const cached = cache.get(chainId);
  if (cached && Date.now() - cached.timestamp < 60_000) {
    return priceJson({ chainId, price: cached.price, asOf: new Date(cached.timestamp).toISOString() });
  }

  const sources: [string, string, (data: never) => unknown][] = [
    ['coingecko', `https://api.coingecko.com/api/v3/simple/price?ids=${profile.coinGeckoId}&vs_currencies=usd`,
      (data) => (data as unknown as Record<string, { usd?: unknown }>)[profile.coinGeckoId]?.usd],
    ['coinbase', `https://api.coinbase.com/v2/prices/${profile.symbol}-USD/spot`,
      (data) => Number((data as unknown as { data?: { amount?: unknown } }).data?.amount)],
    ['binance', `https://api.binance.com/api/v3/ticker/price?symbol=${profile.symbol}USDT`,
      (data) => Number((data as unknown as { price?: unknown }).price)],
  ];
  for (const [source, url, extract] of sources) {
    try {
      const price = await readPrice(url, extract as (data: unknown) => unknown);
      const timestamp = Date.now();
      cache.set(chainId, { price, timestamp });
      return priceJson({ chainId, price, source, asOf: new Date(timestamp).toISOString() });
    } catch { /* Try the next independent public price source. */ }
  }
  if (cached) return priceJson({ chainId, price: cached.price, stale: true, asOf: new Date(cached.timestamp).toISOString() });
  return priceJson({ error: 'USD price is temporarily unavailable' }, 503);
}
