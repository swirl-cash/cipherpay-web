'use client';

import { Callout, Code, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

export default function RoundsSection() {
  return (
    <>
      <SectionTitle>The pool is the anonymity set</SectionTitle>
      <Paragraph>
        A mix is only as strong as the crowd it hides in. SWIRL therefore keeps the pool
        <Strong> continuously open</Strong>: deposits never wait for a batch, and the crowd you hide in is not a
        fixed round of k participants — it is every live deposit resting in the pool, a set that only grows as
        new capital arrives. An observer watching the exit side sees payouts leaving one by one, on independent
        random schedules, against a backdrop of everyone&apos;s funds. Your effective anonymity is the
        <Strong> depth of the pool</Strong> at the moment you leave.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Lifecycle of a deposit</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 20 }}>
        {[
          { n: '1', label: 'POOLED', sub: 'Deposit confirmed over an unannounced channel' },
          { n: '2', label: 'HELD', sub: 'Minimum hold — nothing exits before its time' },
          { n: '3', label: 'QUEUED', sub: 'Enters the randomized exit queue' },
          { n: '4', label: 'RELEASED', sub: 'Leaves shuffled, delayed, over a blinded path' },
        ].map(s => (
          <div key={s.n} style={{ textAlign: 'center', padding: '14px 10px', background: 'var(--cp-bg)', border: '1px solid var(--cp-border)', borderRadius: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--cp-cyan)', marginBottom: 4 }}>{s.n}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--cp-text)', marginBottom: 2 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: 'var(--cp-text-dim)' }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <Paragraph>
        Two clocks govern every deposit. The first is the privacy guarantee:
        <Code> swirl-min-hold </Code> (default 1800 seconds) — a deposit cannot exit before it has rested in the
        pool for at least this long, so fresh capital is always arriving behind it before it leaves. The second
        is unpredictability: once the hold expires, the exit enters a delay queue and is released after a random
        additional interval of up to <Code> swirl-exit-jitter-max </Code> seconds. No deposit maps to a clock an
        observer can subtract out.
      </Paragraph>
      <Paragraph>
        At release, every exit is decomposed into denomination chunks (see
        <Strong> Denomination Lattice</Strong>), chunks from different jobs interleave in a cryptographically
        shuffled order, and each chunk waits its own independent delay. Because the pool never settles in
        discrete batches, there is no round boundary for an analyst to slice on — the flow is continuous, and
        continuous flow has no edges.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Why depth matters more than any other number</SectionTitle>
      <Paragraph>
        Every other mechanism — denominations, jitter, blinded paths — exists to protect the integrity of the
        set. If amounts were unique, the flow would be invertible by subset-sum. If timing were uniform, it
        would be invertible by order. With those oracles closed, the residual information of an exit is exactly
        log₂(depth): the number of bits an observer gains by knowing you were in the pool at all. Depth
        compounds — every minute a deposit rests, the crowd around it thickens.
      </Paragraph>
      <SectionDivider />

      <SectionTitle>Every denomination tier is its own crowd</SectionTitle>
      <Paragraph>
        Anonymity sets stack per tier, and they stack over time. A 0.001-BTC chunk leaving the pool is
        indistinguishable from every other 0.001-BTC chunk ever cut — so your effective crowd is the
        population of your tier, accumulated across the pool&apos;s whole history. The practical consequence:
        smaller denominations hide in deeper crowds. The smallest lane naturally carries the most participants,
        which makes it the strongest tier in the lattice — and it is priced accordingly (see
        <Strong> Fee Schedule</Strong>: the 0.001-BTC lane is subsidized to zero, because every small
        deposit deepens the set that all larger lanes stand on).
      </Paragraph>
      <Callout type="info">
        The pool parameters (<Code>min-hold</Code>, <Code>exit-jitter-max</Code>,
        <Code> min-delay / max-delay</Code>) are operator-tunable per node. Longer holds deepen anonymity at the
        cost of latency; the defaults are deliberately conservative. See <Strong>CLI Reference</Strong>.
      </Callout>
    </>
  );
}
