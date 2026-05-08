import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Beige / noir / doré palette
        beige: '#F5EFE4',
        'beige-deep': '#EAE0CC',
        'beige-soft': '#FBF7EE',
        ink: '#1A1714',
        'ink-soft': '#5C4A2E',
        gold: '#B8935A',
        'gold-light': '#D4B675',
        'gold-deep': '#8A6A2E',
        'gold-line': '#E0CFA8',
        // Legacy aliases kept so untouched components don't break
        cream: '#F5EFE4',
        dark: '#1A1714',
      },
      fontFamily: {
        display: ['var(--font-italiana)', 'Italiana', 'serif'],
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
      },
      letterSpacing: {
        display: '0.04em',
        eyebrow: '0.5em',
        wide2: '0.18em',
        widest: '0.4em',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 1.4s ease forwards',
        'soft-pulse': 'soft-pulse 3s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
