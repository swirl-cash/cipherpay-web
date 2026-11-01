export function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const config = {
    sm: { icon: 14, text: 16, gap: 6 },
    md: { icon: 25, text: 21, gap: 9 },
    lg: { icon: 32, text: 26, gap: 10 },
  }[size];

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: config.gap }}>
      <LogoMark size={config.icon} />
      <span style={{ fontSize: config.text, fontWeight: 700, letterSpacing: -0.5, fontFamily: 'var(--font-geist-mono), monospace' }}>
        <span style={{ color: 'var(--cp-cyan)' }}>SWIRL</span>
      </span>
    </span>
  );
}

export function LogoMark({ size = 10 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      shapeRendering="crispEdges"
      style={{ display: 'block' }}
      aria-label="SWIRL"
      role="img"
    >
      <rect x="21" y="2" width="1.02" height="1.02" fill="rgb(163,89,247)" />
      <rect x="23" y="3" width="1.02" height="1.02" fill="rgb(163,89,247)" />
      <rect x="24" y="4" width="1.02" height="1.02" fill="rgb(160,91,247)" />
      <rect x="10" y="5" width="1.02" height="1.02" fill="rgb(133,112,249)" />
      <rect x="11" y="5" width="1.02" height="1.02" fill="rgb(128,115,249)" />
      <rect x="12" y="5" width="1.02" height="1.02" fill="rgb(124,118,249)" />
      <rect x="13" y="5" width="1.02" height="1.02" fill="rgb(121,121,249)" />
      <rect x="14" y="5" width="1.02" height="1.02" fill="rgb(119,122,249)" />
      <rect x="15" y="5" width="1.02" height="1.02" fill="rgb(118,123,249)" />
      <rect x="16" y="5" width="1.02" height="1.02" fill="rgb(118,123,249)" />
      <rect x="17" y="5" width="1.02" height="1.02" fill="rgb(119,122,249)" />
      <rect x="25" y="5" width="1.02" height="1.02" fill="rgb(159,92,247)" />
      <rect x="8" y="6" width="1.02" height="1.02" fill="rgb(136,110,249)" />
      <rect x="9" y="6" width="1.02" height="1.02" fill="rgb(129,115,249)" />
      <rect x="10" y="6" width="1.02" height="1.02" fill="rgb(123,119,249)" />
      <rect x="11" y="6" width="1.02" height="1.02" fill="rgb(118,123,249)" />
      <rect x="12" y="6" width="1.02" height="1.02" fill="rgb(113,126,250)" />
      <rect x="13" y="6" width="1.02" height="1.02" fill="rgb(110,129,250)" />
      <rect x="14" y="6" width="1.02" height="1.02" fill="rgb(108,131,250)" />
      <rect x="15" y="6" width="1.02" height="1.02" fill="rgb(107,131,250)" />
      <rect x="16" y="6" width="1.02" height="1.02" fill="rgb(107,131,250)" />
      <rect x="17" y="6" width="1.02" height="1.02" fill="rgb(108,131,250)" />
      <rect x="18" y="6" width="1.02" height="1.02" fill="rgb(110,129,250)" />
      <rect x="19" y="6" width="1.02" height="1.02" fill="rgb(113,126,250)" />
      <rect x="26" y="6" width="1.02" height="1.02" fill="rgb(159,92,247)" />
      <rect x="6" y="7" width="1.02" height="1.02" fill="rgb(143,104,248)" />
      <rect x="7" y="7" width="1.02" height="1.02" fill="rgb(135,110,249)" />
      <rect x="8" y="7" width="1.02" height="1.02" fill="rgb(127,116,249)" />
      <rect x="9" y="7" width="1.02" height="1.02" fill="rgb(120,121,249)" />
      <rect x="19" y="7" width="1.02" height="1.02" fill="rgb(103,134,250)" />
      <rect x="20" y="7" width="1.02" height="1.02" fill="rgb(108,131,250)" />
      <rect x="26" y="7" width="1.02" height="1.02" fill="rgb(151,98,248)" />
      <rect x="27" y="7" width="1.02" height="1.02" fill="rgb(160,91,247)" />
      <rect x="5" y="8" width="1.02" height="1.02" fill="rgb(145,103,248)" />
      <rect x="6" y="8" width="1.02" height="1.02" fill="rgb(136,110,249)" />
      <rect x="7" y="8" width="1.02" height="1.02" fill="rgb(127,116,249)" />
      <rect x="21" y="8" width="1.02" height="1.02" fill="rgb(104,133,250)" />
      <rect x="27" y="8" width="1.02" height="1.02" fill="rgb(154,96,248)" />
      <rect x="28" y="8" width="1.02" height="1.02" fill="rgb(163,89,247)" />
      <rect x="4" y="9" width="1.02" height="1.02" fill="rgb(148,100,248)" />
      <rect x="5" y="9" width="1.02" height="1.02" fill="rgb(138,107,248)" />
      <rect x="6" y="9" width="1.02" height="1.02" fill="rgb(129,115,249)" />
      <rect x="13" y="9" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="14" y="9" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="15" y="9" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="16" y="9" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="17" y="9" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="18" y="9" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="22" y="9" width="1.02" height="1.02" fill="rgb(103,134,250)" />
      <rect x="27" y="9" width="1.02" height="1.02" fill="rgb(148,100,248)" />
      <rect x="28" y="9" width="1.02" height="1.02" fill="rgb(158,93,247)" />
      <rect x="4" y="10" width="1.02" height="1.02" fill="rgb(143,104,248)" />
      <rect x="5" y="10" width="1.02" height="1.02" fill="rgb(133,112,249)" />
      <rect x="13" y="10" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="14" y="10" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="15" y="10" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="16" y="10" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="17" y="10" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="18" y="10" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="28" y="10" width="1.02" height="1.02" fill="rgb(153,96,248)" />
      <rect x="29" y="10" width="1.02" height="1.02" fill="rgb(163,89,247)" />
      <rect x="3" y="11" width="1.02" height="1.02" fill="rgb(149,100,248)" />
      <rect x="4" y="11" width="1.02" height="1.02" fill="rgb(138,107,248)" />
      <rect x="11" y="11" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="12" y="11" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="19" y="11" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="20" y="11" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="28" y="11" width="1.02" height="1.02" fill="rgb(149,100,248)" />
      <rect x="29" y="11" width="1.02" height="1.02" fill="rgb(159,92,247)" />
      <rect x="3" y="12" width="1.02" height="1.02" fill="rgb(145,102,248)" />
      <rect x="4" y="12" width="1.02" height="1.02" fill="rgb(135,110,249)" />
      <rect x="11" y="12" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="12" y="12" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="19" y="12" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="20" y="12" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="28" y="12" width="1.02" height="1.02" fill="rgb(145,102,248)" />
      <rect x="29" y="12" width="1.02" height="1.02" fill="rgb(156,94,248)" />
      <rect x="2" y="13" width="1.02" height="1.02" fill="rgb(154,96,248)" />
      <rect x="3" y="13" width="1.02" height="1.02" fill="rgb(143,104,248)" />
      <rect x="11" y="13" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="12" y="13" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="28" y="13" width="1.02" height="1.02" fill="rgb(143,104,248)" />
      <rect x="29" y="13" width="1.02" height="1.02" fill="rgb(154,96,248)" />
      <rect x="2" y="14" width="1.02" height="1.02" fill="rgb(152,97,248)" />
      <rect x="3" y="14" width="1.02" height="1.02" fill="rgb(141,105,248)" />
      <rect x="11" y="14" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="12" y="14" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="28" y="14" width="1.02" height="1.02" fill="rgb(141,105,248)" />
      <rect x="29" y="14" width="1.02" height="1.02" fill="rgb(152,97,248)" />
      <rect x="2" y="15" width="1.02" height="1.02" fill="rgb(151,98,248)" />
      <rect x="3" y="15" width="1.02" height="1.02" fill="rgb(140,106,248)" />
      <rect x="13" y="15" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="14" y="15" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="15" y="15" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="16" y="15" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="17" y="15" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="18" y="15" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="28" y="15" width="1.02" height="1.02" fill="rgb(140,106,248)" />
      <rect x="29" y="15" width="1.02" height="1.02" fill="rgb(151,98,248)" />
      <rect x="3" y="16" width="1.02" height="1.02" fill="rgb(140,106,248)" />
      <rect x="4" y="16" width="1.02" height="1.02" fill="rgb(129,115,249)" />
      <rect x="13" y="16" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="14" y="16" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="15" y="16" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="16" y="16" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="17" y="16" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="18" y="16" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="28" y="16" width="1.02" height="1.02" fill="rgb(140,106,248)" />
      <rect x="29" y="16" width="1.02" height="1.02" fill="rgb(151,98,248)" />
      <rect x="3" y="17" width="1.02" height="1.02" fill="rgb(141,105,248)" />
      <rect x="19" y="17" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="20" y="17" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="28" y="17" width="1.02" height="1.02" fill="rgb(141,105,248)" />
      <rect x="29" y="17" width="1.02" height="1.02" fill="rgb(152,97,248)" />
      <rect x="3" y="18" width="1.02" height="1.02" fill="rgb(143,104,248)" />
      <rect x="19" y="18" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="20" y="18" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="27" y="18" width="1.02" height="1.02" fill="rgb(132,112,249)" />
      <rect x="28" y="18" width="1.02" height="1.02" fill="rgb(143,104,248)" />
      <rect x="3" y="19" width="1.02" height="1.02" fill="rgb(145,102,248)" />
      <rect x="4" y="19" width="1.02" height="1.02" fill="rgb(135,110,249)" />
      <rect x="11" y="19" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="12" y="19" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="19" y="19" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="20" y="19" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="27" y="19" width="1.02" height="1.02" fill="rgb(135,110,249)" />
      <rect x="28" y="19" width="1.02" height="1.02" fill="rgb(145,102,248)" />
      <rect x="3" y="20" width="1.02" height="1.02" fill="rgb(149,100,248)" />
      <rect x="4" y="20" width="1.02" height="1.02" fill="rgb(138,107,248)" />
      <rect x="11" y="20" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="12" y="20" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="19" y="20" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="20" y="20" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="26" y="20" width="1.02" height="1.02" fill="rgb(128,115,249)" />
      <rect x="27" y="20" width="1.02" height="1.02" fill="rgb(138,107,248)" />
      <rect x="3" y="21" width="1.02" height="1.02" fill="rgb(153,96,248)" />
      <rect x="4" y="21" width="1.02" height="1.02" fill="rgb(143,104,248)" />
      <rect x="13" y="21" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="14" y="21" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="15" y="21" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="16" y="21" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="17" y="21" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="18" y="21" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="25" y="21" width="1.02" height="1.02" fill="rgb(123,119,249)" />
      <rect x="26" y="21" width="1.02" height="1.02" fill="rgb(133,112,249)" />
      <rect x="27" y="21" width="1.02" height="1.02" fill="rgb(143,104,248)" />
      <rect x="3" y="22" width="1.02" height="1.02" fill="rgb(158,93,247)" />
      <rect x="4" y="22" width="1.02" height="1.02" fill="rgb(148,100,248)" />
      <rect x="13" y="22" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="14" y="22" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="15" y="22" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="16" y="22" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="17" y="22" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="18" y="22" width="1.02" height="1.02" fill="rgb(0,212,255)" />
      <rect x="24" y="22" width="1.02" height="1.02" fill="rgb(120,121,249)" />
      <rect x="25" y="22" width="1.02" height="1.02" fill="rgb(129,115,249)" />
      <rect x="26" y="22" width="1.02" height="1.02" fill="rgb(138,107,248)" />
      <rect x="4" y="23" width="1.02" height="1.02" fill="rgb(154,96,248)" />
      <rect x="5" y="23" width="1.02" height="1.02" fill="rgb(145,103,248)" />
      <rect x="23" y="23" width="1.02" height="1.02" fill="rgb(119,122,249)" />
      <rect x="24" y="23" width="1.02" height="1.02" fill="rgb(127,116,249)" />
      <rect x="25" y="23" width="1.02" height="1.02" fill="rgb(136,110,249)" />
      <rect x="4" y="24" width="1.02" height="1.02" fill="rgb(160,91,247)" />
      <rect x="5" y="24" width="1.02" height="1.02" fill="rgb(151,98,248)" />
      <rect x="12" y="24" width="1.02" height="1.02" fill="rgb(103,134,250)" />
      <rect x="21" y="24" width="1.02" height="1.02" fill="rgb(113,126,250)" />
      <rect x="22" y="24" width="1.02" height="1.02" fill="rgb(120,121,249)" />
      <rect x="23" y="24" width="1.02" height="1.02" fill="rgb(127,116,249)" />
      <rect x="24" y="24" width="1.02" height="1.02" fill="rgb(135,110,249)" />
      <rect x="5" y="25" width="1.02" height="1.02" fill="rgb(159,92,247)" />
      <rect x="6" y="25" width="1.02" height="1.02" fill="rgb(150,98,248)" />
      <rect x="13" y="25" width="1.02" height="1.02" fill="rgb(110,129,250)" />
      <rect x="14" y="25" width="1.02" height="1.02" fill="rgb(108,131,250)" />
      <rect x="15" y="25" width="1.02" height="1.02" fill="rgb(107,131,250)" />
      <rect x="16" y="25" width="1.02" height="1.02" fill="rgb(107,131,250)" />
      <rect x="17" y="25" width="1.02" height="1.02" fill="rgb(108,131,250)" />
      <rect x="18" y="25" width="1.02" height="1.02" fill="rgb(110,129,250)" />
      <rect x="19" y="25" width="1.02" height="1.02" fill="rgb(113,126,250)" />
      <rect x="20" y="25" width="1.02" height="1.02" fill="rgb(118,123,249)" />
      <rect x="21" y="25" width="1.02" height="1.02" fill="rgb(123,119,249)" />
      <rect x="22" y="25" width="1.02" height="1.02" fill="rgb(129,115,249)" />
      <rect x="6" y="26" width="1.02" height="1.02" fill="rgb(159,92,247)" />
      <rect x="7" y="26" width="1.02" height="1.02" fill="rgb(151,98,248)" />
      <rect x="16" y="26" width="1.02" height="1.02" fill="rgb(118,123,249)" />
      <rect x="17" y="26" width="1.02" height="1.02" fill="rgb(119,122,249)" />
      <rect x="18" y="26" width="1.02" height="1.02" fill="rgb(121,121,249)" />
      <rect x="19" y="26" width="1.02" height="1.02" fill="rgb(124,118,249)" />
      <rect x="20" y="26" width="1.02" height="1.02" fill="rgb(128,115,249)" />
      <rect x="7" y="27" width="1.02" height="1.02" fill="rgb(160,91,247)" />
      <rect x="8" y="27" width="1.02" height="1.02" fill="rgb(154,96,248)" />
      <rect x="8" y="28" width="1.02" height="1.02" fill="rgb(163,89,247)" />
      <rect x="9" y="28" width="1.02" height="1.02" fill="rgb(158,93,247)" />
      <rect x="10" y="29" width="1.02" height="1.02" fill="rgb(163,89,247)" />
      <rect x="11" y="29" width="1.02" height="1.02" fill="rgb(159,92,247)" />
      <rect x="14" y="30" width="1.02" height="1.02" fill="rgb(163,89,247)" />
    </svg>
  );
}
