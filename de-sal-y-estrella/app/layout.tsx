import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header' // Importamos el Header
import Footer from '@/components/Footer' // Importamos el Footer

const inter = Inter({ subsets: ['latin'] })

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
    <html lang="es">
      <body className={`${inter.className} bg-white dark:bg-gray-900`}>
        <Header />
        <main>{children}</main> {/* {children} es el contenido de cada página */}
        <Footer />
      </body>
    </html>
  )
}
