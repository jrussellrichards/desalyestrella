import Image from 'next/image'
import { urlFor } from '@/lib/image'
import Link from 'next/link'
import { Property } from '@/types'
import { hasAssetRef } from '@/utils/hasAssetRef'

export default function PropertyCard({ property }: { property: Property }) {
  const cover = property.gallery?.find(hasAssetRef)
  const imgUrl = cover ? urlFor(cover).width(800).height(600).fit('crop').auto('format').url() : null
  return (
    <Link
      href={`/refugios/${property.slug.current || property.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 dark:hover:border-amber-400"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        {imgUrl && (
          <Image
            src={imgUrl}
            alt={property.name}
            fill
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent opacity-0 transition group-hover:opacity-100" />
        {property.tagline && (
          <span className="absolute left-2 top-2 rounded-md bg-black/55 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-200 backdrop-blur-sm">
            {property.tagline.length > 26 ? property.tagline.slice(0, 24) + '…' : property.tagline}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-ink dark:text-white font-display">
          {property.name}
        </h3>
        {property.location && (
          <p className="mt-1 line-clamp-1 text-xs font-medium text-ink-faint dark:text-ink-dark-faint">
            {property.location}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {typeof property.capacity === 'number' && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              <svg className="mr-1 h-3.5 w-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21a8 8 0 0116 0H4z" />
              </svg>
              {property.capacity} huésp.
            </span>
          )}
          {typeof property.bedrooms === 'number' && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              <svg className="mr-1 h-3.5 w-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M6 10V7a3 3 0 013-3h6a3 3 0 013 3v3m-2 4v5m-8-5v5M3 10v10h18V10" />
              </svg>
              {property.bedrooms} dorm.
            </span>
          )}
          {typeof property.bathrooms === 'number' && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-200">
              <svg className="mr-1 h-3.5 w-3.5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V5a3 3 0 016 0v4m4 2H5v6a4 4 0 004 4h6a4 4 0 004-4v-6z" />
              </svg>
              {property.bathrooms} baño{property.bathrooms === 1 ? '' : 's'}
            </span>
          )}
        </div>
        {property.tagline && (
          <p className="mt-3 line-clamp-2 text-[0.8rem] leading-[1.4] text-ink-subtle dark:text-ink-dark-subtle">
            {property.tagline}
          </p>
        )}
        <div className="mt-auto pt-4">
          <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-wide text-amber-600 transition group-hover:text-amber-500 dark:text-amber-400">
            Ver detalles
            <svg className="ml-1 h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

