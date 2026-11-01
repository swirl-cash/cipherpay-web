'use client';

import { Callout, Code, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

const OPTS: { flag: string; def: string; desc: string }[] = [
  { flag: 'swirl-min-delay', def: '20', desc: 'Minimum seconds between consecutive chunk releases.' },
  { flag: 'swirl-max-delay', def: '300', desc: 'Maximum seconds between consecutive chunk releases.' },
  { flag: 'swirl-min-hold', def: '1800', desc: 'Minimum time a deposit rests in the pool before it may exit, seconds.' },
  { flag: 'swirl-exit-jitter-max', def: '3600', desc: 'Upper bound on the random delay before a queued exit is released, seconds.' },
];

export default function TimingSection() {
  return (
    <>
      <SectionTitle>Time is a side channel</SectionTitle>
      <Paragraph>
        An observer who cannot match amounts can still match clocks. If deposits and payouts arrive in the same
        order, or with a fixed processing delay, the flow can be inverted by timing correlation alone.
        SWIRL treats the release schedule as a <Strong>privacy primitive</Strong>, not an implementation detail.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Three independent sources of randomness</SectionTitle>
      <Paragraph>
        <Strong>Order permutation.</Strong> Across the exit queue, chunks are released in a uniform random order that
        has no relationship to deposit order. Arrival sequence is destroyed before the first payout moves.
      </Paragraph>
      <Paragraph>
        <Strong>Per-chunk delay.</Strong> Each release waits an independent, uniformly drawn delay between
        <Code> swirl-min-delay </Code> and <Code> swirl-max-delay </Code> seconds. Chunks from the same job
        therefore leave minutes apart, interleaved with other participants&apos; chunks, and no two jobs share
        a rhythm.
      </Paragraph>
      <Paragraph>
        <Strong>Exit-queue jitter.</Strong> A queued exit holds for a random interval (up to
        <Code> swirl-exit-jitter-max</Code>) after its minimum hold before release, so deposit-time → exit-time is
        not a fixed function an observer can subtract out.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>The knobs, with defaults</SectionTitle>
      <div style={{ overflowX: 'auto', marginBottom: 24 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--cp-border)' }}>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--cp-text-muted)', fontWeight: 600, fontSize: 10, letterSpacing: 0.5 }}>OPTION</th>
              <th style={{ textAlign: 'right', padding: '8px 12px', color: 'var(--cp-text-muted)', fontWeight: 600, fontSize: 10, letterSpacing: 0.5 }}>DEFAULT</th>
              <th style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--cp-text-muted)', fontWeight: 600, fontSize: 10, letterSpacing: 0.5 }}>EFFECT</th>
            </tr>
          </thead>
          <tbody>
            {OPTS.map(o => (
              <tr key={o.flag} style={{ borderBottom: '1px solid var(--cp-border)' }}>
                <td style={{ padding: '10px 12px' }}><Code>{o.flag}</Code></td>
                <td style={{ padding: '10px 12px', color: 'var(--cp-text)', textAlign: 'right' }}>{o.def}s</td>
                <td style={{ padding: '10px 12px', color: 'var(--cp-text-dim)' }}>{o.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout type="info">
        Longer and wider delays strengthen unlinkability at the cost of settlement latency. The trade-off is
        explicit and operator-controlled — the engine never silently trades your privacy for speed.
      </Callout>
    </>
  );
}
