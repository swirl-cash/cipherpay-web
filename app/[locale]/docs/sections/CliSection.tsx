'use client';

import { Code, CodeBlock, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

const OPTS: { flag: string; def: string; desc: string }[] = [
  { flag: 'swirl-fee-bps', def: '50', desc: 'Default mixer fee, basis points — the rate for lanes not listed in the schedule.' },
  { flag: 'swirl-fee-schedule', def: '—', desc: "Per-lane fee table, 'denom_sat:bps' pairs: '10000000:50,1000000:25,100000:0'. The governance-set lever for lane subsidies." },
  { flag: 'swirl-min-delay', def: '20', desc: 'Minimum delay between chunk releases, seconds.' },
  { flag: 'swirl-max-delay', def: '300', desc: 'Maximum delay between chunk releases, seconds.' },
  { flag: 'swirl-min-hold', def: '1800', desc: 'Minimum time a deposit rests in the pool before it may exit, seconds.' },
  { flag: 'swirl-exit-jitter-max', def: '3600', desc: 'Random additional delay before a queued exit is released, seconds.' },
  { flag: 'swirl-jitter-bps', def: '0', desc: 'Optional amount jitter, basis points. Off by default — lattice purity first.' },
  { flag: 'swirl-pay-retry-for', def: '120', desc: 'Per-chunk payment retry window, seconds.' },
  { flag: 'swirl-loopout-enabled', def: '0', desc: 'Enable the submarine loop-out exit path. Experimental.' },
  { flag: 'swirl-minimal-logs', def: '0', desc: 'Strip sensitive fields from plugin logs.' },
  { flag: 'swirl-retention-seconds', def: '86400', desc: 'How long settled job records persist before purge.' },
];

export default function CliSection() {
  return (
    <>
      <SectionTitle>Three commands</SectionTitle>
      <Paragraph>
        The mixer is a Core Lightning plugin. Everything it does is reachable through three RPC methods on your
        own node; there is no dashboard, no account, no remote API. Keys and state never leave your machine.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>swirl-offer</SectionTitle>
      <Paragraph>
        Publish a reusable static offer. Because the node sits behind unannounced channels, CLN attaches a
        blinded path automatically — the resulting <Code>lno1…</Code> string never names your node.
      </Paragraph>
      <CodeBlock lang="terminal" code={`lightning-cli swirl-offer \\
  --description "swirl silent payment" \\
  --amount any

# → { "offer": "lno1zcpq8pj0x…", "active": true }`} />

      <SectionDivider />

      <SectionTitle>swirl-mix</SectionTitle>
      <Paragraph>
        Start a mix job. <Code>destination</Code> accepts a BOLT12 offer (<Code>lno1…</Code>) for off-chain
        settlement or a base58/bech32 address (<Code>bc1…</Code>) for the loop-out path. The call returns a
        one-time invoice; once the payer settles it, the job rests in the pool — exitable after the minimum hold, released through the delay queue.
      </Paragraph>
      <CodeBlock lang="terminal" code={`lightning-cli swirl-mix \\
  --destination lno1zrxq8pj0x… \\
  --amount_msat 500000000

# → { "job_id": "swirl-…", "invoice": "lni1…", "state": "awaiting_deposit" }`} />

      <SectionDivider />

      <SectionTitle>swirl-status</SectionTitle>
      <Paragraph>
        Inspect one job, or the whole pool: live pool depth, the exit queue, per-job state
        (<Code>awaiting_deposit → pooled → held → queued → settled</Code>), and the chunk release schedule.
      </Paragraph>
      <CodeBlock lang="terminal" code={`lightning-cli swirl-status            # pool + all jobs
lightning-cli swirl-status swirl-9f2c   # one job`} />

      <SectionDivider />

      <SectionTitle>Node options</SectionTitle>
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--cp-border)' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--cp-text-muted)', fontWeight: 600, fontSize: 10, letterSpacing: 0.5 }}>OPTION</th>
              <th style={{ textAlign: 'right', padding: '8px 12px', color: 'var(--cp-text-muted)', fontWeight: 600, fontSize: 10, letterSpacing: 0.5 }}>DEFAULT</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--cp-text-muted)', fontWeight: 600, fontSize: 10, letterSpacing: 0.5 }}>MEANING</th>
            </tr>
          </thead>
          <tbody>
            {OPTS.map(o => (
              <tr key={o.flag} style={{ borderBottom: '1px solid var(--cp-border)' }}>
                <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}><Code>{o.flag}</Code></td>
                <td style={{ padding: '10px 12px', color: 'var(--cp-text)', textAlign: 'right' }}>{o.def}</td>
                <td style={{ padding: '10px 12px', color: 'var(--cp-text-dim)' }}>{o.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
