import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import AnalyticsListener from '@/components/AnalyticsListener'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site'
import Footer from '@/components/Footer'
import WhatsAppWidget from '@/components/WhatsAppWidget'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans'
})
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'De Sal y Estrella · Departamentos frente al mar en La Serena y cabaña en Pichilemu',
    template: '%s · De Sal y Estrella',
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.jpg'] },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased text-ink dark:text-ink-dark bg-salt dark:bg-gray-900 selection:bg-gold-300/40 selection:text-navy-950">
        <Header />
        <main className="flex-grow">{children}</main>
        <WhatsAppWidget />
        <Footer />
        <AnalyticsListener />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-84W0J5FR36" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-84W0J5FR36');
          `}
        </Script>
      </body>
    </html>
  )
}

