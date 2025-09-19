'use client'
import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'

interface HeaderProps {
  logoUrl?: string | null
  logoAlt?: string | null
}

export default function Header({ logoUrl, logoAlt }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/refugios', label: 'Refugios' },
    { href: '/experiencias', label: 'Experiencias' },
    { href: '/blog', label: 'Guías de Viaje' },
    { href: '/historia', label: 'Nuestra Historia' },
    { href: '/contacto', label: 'Contacto' },
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
        <nav className="hidden space-x-6 md:flex">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} className="text-sm font-medium transition-colors hover:text-gray-300">
              {l.label}
            </Link>
          ))}
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
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navLinks.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

