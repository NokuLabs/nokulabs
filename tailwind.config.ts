import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        surface: '#141414',
        border: '#2A2A2A',
        primary: '#FFFFFF',
        secondary: '#A0A0A0',
        muted: '#8A8A8A', // ✅ boosted for contrast
        accent: '#F5F5F5',
      },
      fontFamily: {
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        'h1-desktop': ['56px', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        'h1-mobile': ['36px', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
        'h2-desktop': ['40px', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        'h2-mobile': ['28px', { lineHeight: '1.3', letterSpacing: '-0.015em' }],
        'h3-desktop': ['28px', { lineHeight: '1.3', letterSpacing: '-0.015em' }],
        'h3-mobile': ['22px', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        h4: ['20px', { lineHeight: '1.4', letterSpacing: '0' }],
        'body-lg': ['18px', { lineHeight: '1.7', letterSpacing: '0' }],
        body: ['16px', { lineHeight: '1.7', letterSpacing: '0' }],
        small: ['14px', { lineHeight: '1.6', letterSpacing: '0' }],
      },
      spacing: {
        'section-mobile': '96px',
        'section-desktop': '128px',
      },
      maxWidth: {
        content: '1200px',
        text: '720px',
      },
      borderRadius: {
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}

export default config