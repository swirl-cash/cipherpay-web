'use client';

import { Callout, CodeBlock, SectionDivider, Paragraph, SectionTitle, Strong } from '../components/DocComponents';

/* Inline SVG so the diagram follows the site's CSS variables —
   it re-themes with the page instead of being a frozen dark image. */
function MiningFlowDiagram() {
  const dim = 'var(--cp-text-dim)';
  const muted = 'var(--cp-text-muted)';
  const text = 'var(--cp-text)';
  const cyan = 'var(--cp-cyan)';
  const yellow = 'var(--cp-yellow)';
  const border = 'var(--cp-border)';
  const bg = 'var(--cp-bg)';
  const mono = 'var(--font-mono, ui-monospace, monospace)';

  return (
    <svg
      viewBox="0 0 960 380"
      style={{ display: 'block', width: '100%', height: 'auto' }}
      role="img"
      aria-label="Anonymity mining loop: deposit, rest, weight, claim"
    >
      <defs>
        <linearGradient id="mf-bar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: cyan }} />
          <stop offset="1" style={{ stopColor: yellow }} />
        </linearGradient>
        <radialGradient id="mf-orb" cx="35%" cy="30%" r="80%">
          <stop offset="0" style={{ stopColor: cyan, stopOpacity: 0.22 }} />
          <stop offset="0.7" style={{ stopColor: cyan, stopOpacity: 0.05 }} />
          <stop offset="1" style={{ stopColor: cyan, stopOpacity: 0 }} />
        </radialGradient>
      </defs>

      <g fontFamily={mono}>
        {/* card */}
        <rect x="0.5" y="0.5" width="959" height="379" rx="12" fill={bg} stroke={border} />

        {/* title bar */}
        <circle cx="24" cy="24" r="4" fill="none" stroke={border} />
        <circle cx="38" cy="24" r="4" fill="none" stroke={border} />
        <circle cx="52" cy="24" r="4" fill="none" stroke={border} />
        <text x="76" y="28" fontSize="10" letterSpacing="2" fill={dim}>swirl://mining/accrual-loop</text>
        <text x="936" y="28" fontSize="9" letterSpacing="2" fill={yellow} textAnchor="end">ANONYMITY MINING</text>
        <line x1="0" y1="44" x2="960" y2="44" stroke={border} />

        {/* 01 deposit */}
        <text x="70" y="92" fontSize="10" letterSpacing="2" fill={dim}>01</text>
        <text x="70" y="112" fontSize="13" fontWeight="bold" letterSpacing="1.5" fill={text}>DEPOSIT</text>
        <rect x="70" y="128" width="150" height="46" rx="6" fill="none" stroke={border} />
        <text x="145" y="148" fontSize="10" fill={muted} textAnchor="middle">sats → pool</text>
        <text x="145" y="164" fontSize="10" fill={cyan} textAnchor="middle">commitment</text>
        <text x="70" y="196" fontSize="9" fill={dim}>unannounced channel in</text>
        <text x="70" y="210" fontSize="9" fill={dim}>receipt issued to you</text>

        <line x1="232" y1="151" x2="288" y2="151" stroke={cyan} strokeWidth="1.5" strokeDasharray="5 6" />
        <polygon points="288,146 298,151 288,156" fill={cyan} />

        {/* 02 rest */}
        <text x="310" y="92" fontSize="10" letterSpacing="2" fill={dim}>02</text>
        <text x="310" y="112" fontSize="13" fontWeight="bold" letterSpacing="1.5" fill={text}>REST</text>
        <circle cx="385" cy="151" r="26" fill="url(#mf-orb)" stroke={cyan} strokeOpacity="0.5" />
        <circle cx="385" cy="151" r="34" fill="none" stroke={cyan} strokeOpacity="0.2" />
        <text x="385" y="148" fontSize="10" fill={cyan} textAnchor="middle">k-set</text>
        <text x="385" y="161" fontSize="9" fill={dim} textAnchor="middle">in-pool</text>
        <text x="310" y="196" fontSize="9" fill={dim}>every block held deepens</text>
        <text x="310" y="210" fontSize="9" fill={dim}>the set for everyone</text>

        <line x1="432" y1="151" x2="488" y2="151" stroke={cyan} strokeWidth="1.5" strokeDasharray="5 6" />
        <polygon points="488,146 498,151 488,156" fill={cyan} />

        {/* 03 weight */}
        <text x="510" y="92" fontSize="10" letterSpacing="2" fill={dim}>03</text>
        <text x="510" y="112" fontSize="13" fontWeight="bold" letterSpacing="1.5" fill={text}>WEIGHT</text>
        <rect x="510" y="124" width="180" height="14" rx="7" fill="none" stroke={border} />
        <rect x="513" y="127" width="122" height="8" rx="4" fill="url(#mf-bar)" />
        <text x="510" y="160" fontSize="10" fill={text}>sats × blocks × log₂(k)</text>
        <text x="510" y="196" fontSize="9" fill={dim}>accrues per block held,</text>
        <text x="510" y="210" fontSize="9" fill={dim}>scaled by live depth</text>

        <line x1="700" y1="151" x2="756" y2="151" stroke={cyan} strokeWidth="1.5" strokeDasharray="5 6" />
        <polygon points="756,146 766,151 756,156" fill={cyan} />

        {/* 04 claim */}
        <text x="778" y="92" fontSize="10" letterSpacing="2" fill={dim}>04</text>
        <text x="778" y="112" fontSize="13" fontWeight="bold" letterSpacing="1.5" fill={text}>CLAIM</text>
        <rect x="778" y="128" width="150" height="46" rx="6" fill="none" stroke={border} />
        <text x="853" y="148" fontSize="10" fill={muted} textAnchor="middle">against receipt —</text>
        <text x="853" y="164" fontSize="10" fill={cyan} textAnchor="middle">no account, no id</text>
        <text x="778" y="196" fontSize="9" fill={dim}>fee rebates now,</text>
        <text x="778" y="210" fontSize="9" fill={dim}>SWIRL allocation at launch</text>

        {/* divider */}
        <line x1="40" y1="240" x2="920" y2="240" stroke={border} />

        {/* loop note */}
        <text x="70" y="276" fontSize="10" letterSpacing="2" fill={yellow}>THE LOOP</text>
        <text x="70" y="300" fontSize="11" fill={muted}>you lend the crowd your presence — the protocol pays you for the crowd you protect.</text>
        <text x="70" y="322" fontSize="10" fill={dim}>weight is claimed against the receipt credential: the pool learns that a commitment from</text>
        <text x="70" y="338" fontSize="10" fill={dim}>a pool epoch earned weight — never which participant holds it.</text>

        {/* loop-back arrow */}
        <path d="M 853 186 C 853 226, 145 226, 145 186" fill="none" stroke={border} strokeWidth="1" strokeDasharray="3 6" />
        <polygon points="145,182 139,192 151,192" fill={border} />
        <text x="500" y="234" fontSize="9" letterSpacing="2" fill={dim} textAnchor="middle" opacity="0.8">RE-ENTER — COMPOUND THE SET</text>
      </g>
    </svg>
  );
}

