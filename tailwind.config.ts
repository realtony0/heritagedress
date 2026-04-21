import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        noir: 'rgb(var(--color-noir) / <alpha-value>)',
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        ivory: 'rgb(var(--color-ivory) / <alpha-value>)',
        bone: 'rgb(var(--color-bone) / <alpha-value>)',
        sand: 'rgb(var(--color-sand) / <alpha-value>)',
        gold: 'rgb(var(--color-gold) / <alpha-value>)',
        terracotta: 'rgb(var(--color-terracotta) / <alpha-value>)',
        rust: 'rgb(var(--color-rust) / <alpha-value>)',
        clay: 'rgb(var(--color-clay) / <alpha-value>)',
        stone: 'rgb(var(--color-stone) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      fontSize: {
        'display-xs': ['2.25rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-sm': ['3rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display-md': ['4.5rem', { lineHeight: '0.96', letterSpacing: '-0.025em' }],
        'display-lg': ['6.25rem', { lineHeight: '0.92', letterSpacing: '-0.03em' }],
        'display-xl': ['9rem', { lineHeight: '0.88', letterSpacing: '-0.035em' }],
        'display-2xl': ['13rem', { lineHeight: '0.84', letterSpacing: '-0.04em' }],
      },
      boxShadow: {
        soft: '0 40px 120px -60px rgb(24 21 18 / 0.38)',
        card: '0 22px 60px -32px rgb(24 21 18 / 0.25)',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
