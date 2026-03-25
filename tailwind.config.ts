import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Wire Next.js font variables into Tailwind utilities
      fontFamily: {
        terminal: ['var(--font-terminal)', 'Courier New', 'monospace'],
        heading:  ['var(--font-heading)',  'Arial',       'sans-serif'],
        body:     ['var(--font-body)',     'Arial',       'sans-serif'],
      },
      colors: {
        phosphor: {
          DEFAULT: '#00ff41',
          dim:     '#00cc35',
          dark:    '#007a1e',
        },
        accent: {
          DEFAULT: '#e8ff47',
          dim:     '#c8dc30',
        },
        // Dark palette aliases
        surface:  '#111111',
        elevated: '#1a1a1a',
        border:   '#242424',
      },
      animation: {
        'cursor-blink': 'cursor-blink 0.75s step-end infinite',
        'crt-flicker':  'crt-flicker 9s ease-in-out infinite',
      },
      keyframes: {
        'cursor-blink': {
          '0%, 49%':  { opacity: '1' },
          '50%, 100%':{ opacity: '0' },
        },
        'crt-flicker': {
          '0%, 88%, 90%, 93%, 100%': { opacity: '1' },
          '89%, 94%':                { opacity: '0.96' },
        },
      },
    },
  },
  plugins: [],
}

export default config
