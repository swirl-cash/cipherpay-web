export function WalletMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Wallet"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id="wallet-mark-body" x1="12" y1="12" x2="54" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#A855F7" />
          <stop offset="0.48" stopColor="#7180FF" />
          <stop offset="1" stopColor="#00D4FF" />
        </linearGradient>
        <linearGradient id="wallet-mark-card" x1="24" y1="8" x2="44" y2="29" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#DDFBFF" />
          <stop offset="0.45" stopColor="#67E8F9" />
          <stop offset="1" stopColor="#818CF8" />
        </linearGradient>
        <linearGradient id="wallet-mark-clasp" x1="39" y1="29" x2="54" y2="41" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#A855F7" />
          <stop offset="1" stopColor="#00D4FF" />
        </linearGradient>
      </defs>

      <rect x="23" y="7" width="25" height="34" rx="5" transform="rotate(10 35.5 24)" fill="url(#wallet-mark-card)" fillOpacity="0.22" stroke="url(#wallet-mark-card)" strokeWidth="1.6" />
      <path d="M29 14L43 17" stroke="url(#wallet-mark-card)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M12 21C12 16.6 15.6 13 20 13H43C48 13 52 17 52 22V46C52 51 48 55 43 55H20C15.6 55 12 51.4 12 47V21Z" fill="url(#wallet-mark-body)" fillOpacity="0.13" stroke="url(#wallet-mark-body)" strokeWidth="2.4" />
      <path d="M13 22H51" stroke="url(#wallet-mark-body)" strokeWidth="1.7" strokeOpacity="0.65" />
      <path d="M41 29H51C53.2 29 55 30.8 55 33V38C55 40.2 53.2 42 51 42H41C37.4 42 34.5 39.1 34.5 35.5C34.5 31.9 37.4 29 41 29Z" fill="url(#wallet-mark-clasp)" fillOpacity="0.18" stroke="url(#wallet-mark-clasp)" strokeWidth="2" />
      <circle cx="42.5" cy="35.5" r="2.4" fill="#77F2FF" />
      <path d="M19 47H28" stroke="url(#wallet-mark-body)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.65" />
      <rect x="49" y="10" width="3" height="3" rx="0.5" fill="#A855F7" />
      <rect x="54" y="15" width="2" height="2" rx="0.4" fill="#00D4FF" />
    </svg>
  );
}
