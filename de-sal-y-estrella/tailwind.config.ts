import type { Config } from "tailwindcss";

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
        hero: ['clamp(2.4rem,5vw,3.4rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        h2: ['clamp(1.85rem,3.2vw,2.4rem)', { lineHeight: '1.12', letterSpacing: '-0.015em' }],
        h3: ['clamp(1.35rem,2.2vw,1.65rem)', { lineHeight: '1.2' }],
        'copy-lg': ['1.0625rem', { lineHeight: '1.55' }]
      }
    }
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;