export default function MiningSection() {
  return (
    <>
      <SectionTitle>Time in the pool is hash-rate</SectionTitle>
      <Paragraph>
        Every block a commitment stays inside the pool, the anonymity set is denser for every other participant.
        Patience is therefore not a cost the protocol asks you to absorb — it is work the protocol pays for.
        Anonymity mining converts time-at-rest into <Strong>weight</Strong>, and weight into rewards.
      </Paragraph>

      <CodeBlock lang="accrual" code={`weight = sats × blocks_held × log₂(anon_set)

sats          size of the commitment, in satoshis
blocks_held   blocks elapsed since the entry settled
anon_set      live depth of the pool — a deeper
              pool pays more, because it protects more`} />

      <div style={{ margin: '24px 0 8px' }}>
        <MiningFlowDiagram />
      </div>
      <Paragraph>
        The loop closes back on itself: nothing stops a claimed payout from re-entering the pool, compounding
        the anonymity set further.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Why the anonymity set is in the formula</SectionTitle>
      <Paragraph>
        A commitment sitting in a shallow pool contributes almost nothing; the same commitment in a
        deep one is load-bearing. The log₂ term prices that honestly: your reward scales with the
        protection your presence actually provides, so capital naturally migrates toward the depth where it does
        the most good — which is also where it gets the most privacy.
      </Paragraph>

      <SectionDivider />

      <SectionTitle>Redemption</SectionTitle>
      <Paragraph>
        Weight redeems in two stages. First, as <Strong>fee rebates</Strong>: the mix fee on your exits is drawn
        down against accrued weight before any sats move. Second, once the SWIRL token launches, accrued weight
        maps into an allocation — the earliest and most patient liquidity is exactly the liquidity that gets
        governance weight.
      </Paragraph>
      <Paragraph>
        Redemption never requires identifying yourself: weight is claimed against the receipt credential, not
        against an account. The pool learns that <em>a</em> commitment from a pool epoch earned weight; it does not
        learn which participant holds it.
      </Paragraph>
      <Callout type="info">
        Anonymity mining is a planned module, marked SOON in the console. The accrual function above is the
        specification the implementation is being built against.
      </Callout>
    </>
  );
}
