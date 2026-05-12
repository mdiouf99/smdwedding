export default function FloralSprite() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      aria-hidden="true"
    >
      <defs>
        <symbol id="floral-spray" viewBox="0 0 200 240">
          <g fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
            <path d="M100 240 C100 200 100 160 100 110" />
            <path d="M100 200 C 78 188 60 178 44 168" />
            <path d="M100 180 C 122 168 138 158 154 148" />
            <path d="M100 150 C 80 138 64 132 50 124" />
            <path d="M100 130 C 122 122 134 116 148 110" />
          </g>
          <g fill="currentColor" opacity="0.92">
            <path d="M100 110 C 92 96 92 80 100 70 C 108 80 108 96 100 110 Z" />
            <path d="M100 110 C 86 110 74 100 70 88 C 84 88 96 96 100 110 Z" />
            <path d="M100 110 C 114 110 126 100 130 88 C 116 88 104 96 100 110 Z" />
            <path d="M100 110 C 92 122 92 134 100 142 C 108 134 108 122 100 110 Z" />
            <circle cx="100" cy="106" r="3.2" fill="#0F0D0B" />
            <circle cx="44" cy="168" r="5" />
            <circle cx="154" cy="148" r="5" />
            <circle cx="50" cy="124" r="3.5" />
            <circle cx="148" cy="110" r="3.5" />
          </g>
          <g fill="currentColor" opacity="0.7">
            <ellipse cx="78" cy="190" rx="9" ry="4" transform="rotate(-30 78 190)" />
            <ellipse cx="124" cy="172" rx="9" ry="4" transform="rotate(28 124 172)" />
            <ellipse cx="74" cy="138" rx="7" ry="3" transform="rotate(-22 74 138)" />
            <ellipse cx="126" cy="120" rx="7" ry="3" transform="rotate(22 126 120)" />
          </g>
        </symbol>

        <symbol id="floral-divider" viewBox="0 0 240 40">
          <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
            <path d="M0 20 L92 20" />
            <path d="M148 20 L240 20" />
            <path d="M108 20 C 112 14 116 14 120 20 C 124 26 128 26 132 20" />
            <path d="M92 20 C 88 14 84 12 80 14" />
            <path d="M148 20 C 152 14 156 12 160 14" />
          </g>
          <g fill="currentColor">
            <circle cx="120" cy="20" r="2.6" />
            <path d="M120 14 C 117 10 117 6 120 4 C 123 6 123 10 120 14 Z" opacity="0.9" />
            <path d="M120 26 C 117 30 117 34 120 36 C 123 34 123 30 120 26 Z" opacity="0.9" />
            <ellipse cx="100" cy="20" rx="3" ry="1.2" />
            <ellipse cx="140" cy="20" rx="3" ry="1.2" />
          </g>
        </symbol>

        <symbol id="floral-corner" viewBox="0 0 120 120">
          <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
            <path d="M0 0 C 30 8 60 30 78 60 C 90 80 102 96 118 110" />
            <path d="M30 18 C 22 32 18 46 22 60" />
            <path d="M58 38 C 70 36 82 38 92 46" />
            <path d="M70 70 C 60 78 52 88 50 100" />
          </g>
          <g fill="currentColor">
            <circle cx="22" cy="60" r="3" />
            <circle cx="92" cy="46" r="3" />
            <circle cx="50" cy="100" r="3" />
            <path d="M40 28 C 36 22 36 16 40 12 C 44 16 44 22 40 28 Z" opacity="0.85" />
            <path d="M78 56 C 82 50 88 48 92 50 C 90 56 84 58 78 56 Z" opacity="0.85" />
            <ellipse cx="62" cy="78" rx="5" ry="2" transform="rotate(-30 62 78)" opacity="0.7" />
          </g>
        </symbol>
      </defs>
    </svg>
  );
}
