import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { DESTINATIONS } from '@/lib/experiences'

export const metadata: Metadata = {
  title: 'Experiencias en La Serena y Pichilemu',
  description: 'Guías con lo que recomendamos hacer en La Serena, el Valle del Elqui y Pichilemu: surf, ballenas, observatorios, salinas y más.',
  alternates: { canonical: '/experiencias' },
}

export default function ExperienciasPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-h2 font-semibold tracking-tight text-ink dark:text-white">Qué hacer en cada destino</h1>
          <p className="mt-4 text-copy-lg text-ink-subtle dark:text-ink-dark-subtle">
            Lo que les recomendamos a nuestros huéspedes en La Serena, el Valle del Elqui y Pichilemu.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-2">
          {DESTINATIONS.map(dest => (
            <Link
              key={dest.slug}
              href={`/experiencias/${dest.slug}`}
              className="group relative block overflow-hidden rounded-2xl border border-gray-200 shadow-sm transition-shadow duration-300 hover:shadow-xl dark:border-gray-700"
            >
              <div className="relative h-72 w-full">
                <Image src={dest.image} alt={dest.name} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 p-6">
                <h2 className="font-display text-2xl font-semibold text-white">{dest.name}</h2>
                <p className="mt-2 text-sm text-gray-200">{dest.experiences.length} experiencias recomendadas</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
