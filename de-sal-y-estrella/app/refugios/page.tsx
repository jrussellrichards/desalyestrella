import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import RefugioCard from '@/components/RefugioCard'
import { Property } from '@/types'
import { fetchSettings } from '@/lib/settings'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Refugios en La Serena y Pichilemu',
  description: 'Departamentos frente al mar en Aqua Resort La Serena y cabaña en Pichilemu. Revisa fotos, disponibilidad y reserva directo.',
  alternates: { canonical: '/refugios' },
}

const query = groq`*[_type == "property"] | order(_createdAt asc){
  _id,
  name,
  slug,
  location,
  tagline,
  gallery,
  capacity,
  bedrooms,
  bathrooms,
  basePrice,
  seasonalAdjustments,
  rating,
  reviewCount
}`

interface Props {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function RefugiosPage({ searchParams }: Props) {
  const [properties, settings, resolvedSearchParams] = await Promise.all([
    client.fetch(query),
    fetchSettings(),
    searchParams
  ])

  const rawLocation = typeof resolvedSearchParams?.l === 'string' ? resolvedSearchParams.l : undefined
  const locationFilter = rawLocation?.trim().toLowerCase()
  const filtered = locationFilter
    ? properties.filter((p: Property) => (p.location || '').toLowerCase().includes(locationFilter))
    : properties

  const destinations = (settings?.destinations && settings.destinations.length > 0)
    ? settings.destinations
    : [
        { _key: 'la-serena-fallback', title: 'La Serena', slugParam: 'La Serena' },
        { _key: 'pichilemu-fallback', title: 'Pichilemu', slugParam: 'Pichilemu' },
      ]

  const chips = [{ title: 'Todos', href: '/refugios', active: !locationFilter }].concat(
    destinations.map(d => ({
      title: d.title,
      href: `/refugios?l=${encodeURIComponent(d.slugParam)}`,
      active: locationFilter === d.slugParam.toLowerCase(),
    }))
  )

  return (
    <div className="bg-salt dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-sea-600">Nuestros refugios</p>
          <h1 className="mt-2 font-display text-h1 font-semibold text-ink dark:text-white">Elige dónde despertar</h1>
          <p className="mt-3 text-copy-lg text-ink-subtle dark:text-ink-dark-subtle">Frente al mar en La Serena y Pichilemu.</p>
        </div>

        <nav aria-label="Filtrar por destino" className="mt-8 flex flex-wrap gap-3">
          {chips.map(c => (
            <Link
              key={c.title}
              href={c.href}
              aria-current={c.active ? 'page' : undefined}
              className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
                c.active
                  ? 'border-navy-900 bg-navy-900 text-white shadow'
                  : 'border-gray-300 bg-white text-ink-subtle hover:border-gold-500 hover:text-navy-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200'
              }`}
            >
              {c.title}
            </Link>
          ))}
        </nav>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((property: Property) => (
            <RefugioCard key={property._id} property={property} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mt-10 text-sm text-ink-subtle">
            No hay refugios en esa ubicación. <Link href="/refugios" className="font-medium text-gold-700 hover:underline">Ver todos</Link>
          </p>
        )}

      </div>
    </div>
  )
}
