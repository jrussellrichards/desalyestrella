import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import PropertyCard from '@/components/PropertyCard'
import { Property, GlobalSettings } from '@/types'
import { fetchSettings } from '@/lib/settings'
import { urlFor } from '@/lib/image'
import Image from 'next/image'
import Link from 'next/link'

const query = groq`*[_type == "property"]{
  _id,
  name,
  slug,
  location,
  tagline,
  gallery
}`

interface Props {
  searchParams?: { [key: string]: string | string[] | undefined }
}

export default async function RefugiosPage({ searchParams }: Props) {
  const [properties, settings]: [Property[], GlobalSettings] = await Promise.all([
    client.fetch(query),
    fetchSettings()
  ])

  const rawLocation = typeof searchParams?.l === 'string' ? searchParams.l : undefined
  const locationFilter = rawLocation?.trim().toLowerCase()
  const filtered = locationFilter
    ? properties.filter(p => (p.location || '').toLowerCase().includes(locationFilter))
    : properties

  const destinations = (settings?.destinations && settings.destinations.length > 0)
    ? settings.destinations
    : [
        {
          _key: 'pichilemu-fallback',
          title: 'Pichilemu',
          slugParam: 'Pichilemu',
          description: 'Capital del surf chileno. Olas consistentes, energía salina y atardeceres intensos.'
        },
        {
          _key: 'la-serena-fallback',
          title: 'La Serena',
          slugParam: 'La Serena',
          description: 'Playas amplias, bruma matinal, arquitectura tradicional y cielos diáfanos.'
        }
      ]

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Nuestros Refugios
          </h1>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Cada uno de nuestros espacios está diseñado para ofrecer una conexión única con los paisajes más inspiradores de Chile.
          </p>
        </div>

        {locationFilter && (
          <div className="mt-6 flex flex-wrap gap-3">
            {destinations.map(d => {
              const active = locationFilter === d.slugParam.toLowerCase()
              return (
                <a
                  key={d.slugParam}
                  href={active ? '/refugios' : `/refugios?l=${encodeURIComponent(d.slugParam)}`}
                  className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm transition ${
                    active
                      ? 'border-amber-500 bg-amber-500 text-white shadow'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-amber-400 hover:text-amber-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-amber-500 dark:hover:text-amber-400'
                  }`}
                >
                  {d.title}
                  {active && (
                    <span className="ml-2 text-xs font-medium opacity-80">(x)</span>
                  )}
                </a>
              )
            })}
          </div>
        )}

        {!locationFilter && (
          <div className="mt-14 mx-auto grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-2">
            {destinations.map(dest => {
              const imageUrl = dest.image?.asset
                ? urlFor(dest.image).width(1200).height(900).fit('crop').auto('format').url()
                : (dest.slugParam.toLowerCase().includes('pich') ? '/pichilemu-surf.jpg' : '/la-serena-faro.jpg')
              return (
                <Link
                  key={dest._key || dest.slugParam}
                  href={`/refugios?l=${encodeURIComponent(dest.slugParam)}`}
                  className="group relative block h-72 w-full overflow-hidden rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/60"
                >
                  <div className="absolute inset-0 bg-black">
                    <Image
                      src={imageUrl}
                      alt={dest.title}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
                  </div>
                  <div className="relative flex h-full flex-col justify-end p-6">
                    <h3 className="text-2xl font-semibold text-white drop-shadow-md">{dest.title}</h3>
                    {dest.description && (
                      <p className="mt-2 max-w-xs text-sm text-white/85">{dest.description}</p>
                    )}
                    <span className="mt-4 inline-flex items-center text-sm font-medium text-amber-300">Ver refugios <span className="ml-1 transition group-hover:translate-x-1">→</span></span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
        {locationFilter && (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.length === 0 && (
              <div className="col-span-full flex flex-col items-center gap-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No hay refugios en esa ubicación.</p>
                <Link href="/refugios" className="text-sm font-medium text-amber-600 hover:underline dark:text-amber-400">Ver destinos</Link>
              </div>
            )}
            {filtered.map(property => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}