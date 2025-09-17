import Link from 'next/link'

export default function Header() {
  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/refugios', label: 'Refugios' },
    { href: '/historia', label: 'Nuestra Historia' }, // <-- Enlace añadido
    { href: '/experiencias', label: 'Experiencias' }, // <-- Enlace añadido
    { href: '/blog', label: 'Blog' }, // <-- Enlace añadido
    { href: '/contacto', label: 'Contacto' }, // <-- Enlace añadido
    // Próximamente añadiremos más enlaces aquí
    // { href: '/experiencias', label: 'Experiencias' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-gray-900 text-white shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
        >
          De Sal y Estrella
        </Link>
        <nav className="hidden space-x-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium transition-colors hover:text-gray-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {/* Aquí podríamos añadir un menú hamburguesa para móviles en el futuro */}
      </div>
    </header>
  )
}

