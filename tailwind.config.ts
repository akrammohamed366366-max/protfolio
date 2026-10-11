import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: 'var(--color-brand-navy)',
          'navy-dark': 'var(--color-brand-navy-dark)',
          cyan: 'var(--color-brand-cyan)',
          'cyan-hover': 'var(--color-brand-cyan-hover)',
          'cyan-soft': 'var(--color-brand-cyan-soft)',
          bg: 'var(--color-brand-bg)',
          card: 'var(--color-brand-card)',
          muted: 'var(--color-brand-muted)',
          'muted-light': 'var(--color-brand-muted-light)',
          border: 'var(--color-brand-border)',
          'border-dark': 'var(--color-brand-border-dark)',
          chip: 'var(--color-brand-chip)',
          'chip-hover': 'var(--color-brand-chip-hover)',
          white: 'var(--color-brand-white)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)'],
        arabic: ['var(--font-arabic)'],
        mono: ['var(--font-mono)'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        full: 'var(--radius-full)',
      },
      boxShadow: {
        'brand-sm': 'var(--shadow-brand-sm)',
        'brand-md': 'var(--shadow-brand-md)',
        'brand-lg': 'var(--shadow-brand-lg)',
        'brand-xl': 'var(--shadow-brand-xl)',
        card: 'var(--shadow-card)',
      },
      spacing: {
        'section-y': 'var(--spacing-section-y)',
        'section-y-mobile': 'var(--spacing-section-y-mobile)',
        'container-x': 'var(--spacing-container-x)',
      },
    },
  },
  plugins: [],
};

export default config;
