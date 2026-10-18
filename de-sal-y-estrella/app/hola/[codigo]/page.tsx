import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IconBrandInstagram, IconBrandWhatsapp, IconBook } from '@tabler/icons-react'
import { INSTAGRAM_URL, assistantLink } from '@/lib/site'

// Destino del QR impreso en cada propiedad. Los QR apuntan a /hola/<codigo>,
// así los botones se pueden cambiar sin volver a imprimir.
const STAYS: Record<string, { name: string; message: string; guide: string }> = {
  '403': {
    name: 'Aqua Resort · Depto 403',
    message: 'Hola, estoy en el departamento 403 de Aqua Resort La Serena',
    guide: '/huespedes/aqua-403',
  },
  '308': {
    name: 'Aqua Resort · Depto 308',
    message: 'Hola, estoy en el departamento 308 de Aqua Resort La Serena',
    guide: '/huespedes/aqua-308',
  },
  pichilemu: {
    name: 'Cabaña Pichilemu',
    message: 'Hola, estoy en la cabaña de Pichilemu',
    guide: '/huespedes/pichilemu-capital-del-surf',
  },
}

export function generateStaticParams() {
  return Object.keys(STAYS).map(codigo => ({ codigo }))
}

export const dynamicParams = false

export const metadata = {
  title: 'Bienvenido',
  robots: { index: false, follow: false },
}

export default async function HolaPage({ params }: { params: Promise<{ codigo: string }> }) {
  const { codigo } = await params
  const stay = STAYS[codigo]
  if (!stay) notFound()

  return (
    <main className="min-h-[80vh] bg-sea-50 px-6 py-14">
      <div className="mx-auto max-w-md text-center">
        <Image src="/brand/isotipo-oscuro.png" alt="De Sal y Estrella" width={88} height={88} className="mx-auto" />
        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-sea-600">{stay.name}</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink">¡Bienvenido!</h1>
        <p className="mt-3 text-ink-subtle">¿En qué te ayudamos?</p>

        <div className="mt-8 grid gap-4">
          <a
            href={assistantLink(stay.message)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl bg-sea-500 p-5 text-left text-white shadow transition hover:bg-sea-600"
          >
            <IconBrandWhatsapp className="h-8 w-8 shrink-0" />
            <span>
              <span className="block text-lg font-semibold">Escríbenos 24/7</span>
              <span className="block text-sm text-sea-50">Llegada, salida, el alojamiento y la zona</span>
            </span>
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] p-5 text-left text-white shadow transition hover:opacity-90"
          >
            <IconBrandInstagram className="h-8 w-8 shrink-0" />
            <span>
              <span className="block text-lg font-semibold">Síguenos en Instagram</span>
              <span className="block text-sm text-white/90">@de_sal_y_estrella</span>
            </span>
          </a>
          <Link
            href={stay.guide}
            className="flex items-center gap-4 rounded-2xl bg-white p-5 text-left text-ink shadow-sm ring-1 ring-sea-100 transition hover:bg-sea-50"
          >
            <IconBook className="h-8 w-8 shrink-0 text-sea-600" />
            <span>
              <span className="block text-lg font-semibold">Guía del huésped</span>
              <span className="block text-sm text-ink-subtle">Cómo usar todo y nuestros datos de la zona</span>
            </span>
          </Link>
        </div>
      </div>
    </main>
  )
}
