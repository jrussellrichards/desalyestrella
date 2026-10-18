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
        display: ['var(--font-display)', 'system-ui', 'sans-serif']
      },
      fontSize: {
        hero: ['clamp(2.75rem,6vw,4.2rem)', { lineHeight: '1.04', letterSpacing: '-0.025em' }],
        h1: ['clamp(2.25rem,4.2vw,3.25rem)', { lineHeight: '1.08', letterSpacing: '-0.02em' }],
        h2: ['clamp(2rem,3.2vw,2.6rem)', { lineHeight: '1.12', letterSpacing: '-0.018em' }],
        h3: ['clamp(1.4rem,2.2vw,1.75rem)', { lineHeight: '1.22', letterSpacing: '-0.01em' }],
        'copy-lg': ['1.07rem', { lineHeight: '1.55' }],
        'copy-sm': ['0.82rem', { lineHeight: '1.45', letterSpacing: '0.006em' }]
      },
      colors: {
        // Marca (logo navy + dorado, octubre 2026)
        navy: {
          50: '#eef0f8',
          100: '#d9ddef',
          200: '#b3badf',
          300: '#8690c7',
          400: '#5a64a8',
          500: '#3b4488',
          600: '#2a3270',
          700: '#212859',
          800: '#1c2150',
          900: '#181b46',
          950: '#10122f',
        },
        gold: {
          50: '#fbf7f0',
          100: '#f5ecdc',
          200: '#ebd8b8',
          300: '#dfc093',
          400: '#d4ac78',
          500: '#c9a06a',
          600: '#b08550',
          700: '#8d6a3f',
          800: '#6e5232',
          900: '#523d26',
        },
        // Turquesa de mar: acento vivo para botones, etiquetas e íconos
        sea: {
          50: '#ecfbfd',
          100: '#cff4f8',
          200: '#a2e8f0',
          300: '#63d5e3',
          400: '#22bccf',
          500: '#06a2b6',
          600: '#068299',
          700: '#0b687c',
          800: '#115566',
          900: '#134756',
        },
        // Base blanca y luminosa
        salt: '#FFFFFF',
        // Grises limpios (slate)
        gray: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        ink: {
          DEFAULT: '#14193a',
          subtle: '#475569',
          faint: '#64748b'
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
          // Alias del azul de marca (antes celeste genérico)
          50: '#eef0f8',
          100: '#d9ddef',
          200: '#b3badf',
          300: '#8690c7',
          400: '#5a64a8',
          500: '#3b4488',
          600: '#2a3270',
          700: '#212859',
          800: '#1c2150',
          900: '#181b46',
        }
      }
    }
  },
  plugins: [typography],
};
export default config;

