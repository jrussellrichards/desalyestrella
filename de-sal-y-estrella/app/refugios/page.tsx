import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import PropertyCard from '@/components/PropertyCard'
import { Property } from '@/types'

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
  const properties: Property[] = await client.fetch(query)

  const rawLocation = typeof searchParams?.l === 'string' ? searchParams.l : undefined
  const locationFilter = rawLocation?.trim().toLowerCase()
  const filtered = locationFilter
    ? properties.filter(p => (p.location || '').toLowerCase().includes(locationFilter))
    : properties

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Nuestros Refugios
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
          Cada uno de nuestros espacios está diseñado para ofrecer una conexión
          única con los paisajes más inspiradores de Chile.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {['Pichilemu', 'La Serena'].map(loc => {
            const active = locationFilter === loc.toLowerCase()
            return (
              <a
                key={loc}
                href={active ? '/refugios' : `/refugios?l=${encodeURIComponent(loc)}`}
                className={`inline-flex items-center rounded-full border px-4 py-1.5 text-sm transition ${
                  active
                    ? 'border-amber-500 bg-amber-500 text-white shadow'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-amber-400 hover:text-amber-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-amber-500 dark:hover:text-amber-400'
                }`}
              >
                {loc}
                {active && (
                  <span className="ml-2 text-xs font-medium opacity-80">(x)</span>
                )}
              </a>
            )
          })}
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 && (
            <p className="col-span-full text-sm text-gray-500 dark:text-gray-400">
              No hay refugios en esa ubicación.
            </p>
          )}
          {filtered.map(property => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </div>
    </div>
  )
}