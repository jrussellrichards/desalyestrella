import Image from 'next/image'
import { urlFor } from '@/lib/image'
import Link from 'next/link'
import { Property } from '@/types'

export default function PropertyCard({ property }: { property: Property }) {
  // Comprobamos si la galería existe y tiene imágenes
  const hasImage = property.gallery && property.gallery.length > 0

  return (
    <Link href={`/refugios/${property.slug.current}`} className="group">
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 group-hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="relative aspect-video">
          {hasImage ? (
            <Image
              src={urlFor(property.gallery[0])
                .width(500)
                .height(300)
                .fit('crop')
                .url()}
              alt={`Foto principal de ${property.name}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100 dark:bg-gray-700">
              <span className="text-sm text-gray-500">Sin imagen</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {property.name}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {property.location}
          </p>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-200">
            {property.tagline}
          </p>
        </div>
      </div>
    </Link>
  )
}

