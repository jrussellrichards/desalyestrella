import Image from 'next/image'
import Link from 'next/link'
import {urlFor} from '@/lib/image'

// Este es el componente que muestra una tarjeta individual por cada propiedad.
export default function PropertyCard({property}: {property: any}) {
  return (
    <Link
      href={`/refugios/${property.slug.current}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800"
    >
      <div className="relative h-[240px] w-full overflow-hidden">
        {property.mainImage ? (
          <Image
            src={urlFor(property.mainImage).width(500).height(300).url()}
            alt={`Vista de ${property.name}`}
            fill
            className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <p className="text-gray-500">No image available</p>
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-sm font-medium text-gray-500">{property.location}</p>
        <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">{property.name}</h3>
        <p className="mt-1 text-gray-700 dark:text-gray-300">{property.tagline}</p>
      </div>
    </Link>
  )
}
