import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'serif']
      },
      fontSize: {
        hero: ['clamp(2.75rem,6vw,4.2rem)', { lineHeight: '1.04', letterSpacing: '-0.025em' }],
        h2: ['clamp(2rem,3.2vw,2.6rem)', { lineHeight: '1.12', letterSpacing: '-0.018em' }],
        h3: ['clamp(1.4rem,2.2vw,1.75rem)', { lineHeight: '1.22', letterSpacing: '-0.01em' }],
        'copy-lg': ['1.07rem', { lineHeight: '1.55' }],
        'copy-sm': ['0.82rem', { lineHeight: '1.45', letterSpacing: '0.006em' }]
      },
      colors: {
        ink: {
          DEFAULT: '#1d1f20',
          subtle: '#4b4f52',
          faint: '#6d7276'
        },
        'ink-dark': {
          DEFAULT: '#e8e9ea',
          subtle: '#b9bcc0',
          faint: '#8e949a'
        },
        sand: {
          50: '#fdfcf8',
          100: '#f9f7ef',
          200: '#f0ebd8',
          300: '#e5dbba',
          400: '#d6c694',
          500: '#c6ad71',
          600: '#a88d57',
          700: '#866e44',
          800: '#6f5a3c',
          900: '#5c4b35',
        },
        ocean: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        }
      }
    }
  },
  plugins: [typography],
};
export default config;

