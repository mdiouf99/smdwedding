/**
 * RealisticFlowers — sprite-style SVG roses with radial gradients for depth.
 * Renders <defs> with several reusable symbols and gradient definitions. Symbols
 * are pulled in elsewhere via <use href="#realistic-rose-*" />.
 *
 * The "3D" feeling comes from:
 *   - radial gradients on each petal (highlight + shadow)
 *   - a soft drop-shadow filter applied to the whole bloom
 *   - layered petals (lighter at center, darker at edges)
 */
export default function RealisticFlowers() {
  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      aria-hidden="true"
    >
      <defs>
        {/* Soft drop shadow filter — used to lift blooms off the page */}
        <filter
          id="rose-shadow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" />
          <feOffset dx="0" dy="3" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.45" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Ivory / blush rose petal — pearly tones */}
        <radialGradient id="rose-petal-ivory" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FFFCF6" />
          <stop offset="40%" stopColor="#F2E2D0" />
          <stop offset="80%" stopColor="#D8B89A" />
          <stop offset="100%" stopColor="#A87C58" />
        </radialGradient>

        {/* Champagne rose petal — gold-tinged cream */}
        <radialGradient id="rose-petal-champagne" cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FBF1DD" />
          <stop offset="45%" stopColor="#E4C896" />
          <stop offset="85%" stopColor="#B89060" />
          <stop offset="100%" stopColor="#7E5A2E" />
        </radialGradient>

        {/* Deep burgundy petal — for occasional accent flowers */}
        <radialGradient id="rose-petal-burgundy" cx="35%" cy="28%" r="80%">
          <stop offset="0%" stopColor="#A65060" />
          <stop offset="50%" stopColor="#762038" />
          <stop offset="100%" stopColor="#360812" />
        </radialGradient>

        {/* Leaf gradients */}
        <radialGradient id="leaf-eucalyptus" cx="30%" cy="30%" r="90%">
          <stop offset="0%" stopColor="#B8C5A6" />
          <stop offset="60%" stopColor="#7E8F6C" />
          <stop offset="100%" stopColor="#4A5639" />
        </radialGradient>

        <radialGradient id="leaf-olive" cx="30%" cy="30%" r="90%">
          <stop offset="0%" stopColor="#A9A370" />
          <stop offset="60%" stopColor="#7A7448" />
          <stop offset="100%" stopColor="#3F3A1F" />
        </radialGradient>

        {/* Stem / branch */}
        <linearGradient id="stem-brown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6B533A" />
          <stop offset="100%" stopColor="#3A2A1A" />
        </linearGradient>

        {/* ─────────────────────────── ROSE BLOOM (single) ─────────────────────────── */}
        <symbol id="realistic-rose-ivory" viewBox="0 0 160 160">
          <g filter="url(#rose-shadow)">
            {/* Outer petals — large, dark edge */}
            <path
              d="M80 138 C 38 134 14 102 22 64 C 30 38 56 22 80 26 C 104 22 130 38 138 64 C 146 102 122 134 80 138 Z"
              fill="url(#rose-petal-ivory)"
              opacity="0.95"
            />
            {/* Mid layer — slightly lighter */}
            <path
              d="M80 118 C 50 116 34 96 40 70 C 46 50 62 40 80 44 C 98 40 114 50 120 70 C 126 96 110 116 80 118 Z"
              fill="url(#rose-petal-ivory)"
              opacity="0.9"
            />
            {/* Inner whorl */}
            <path
              d="M80 100 C 60 98 50 86 54 70 C 58 58 68 52 80 56 C 92 52 102 58 106 70 C 110 86 100 98 80 100 Z"
              fill="url(#rose-petal-ivory)"
              opacity="0.92"
            />
            {/* Central curled petals */}
            <path
              d="M80 86 C 70 86 64 80 66 70 C 70 64 76 62 80 66 C 84 62 90 64 94 70 C 96 80 90 86 80 86 Z"
              fill="url(#rose-petal-ivory)"
            />
            <path
              d="M80 76 C 75 76 72 73 73 68 C 75 65 78 64 80 66 C 82 64 85 65 87 68 C 88 73 85 76 80 76 Z"
              fill="#FFFCF6"
              opacity="0.7"
            />
            {/* Tiny highlight on the bud */}
            <ellipse cx="76" cy="68" rx="2.2" ry="1.4" fill="#FFFEF8" opacity="0.85" />
          </g>
        </symbol>

        {/* ─────────────────────────── ROSE BLOOM (champagne / gold) ─────────────────────────── */}
        <symbol id="realistic-rose-champagne" viewBox="0 0 160 160">
          <g filter="url(#rose-shadow)">
            <path
              d="M80 138 C 38 134 14 102 22 64 C 30 38 56 22 80 26 C 104 22 130 38 138 64 C 146 102 122 134 80 138 Z"
              fill="url(#rose-petal-champagne)"
              opacity="0.95"
            />
            <path
              d="M80 118 C 50 116 34 96 40 70 C 46 50 62 40 80 44 C 98 40 114 50 120 70 C 126 96 110 116 80 118 Z"
              fill="url(#rose-petal-champagne)"
              opacity="0.9"
            />
            <path
              d="M80 100 C 60 98 50 86 54 70 C 58 58 68 52 80 56 C 92 52 102 58 106 70 C 110 86 100 98 80 100 Z"
              fill="url(#rose-petal-champagne)"
              opacity="0.92"
            />
            <path
              d="M80 86 C 70 86 64 80 66 70 C 70 64 76 62 80 66 C 84 62 90 64 94 70 C 96 80 90 86 80 86 Z"
              fill="url(#rose-petal-champagne)"
            />
            <path
              d="M80 76 C 75 76 72 73 73 68 C 75 65 78 64 80 66 C 82 64 85 65 87 68 C 88 73 85 76 80 76 Z"
              fill="#FBF1DD"
              opacity="0.75"
            />
            <ellipse cx="76" cy="68" rx="2.2" ry="1.4" fill="#FFFAEC" opacity="0.85" />
          </g>
        </symbol>

        {/* ─────────────────────────── EUCALYPTUS BRANCH ─────────────────────────── */}
        <symbol id="realistic-eucalyptus" viewBox="0 0 200 80">
          <g filter="url(#rose-shadow)">
            <path d="M2 40 C 60 40 130 38 196 36" stroke="url(#stem-brown)" strokeWidth="1.4" fill="none" />
            {/* leaf pairs along the stem */}
            <g>
              <ellipse cx="22" cy="30" rx="10" ry="5" transform="rotate(-25 22 30)" fill="url(#leaf-eucalyptus)" />
              <ellipse cx="22" cy="50" rx="10" ry="5" transform="rotate(25 22 50)" fill="url(#leaf-eucalyptus)" />
            </g>
            <g>
              <ellipse cx="58" cy="28" rx="11" ry="5.5" transform="rotate(-22 58 28)" fill="url(#leaf-eucalyptus)" />
              <ellipse cx="58" cy="52" rx="11" ry="5.5" transform="rotate(22 58 52)" fill="url(#leaf-eucalyptus)" />
            </g>
            <g>
              <ellipse cx="98" cy="26" rx="12" ry="6" transform="rotate(-20 98 26)" fill="url(#leaf-eucalyptus)" />
              <ellipse cx="98" cy="54" rx="12" ry="6" transform="rotate(20 98 54)" fill="url(#leaf-eucalyptus)" />
            </g>
            <g>
              <ellipse cx="138" cy="28" rx="11" ry="5.5" transform="rotate(-22 138 28)" fill="url(#leaf-eucalyptus)" />
              <ellipse cx="138" cy="52" rx="11" ry="5.5" transform="rotate(22 138 52)" fill="url(#leaf-eucalyptus)" />
            </g>
            <g>
              <ellipse cx="172" cy="32" rx="9" ry="4.5" transform="rotate(-25 172 32)" fill="url(#leaf-eucalyptus)" />
              <ellipse cx="172" cy="48" rx="9" ry="4.5" transform="rotate(25 172 48)" fill="url(#leaf-eucalyptus)" />
            </g>
            <ellipse cx="194" cy="38" rx="6" ry="3" transform="rotate(-15 194 38)" fill="url(#leaf-eucalyptus)" />
          </g>
        </symbol>

        {/* ─────────────────────────── BOUQUET (corner composition) ─────────────────────────── */}
        <symbol id="realistic-bouquet" viewBox="0 0 320 320">
          <g>
            {/* leaves behind, fanned out */}
            <g transform="rotate(-30 110 200) translate(0 130)">
              <use href="#realistic-eucalyptus" />
            </g>
            <g transform="rotate(15 200 180) translate(40 110)">
              <use href="#realistic-eucalyptus" />
            </g>
            <g transform="rotate(-55 90 130) translate(-30 90)">
              <use href="#realistic-eucalyptus" />
            </g>
            <g transform="rotate(40 240 110) translate(60 50)">
              <use href="#realistic-eucalyptus" />
            </g>

            {/* roses in front, layered */}
            <g transform="translate(70 100) scale(0.85)">
              <use href="#realistic-rose-ivory" />
            </g>
            <g transform="translate(140 70) scale(1.0)">
              <use href="#realistic-rose-champagne" />
            </g>
            <g transform="translate(40 170) scale(0.7)">
              <use href="#realistic-rose-champagne" />
            </g>
            <g transform="translate(180 160) scale(0.75)">
              <use href="#realistic-rose-ivory" />
            </g>
            <g transform="translate(110 180) scale(0.55)">
              <use href="#realistic-rose-ivory" />
            </g>
          </g>
        </symbol>

        {/* ─────────────────────────── SMALL ACCENT (above-text decoration) ─────────────────────────── */}
        <symbol id="realistic-rose-pair" viewBox="0 0 280 100">
          <g>
            <g transform="translate(60 -10) scale(0.55) rotate(-15 80 80)">
              <use href="#realistic-eucalyptus" />
            </g>
            <g transform="translate(120 -10) scale(0.55) rotate(15 80 80)">
              <use href="#realistic-eucalyptus" />
            </g>
            <g transform="translate(60 0) scale(0.6)">
              <use href="#realistic-rose-ivory" />
            </g>
            <g transform="translate(130 -10) scale(0.7)">
              <use href="#realistic-rose-champagne" />
            </g>
            <g transform="translate(180 0) scale(0.55)">
              <use href="#realistic-rose-ivory" />
            </g>
          </g>
        </symbol>
      </defs>
    </svg>
  );
}
