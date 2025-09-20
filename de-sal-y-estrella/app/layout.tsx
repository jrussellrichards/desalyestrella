import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import { fetchSettings } from '@/lib/settings'
import { urlFor } from '@/lib/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await fetchSettings()
  const logoUrl = settings.siteLogo ? urlFor(settings.siteLogo).width(320).fit('max').auto('format').url() : null

  return (
    <html lang="es" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="font-sans antialiased text-ink dark:text-ink-dark bg-white dark:bg-gray-900 selection:bg-amber-300/30 selection:text-ink-dark">
        <Header logoUrl={logoUrl} logoAlt={settings.siteLogo?.alt || null} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

