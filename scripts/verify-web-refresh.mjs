import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';
import { chromium } from '../../swirl-protocol/node_modules/playwright-core/index.mjs';
import { ethers } from 'ethers';

const root = path.resolve(import.meta.dirname, '..');
const port = 7103;
const origin = `http://127.0.0.1:${port}`;
const zeroHash = `0x${'00'.repeat(32)}`;
const blockHash = `0x${'11'.repeat(32)}`;
const hex32 = (value) => `0x${BigInt(value).toString(16).padStart(64, '0')}`;
const block = {
  number: '0x1', hash: blockHash, parentHash: zeroHash, nonce: '0x0000000000000000',
  sha3Uncles: zeroHash, logsBloom: `0x${'00'.repeat(256)}`, transactionsRoot: zeroHash,
  stateRoot: zeroHash, receiptsRoot: zeroHash, miner: `0x${'00'.repeat(20)}`,
  difficulty: '0x0', totalDifficulty: '0x0', extraData: '0x', size: '0x1',
  gasLimit: '0x1c9c380', gasUsed: '0x0', timestamp: '0x1', transactions: [], uncles: [],
  baseFeePerGas: '0x3b9aca00',
};

let server;
let browser;
let releaseIndexer;
const indexerGate = new Promise((resolve) => { releaseIndexer = resolve; });
const errors = [];
let trackedGasAddress = '';
let trackedGasBalance = 0n;
const receipts = new Map();

function rpcResponse(payload) {
  const requests = Array.isArray(payload) ? payload : [payload];
  const responses = requests.map((rpc) => {
    let result = '0x0';
    if (rpc.method === 'eth_chainId') result = '0x1';
    else if (rpc.method === 'net_version') result = '1';
    else if (rpc.method === 'eth_getBalance') {
      const address = String(rpc.params?.[0] ?? '').toLowerCase();
      result = ethers.toBeHex(address === trackedGasAddress.toLowerCase() ? trackedGasBalance : ethers.parseEther('1'));
    } else if (rpc.method === 'eth_blockNumber') result = '0x1';
    else if (rpc.method === 'eth_getTransactionCount') result = '0x1';
    else if (rpc.method === 'eth_gasPrice' || rpc.method === 'eth_maxPriorityFeePerGas') result = '0x3b9aca00';
    else if (rpc.method === 'eth_estimateGas') result = '0x186a0';
    else if (rpc.method === 'eth_getLogs') result = [];
    else if (rpc.method === 'eth_getBlockByNumber') result = block;
    else if (rpc.method === 'eth_feeHistory') result = { oldestBlock: '0x1', baseFeePerGas: ['0x3b9aca00', '0x3b9aca00'], gasUsedRatio: [0.5], reward: [['0x3b9aca00']] };
    else if (rpc.method === 'eth_sendRawTransaction') {
      const transaction = ethers.Transaction.from(String(rpc.params?.[0]));
      const hash = transaction.hash;
      receipts.set(hash, {
        transactionHash: hash, blockHash, blockNumber: '0x1', transactionIndex: '0x0',
        from: transaction.from, to: transaction.to, cumulativeGasUsed: '0x186a0', gasUsed: '0x186a0',
        contractAddress: null, logs: [], logsBloom: `0x${'00'.repeat(256)}`, status: '0x1',
        effectiveGasPrice: '0x3b9aca00', type: '0x2',
      });
      if (trackedGasAddress && transaction.to?.toLowerCase() === trackedGasAddress.toLowerCase()) {
        trackedGasBalance += transaction.value;
      }
      result = hash;
    } else if (rpc.method === 'eth_getTransactionReceipt') {
      result = receipts.get(String(rpc.params?.[0])) ?? null;
    } else if (rpc.method === 'eth_getTransactionByHash') {
      const receipt = receipts.get(String(rpc.params?.[0]));
      result = receipt ? { ...receipt, hash: receipt.transactionHash, nonce: '0x1', value: '0x0', input: '0x', gas: '0x186a0' } : null;
    } else if (rpc.method === 'eth_call') {
      const to = String(rpc.params?.[0]?.to ?? '').toLowerCase();
      const data = String(rpc.params?.[0]?.data ?? '');
      if (data.startsWith('0x313ce567')) result = hex32(to === '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' ? 18 : 6);
      else result = hex32(0);
    }
    return { jsonrpc: '2.0', id: rpc.id, result };
  });
  return Array.isArray(payload) ? responses : responses[0];
}

