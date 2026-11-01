import { LogoMark } from '@/components/Logo';

export function AnimatedSwirlMark({ size = 84 }: { size?: number }) {
  return (
    <span className="animated-swirl-mark" style={{ width: size, height: size }}>
      <svg
        className="swirl-mark-orbits"
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="swirl-cyber-spectrum" x1="14" y1="18" x2="104" y2="102" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#A855F7" stopOpacity="0.45" />
            <stop offset="0.48" stopColor="#7087FF" stopOpacity="0.8" />
            <stop offset="1" stopColor="#00D4FF" />
          </linearGradient>
        </defs>
        <g className="swirl-mark-outer">
          <circle
            cx="60"
            cy="60"
            r="56"
            stroke="url(#swirl-cyber-spectrum)"
            strokeWidth="1.35"
            strokeDasharray="96 22 8 38 112 76"
            strokeLinecap="round"
          />
        </g>
        <g className="swirl-mark-inner">
          <rect x="58" y="1" width="4" height="4" rx="0.6" fill="#00D4FF" />
          <rect x="59" y="0" width="2" height="2" fill="#D9FBFF" />
        </g>
      </svg>
      <span className="swirl-mark-core">
        <LogoMark size={Math.round(size * 0.78)} />
      </span>
    </span>
  );
}
