'use client'

import { usePathname } from 'next/navigation'

// La guía del huésped tiene su propio encabezado y menú: ahí no se muestran
// el encabezado, el pie ni el botón flotante del sitio de reservas.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/huespedes')) return null
  return <>{children}</>
}
