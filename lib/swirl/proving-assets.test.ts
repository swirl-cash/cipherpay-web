import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('brotli/decompress', () => ({ default: (bytes: Uint8Array) => bytes }));

const hashes = {
  wasm: '8953d86b90fbfc32293b5ebafa16d130781d35de36af3cc0219bc7cacd969065',
  zkey: '829a3be016ff19fdaad6040dc5f04d06fad79400a01dea6d7fe0685bfa03b598',
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.resetModules();
});

describe('proving resource loading', () => {
  it('uses our IPFS directory first and shares live progress with an existing prefetch', async () => {
    const downloads: { url: string; controller: ReadableStreamDefaultController<Uint8Array> }[] = [];
    const fetchMock = vi.fn((url: string | URL | Request) => {
      const source = String(url);
      const stream = new ReadableStream<Uint8Array>({
        start(controller) { downloads.push({ url: source, controller }); },
      });
      return Promise.resolve(new Response(stream, { status: 200, headers: { 'content-length': '100' } }));
    });
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('caches', {
      open: async () => ({ match: async () => null, put: async () => undefined, delete: async () => true }),
    });
    vi.spyOn(crypto.subtle, 'digest').mockImplementation(async (_algorithm, data) => {
      const source = new TextDecoder().decode(data as ArrayBuffer);
      const hash = source.includes('swirl_transfer.wasm.br') ? hashes.wasm : hashes.zkey;
      return Uint8Array.from(Buffer.from(hash, 'hex')).buffer;
    });

    const { getTransferProvingAssets } = await import('./proving-assets');
    const prefetch = getTransferProvingAssets();
    await vi.waitFor(() => expect(downloads).toHaveLength(2));
    expect(downloads.every((download) => download.url.startsWith('https://gateway.pinata.cloud/ipfs/QmVD4i6wenndzEhKWFogkB1sqAjvLCYDgkdmUCvyUFr25E/'))).toBe(true);

    const progress: number[] = [];
    const visibleLoad = getTransferProvingAssets((value) => progress.push(value));
    expect(progress).toEqual([0]);
    for (const download of downloads) {
      download.controller.enqueue(new TextEncoder().encode(download.url));
      download.controller.close();
    }
    await Promise.all([prefetch, visibleLoad]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(progress).toContain(40);
    expect(progress.at(-1)).toBe(100);
  });
});
