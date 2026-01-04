import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans'
})
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  axes: ['SOFT','WONK'], // ignorado si no soportado
})

export const metadata: Metadata = {
  title: 'De Sal y Estrella',
  description: 'Refugios únicos donde el océano se encuentra con el cosmos.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased text-ink dark:text-ink-dark bg-white dark:bg-gray-900 selection:bg-amber-300/30 selection:text-ink-dark">
        {children}
      </body>
    </html>
  )
}

