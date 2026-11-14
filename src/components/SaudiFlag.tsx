interface SaudiFlagProps {
  className?: string;
}

export function SaudiFlag({ className = 'w-6 h-4' }: SaudiFlagProps) {
  return (
    <svg
      viewBox="0 0 90 60"
      className={`rounded-[2px] border border-black/15 shrink-0 ${className}`}
      role="img"
      aria-label="علم المملكة العربية السعودية"
    >
      <rect width="90" height="60" fill="#006C35" />
      {/* Stylized crisp white Shahada calligraphy bar & sword */}
      <g fill="#FFFFFF">
        {/* Calligraphic stroke line */}
        <path d="M 20 20 Q 28 16 36 20 T 52 19 T 68 20 Q 72 22 68 24 L 22 24 Q 18 22 20 20 Z" />
        <path d="M 26 14 L 30 14 L 30 22 L 26 22 Z M 38 13 L 41 13 L 41 22 L 38 22 Z M 48 14 L 51 14 L 51 22 L 48 22 Z M 58 13 L 61 13 L 61 22 L 58 22 Z" />
        <path d="M 24 27 Q 45 25 66 27 Q 68 29 65 30 Q 45 29 25 30 Q 22 29 24 27 Z" />
        {/* Sword (blade + hilt pointing left) */}
        <path d="M 21 40 L 62 40 L 65 38 L 65 44 L 62 42 L 21 42 L 17 41 Z" />
        <rect x="61" y="35" width="2.5" height="12" rx="1" />
        <circle cx="67.5" cy="41" r="2" />
      </g>
    </svg>
  );
}
