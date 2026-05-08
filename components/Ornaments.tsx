export function FloralCorner({
  className = '',
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ transform: flip ? 'scaleX(-1) scaleY(-1)' : undefined }}
      aria-hidden="true"
    >
      <g stroke="#C9A84C" strokeWidth="1.1" strokeLinecap="round" fill="none">
        <path d="M10 10 C 60 30, 90 70, 110 130" />
        <path d="M10 10 C 40 60, 80 80, 140 90" />
        <path d="M10 10 C 30 50, 60 70, 90 80" />
        <path d="M40 50 C 60 40, 80 50, 90 70" />
        <path d="M70 90 C 90 80, 110 90, 120 110" />
        <path d="M100 130 C 120 120, 140 130, 150 150" />
      </g>
      <g fill="#C9A84C" opacity="0.85">
        <circle cx="40" cy="50" r="3.2" />
        <circle cx="75" cy="80" r="3" />
        <circle cx="115" cy="125" r="3.4" />
        <circle cx="145" cy="155" r="3" />
        <circle cx="22" cy="22" r="2.4" />
      </g>
      <g stroke="#E8D5A3" strokeWidth="0.9" fill="none">
        <path d="M55 35 C 70 30, 80 40, 78 55 C 70 60, 58 55, 55 35 Z" />
        <path d="M95 70 C 115 65, 122 85, 110 100 C 95 100, 88 85, 95 70 Z" />
        <path d="M135 110 C 155 105, 165 130, 150 145 C 135 145, 125 125, 135 110 Z" />
      </g>
    </svg>
  );
}

export function GoldRings({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 100"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E8D5A3" />
          <stop offset="50%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#E8D5A3" />
        </linearGradient>
      </defs>
      <circle cx="80" cy="50" r="28" fill="none" stroke="url(#goldGrad)" strokeWidth="3" />
      <circle cx="115" cy="50" r="28" fill="none" stroke="url(#goldGrad)" strokeWidth="3" />
      <path d="M80 22 L82 18 L84 22" fill="#C9A84C" />
      <path d="M115 22 L117 18 L119 22" fill="#C9A84C" />
    </svg>
  );
}

export function Divider({ icon = '✦' }: { icon?: string }) {
  return (
    <div className="gold-divider">
      <span className="gold-divider-icon font-serif text-xl">{icon}</span>
    </div>
  );
}

export function ScheduleIcon({ name }: { name: string }) {
  const props = {
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: '#C9A84C',
    strokeWidth: 1.2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'w-7 h-7',
  };
  switch (name) {
    case 'rings':
      return (
        <svg {...props}>
          <circle cx="19" cy="28" r="9" />
          <circle cx="29" cy="28" r="9" />
          <path d="M19 19l1-3 1 3M29 19l1-3 1 3" />
        </svg>
      );
    case 'glass':
      return (
        <svg {...props}>
          <path d="M16 8h16l-2 14a6 6 0 0 1-12 0L16 8z" />
          <path d="M24 28v10M18 40h12" />
        </svg>
      );
    case 'cutlery':
      return (
        <svg {...props}>
          <path d="M14 8v32M10 8v8a4 4 0 0 0 8 0V8" />
          <path d="M30 8c4 0 6 4 6 8s-2 6-3 6v18M30 8v14" />
        </svg>
      );
    case 'music':
      return (
        <svg {...props}>
          <path d="M20 32V12l16-3v20" />
          <circle cx="16" cy="34" r="4" />
          <circle cx="32" cy="29" r="4" />
        </svg>
      );
    default:
      return null;
  }
}

export function HeartIcon({ filled = false, className = '' }: { filled?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? '#C9A84C' : 'none'}
      stroke="#C9A84C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" />
    </svg>
  );
}
