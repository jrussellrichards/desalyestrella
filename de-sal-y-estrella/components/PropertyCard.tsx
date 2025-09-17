import Image from 'next/image'
import { urlFor } from '@/lib/image'
import Link from 'next/link'
import { Property } from '@/types'

export default function PropertyCard({ property }: { property: Property }) {
  const hasImage = property.gallery && property.gallery.length > 0

  return (
    <Link href={`/refugios/${property.slug.current}`} className="group h-full">
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="relative aspect-video w-full flex-shrink-0">
          {hasImage ? (
            <Image
              src={urlFor(property.gallery[0]).width(500).height(300).fit('crop').url()}
              alt={property.gallery[0]?.alt && typeof property.gallery[0].alt === 'string' ? property.gallery[0].alt : `Foto principal de ${property.name}`}
              fill
              sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-gray-700">
              <span className="text-sm text-gray-500 dark:text-gray-400">Sin imagen</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-1 text-lg font-semibold text-gray-900 dark:text-white">{property.name}</h3>
          <p className="mt-1 line-clamp-1 text-sm text-gray-600 dark:text-gray-400">{property.location}</p>
          <p className="mt-2 line-clamp-2 text-sm text-gray-700 dark:text-gray-200">{property.tagline}</p>
          <div className="mt-4 flex items-center justify-between pt-2">
            <span className="text-xs font-medium text-amber-600">Ver más</span>
            <svg
              className="h-4 w-4 text-amber-600 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}

