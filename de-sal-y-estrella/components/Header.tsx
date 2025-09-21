'use client'  // Añade esto al principio para marcar como Client Component

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

interface HeaderProps {
  logoUrl?: string | null
  logoAlt?: string | null
}

export default function Header({ logoUrl, logoAlt }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // View Transitions API para transiciones suaves entre páginas
    if ('startViewTransition' in document) {
      document.startViewTransition(() => {
        // Aquí puedes añadir lógica adicional si necesitas
      })
    }
  }, [pathname])

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/historia', label: 'Nuestra Historia' },
    { href: '/refugios', label: 'Refugios' },
    { href: '/experiencias', label: 'Experiencias' },
    { href: '/blog', label: 'Guías de Viaje' },
    { href: '/contacto', label: 'Contacto' },
  ]
  const socialLinks = [
    {
      name: 'Instagram',
      href: 'https://www.instagram.com/del_mar_y_estrella/', // cambia esto
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
          <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm10.75 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 16a3.5 3.5 0 0 0 0-7Z" />
        </svg>
      )
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/56951096594', // cambia con tu número en formato internacional
      icon: (
        <svg viewBox="0 0 32 32" className="h-5 w-5" fill="currentColor" aria-hidden="true">
          <path d="M16.04 3C9.4 3 4 8.4 4 15.06c0 2.63.86 5.07 2.33 7.06L4 29l7.16-2.3a12.02 12.02 0 0 0 4.88 1.02h.01c6.64 0 12.04-5.4 12.04-12.06C28.09 8.4 22.69 3 16.04 3Zm6.99 17.2c-.29.82-1.7 1.6-2.34 1.7-.6.12-1.36.17-2.2-.14-.51-.18-1.17-.38-2.02-.84-3.55-1.93-5.86-5.34-6.03-5.59-.18-.25-1.44-1.9-1.44-3.63 0-1.72.91-2.57 1.24-2.93.34-.36.74-.45.98-.45.25 0 .49.01.7.02.22.02.52-.08.82.63.29.7 1 2.43 1.09 2.61.09.18.15.38.03.62-.12.25-.18.4-.34.61-.17.2-.35.45-.5.6-.17.17-.34.35-.15.69.18.34.8 1.32 1.71 2.14 1.17 1.05 2.14 1.38 2.48 1.54.34.17.55.15.75-.08.2-.22.86-.95 1.09-1.28.23-.34.46-.27.77-.16.31.11 1.96.92 2.29 1.08.34.17.57.25.66.4.08.14.08.82-.21 1.64Z" />
        </svg>
      )
    }
  ]

  return (
    <header className="sticky top-0 z-50 bg-gray-900 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold tracking-tight transition-opacity hover:opacity-80"
          onClick={() => setIsMenuOpen(false)}
        >
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={logoAlt || 'Logo'}
              width={800}
              height={160}
              className="h-16 w-auto sm:h-20"
              priority
            />
          ) : (
            <span className="text-xl">De Sal y Estrella</span>
          )}
        </Link>
        <nav className="hidden items-center space-x-6 md:flex">
          {navLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium transition-colors duration-200 hover:text-gray-300"
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
            {socialLinks.map(s => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="rounded-md p-1.5 text-gray-300 hover:text-white hover:bg-gray-800 transition"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </nav>
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-md p-2 text-gray-300 hover:bg-gray-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/>
              )}
            </svg>
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden overflow-hidden transition-all duration-300 ease-in-out">
          <div className="space-y-1 px-2 pb-3 pt-2 transform translate-y-0 opacity-100 animate-slide-down">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 transition-colors duration-200 hover:bg-gray-800 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-4 flex items-center gap-4 border-t border-gray-800 pt-4">
              {socialLinks.map(s => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:bg-gray-800 hover:text-white transition"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

