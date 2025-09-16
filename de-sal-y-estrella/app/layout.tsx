import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
      {/* CAMBIOS CLAVE:
        - flex flex-col: Convierte el body en un contenedor flexible vertical.
        - min-h-screen: Asegura que el body ocupe al menos el 100% de la altura de la pantalla.
      */}
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-white dark:bg-gray-900`}
      >
        <Header />
        {/* CAMBIO CLAVE:
        - flex-grow: Hace que el contenido principal se expanda para ocupar todo el espacio disponible,
          empujando el Footer hacia abajo.
        */}
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

