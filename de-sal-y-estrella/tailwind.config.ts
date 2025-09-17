import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
            // --- INICIO DE LA CORRECCIÓN ---
            // Esta regla es más robusta. Aplica un margen superior a todos los
            // elementos de bloque (párrafos, listas, etc.) dentro del contenido...
            ':where(.prose > *)': {
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.6'),
            },
            // ...y luego elimina el margen superior del primer elemento para
            // evitar un espacio extra al inicio del texto.
            ':where(.prose > :first-child)': {
              marginTop: '0',
            },
            ':where(.prose > :last-child)': {
              marginBottom: '0',
            },
            // --- FIN DE LA CORRECCIÓN ---
            'h2': {
              fontSize: theme('fontSize.xl'),
              fontWeight: '400',
              color: theme('colors.gray.600'),
            },
            '.dark &': {
              'h2': {
                color: theme('colors.gray.300'),
              },
            },
          },
        },
      }),
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;