try {
  server = spawn(process.execPath, [path.join(root, 'node_modules/next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
    cwd: root, stdio: ['ignore', 'pipe', 'pipe'],
  });
  await Promise.race([
    new Promise((resolve, reject) => {
      server.stdout.on('data', (chunk) => { if (chunk.toString().includes('Ready')) resolve(); });
      server.stderr.on('data', (chunk) => console.error(chunk.toString()));
      server.once('error', reject);
      server.once('exit', (code) => reject(new Error(`Next server exited early: ${code}`)));
    }),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Next server startup timed out')), 30_000)),
  ]);

  browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(`${message.text()} @ ${message.location().url}`); });
  await page.route('https://**/*', async (route) => {
    const request = route.request();
    const url = request.url();
    if (url.includes('indexer.swirl.cash/')) {
      await indexerGate;
      await route.fulfill({ status: 503, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ error: 'Intentional test outage' }) });
      return;
    }
    if (url.includes('swirl.cash/api/prices/native')) {
      await route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ price: 2000 }) });
      return;
    }
    if (url.includes('relay.swirl.cash/')) {
      await route.fulfill({ status: 200, contentType: 'application/json', headers: { 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify({ ok: true, chainId: '1' }) });
      return;
    }
    const body = request.postData();
    if (request.method() === 'POST' && body) {
      let payload;
      try { payload = JSON.parse(body); } catch { payload = null; }
      const requests = Array.isArray(payload) ? payload : [payload];
      if (requests.length && requests.every((rpc) => rpc?.jsonrpc === '2.0' && rpc.method)) {
        await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(rpcResponse(payload)) });
        return;
      }
    }
    await route.continue();
  });
  await page.route('http://127.0.0.1:8545/', async (route) => {
    const payload = JSON.parse(route.request().postData() ?? '{}');
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(rpcResponse(payload)) });
  });
  // The legacy site layout requests a merchant profile unrelated to this wallet test.
  await page.route('http://localhost:3080/api/merchants/me', (route) => route.fulfill({
    status: 200, contentType: 'application/json', body: JSON.stringify({}),
  }));

  await page.goto(`${origin}/dapp`, { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Connect wallet', exact: true }).first().click();
  await page.getByRole('button', { name: 'Create new wallet', exact: true }).click();
  await page.getByLabel('Encryption password').fill('web refresh verification');
  await page.getByLabel('Confirm password').fill('web refresh verification');
  await page.getByRole('button', { name: 'Create encrypted wallet' }).click();
  await page.getByLabel('I have saved my recovery credentials securely.').check();
  await page.getByRole('button', { name: 'Open web wallet' }).click();

  const ethRow = page.locator('.asset-table tbody tr').filter({ hasText: 'ETH' }).first();
  await ethRow.waitFor({ timeout: 30_000 });
  await page.waitForFunction(() => [...document.querySelectorAll('.asset-table tbody tr')].some((row) => row.textContent?.includes('1 ETH')), null, { timeout: 60_000 });
  // The Indexer remains blocked: public data and the current signer must already be usable.
  await page.getByRole('button', { name: 'Shield', exact: true }).first().click();
  await page.getByRole('button', { name: 'MAX', exact: true }).click();
  await page.waitForFunction(() => Number(document.querySelector('.amount-input input')?.value) > 0.99, null, { timeout: 30_000 });
  const shieldMaximum = await page.locator('.amount-input input').inputValue();
  if (!(Number(shieldMaximum) > 0.99 && Number(shieldMaximum) < 1)) throw new Error(`Incorrect Shield maximum: ${shieldMaximum}`);
  if (await page.getByRole('button', { name: 'Confirm Shield' }).isDisabled()) throw new Error('Background note sync still blocks Shield');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => [...document.querySelectorAll('.asset-table tbody tr')].some((row) => row.textContent?.includes('1 ETH')), null, { timeout: 60_000 });

  await page.getByRole('button', { name: 'Transfer', exact: true }).first().click();
  await page.getByRole('button', { name: 'Public', exact: true }).click();
  await page.locator('.amount-input input').fill('0.01');
  await page.getByPlaceholder('0x…').fill('0x000000000000000000000000000000000000dEaD');
  await page.getByRole('button', { name: 'Confirm Transfer' }).click();
  await page.getByText(/Public transfer confirmed\./).waitFor({ timeout: 30_000 });

  await page.getByRole('button', { name: 'Gas account', exact: true }).click();
  trackedGasAddress = (await page.locator('.address-box code').textContent())?.trim() ?? '';
  if (!ethers.isAddress(trackedGasAddress)) throw new Error(`Invalid Gas address: ${trackedGasAddress}`);
  await page.locator('.amount-input input').fill('0.1');
  await page.getByRole('button', { name: 'Fund Gas account' }).click();
  await page.getByText(/Gas account funded with 0\.1 ETH\./).waitFor({ timeout: 30_000 });
  await page.locator('.gas-balance').filter({ hasText: '0.1 ETH' }).waitFor({ timeout: 30_000 });
  if (trackedGasBalance !== ethers.parseEther('0.1')) throw new Error(`Unexpected mocked Gas balance: ${trackedGasBalance}`);
  if (errors.length) throw new Error(errors.join(' | '));

  console.log(JSON.stringify({
    ok: true,
    publicBalanceBeforeIndexerResponse: '1 ETH',
    refreshRestoredBalance: true,
    shieldMaximum,
    publicTransferSuccessWithoutIndexer: true,
    gasTopUp: '0.1 ETH',
    pageErrors: errors,
  }, null, 2));
} finally {
  releaseIndexer();
  if (browser) await browser.close();
  if (server && server.exitCode === null && server.signalCode === null) {
    server.kill('SIGTERM');
    await Promise.race([once(server, 'exit'), new Promise((resolve) => setTimeout(resolve, 3000))]);
  }
}
