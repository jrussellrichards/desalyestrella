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
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-gold-700">Nuestros refugios</p>
          <h1 className="mt-2 font-display text-h1 font-semibold text-ink dark:text-white">Elige dónde despertar</h1>
          <p className="mt-4 text-copy-lg text-ink-subtle dark:text-ink-dark-subtle">
            Departamentos frente al mar en Aqua Resort La Serena y una cabaña a pasos de la playa en Pichilemu. Revisa fotos, disponibilidad y precio, y reserva directo.
          </p>
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

        {!locationFilter && (
            <section className="mx-auto mt-24 max-w-6xl border-t border-gray-100 pt-16 dark:border-gray-800">
              <div className="text-center mb-12">
                <h2 className="font-display text-h2 font-semibold text-ink dark:text-white">¿No sabes qué destino elegir?</h2>
                <p className="mt-3 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-base">Cada lugar ofrece una energía distinta. Elige según el tipo de conexión con la naturaleza y el ritmo que buscas para tu estadía.</p>
              </div>
                <div className="grid gap-10 md:grid-cols-2">
                <div className="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm p-8 shadow-sm">
                  <h3 className="text-xl font-display font-semibold text-navy-900 dark:text-gold-300">La Serena</h3>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  <p>Elige La Serena si buscas el equilibrio perfecto entre el descanso en la playa, la cultura y la exploración. Esta ciudad te ofrece la calma de su costa y te abre las puertas a las maravillas del Valle del Elqui. Es tu destino si buscas:</p>
                  <ul className="space-y-2">
                    <li className="flex gap-2"><span className="text-gold-500">•</span> Relajarte en extensas playas de arena, ideales para caminar y disfrutar del sol.</li>
                    <li className="flex gap-2"><span className="text-gold-500">•</span> Combinar la tranquilidad del mar con el encanto de un centro histórico y una gastronomía vibrante.</li>
                    <li className="flex gap-2"><span className="text-gold-500">•</span> Tener la base ideal para descubrir la magia del Valle del Elqui, sus viñedos y los cielos más estrellados del mundo.</li>
                  </ul>
                  <p>La Serena es la pausa que necesitas y el comienzo de un viaje inolvidable, desde el mar hasta las estrellas.</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-200/70 dark:border-gray-700/70 bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm p-8 shadow-sm">
                  <h3 className="text-xl font-display font-semibold text-navy-900 dark:text-gold-300">Pichilemu</h3>
                  <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  <p>Elige Pichilemu si tu energía vibra con el océano, la aventura y un espíritu libre. En la capital mundial del surf, cada día es una invitación a conectar con la naturaleza en su estado más puro. Es tu destino si buscas:</p>
                  <ul className="space-y-2">
                    <li className="flex gap-2"><span className="text-gold-500">•</span> Desafiar olas perfectas, seas experto o principiante.</li>
                    <li className="flex gap-2"><span className="text-gold-500">•</span> Sumergirte en una cultura bohemia de surf, cafés de autor y gastronomía marina.</li>
                    <li className="flex gap-2"><span className="text-gold-500">•</span> Admirar paisajes salvajes desde los icónicos acantilados de Punta de Lobos.</li>
                  </ul>
                  <p>Pichilemu es adrenalina y desconexión. Es la base perfecta para tu aventura en la costa indómita de Chile.</p>
                  </div>
                </div>
                </div>
            </section>
        )}
      </div>
    </div>
  )
}
