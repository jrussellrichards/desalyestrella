import Link from 'next/link'
import Image from 'next/image'
import { IconStarFilled, IconUsers, IconBed, IconBath, IconArrowRight } from '@tabler/icons-react'
import { Property } from '@/types'
import { urlFor } from '@/lib/image'
import { computeDisplayPrice } from '@/utils/pricing'
import { hasAssetRef } from '@/utils/hasAssetRef'
import { getRating } from '@/lib/site'

const formatRating = (n: number) => n.toFixed(2).replace('.', ',')

// Tarjeta de refugio con foto, calificación, capacidad y precio "desde"
export default function RefugioCard({ property }: { property: Property }) {
  const cover = property.gallery?.find(hasAssetRef)
  const img = cover
    ? urlFor(cover).width(900).height(700).fit('crop').auto('format').url()
    : /pichilemu/i.test(property.location || '') ? '/destinos/pichilemu-cabana.jpg' : '/destinos/la-serena.jpg'
  const rating = getRating(property)
  const price = computeDisplayPrice(property)

  return (
    <Link
      href={`/refugios/${property.slug.current}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="relative aspect-[9/7] overflow-hidden bg-gray-100">
        <Image
          src={img}
          alt={property.name}
          fill
          sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        {property.location && (
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy-900 shadow-sm">
            {property.location}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-semibold text-ink dark:text-white">{property.name}</h3>
          {rating && (
            <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-ink dark:text-white">
              <IconStarFilled className="h-4 w-4 text-gold-500" />
              {formatRating(rating.rating)}
              <span className="font-normal text-ink-faint">({rating.reviewCount})</span>
            </span>
          )}
        </div>
        {property.tagline && (
          <p className="mt-2 line-clamp-2 text-sm text-ink-subtle dark:text-ink-dark-subtle">{property.tagline}</p>
        )}
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-subtle dark:text-ink-dark-subtle">
          {typeof property.capacity === 'number' && (
            <li className="inline-flex items-center gap-1.5"><IconUsers className="h-4 w-4 text-sea-500" />{property.capacity} huéspedes</li>
          )}
          {typeof property.bedrooms === 'number' && (
            <li className="inline-flex items-center gap-1.5"><IconBed className="h-4 w-4 text-sea-500" />{property.bedrooms} dorm.</li>
          )}
          {typeof property.bathrooms === 'number' && (
            <li className="inline-flex items-center gap-1.5"><IconBath className="h-4 w-4 text-sea-500" />{property.bathrooms} {property.bathrooms === 1 ? 'baño' : 'baños'}</li>
          )}
        </ul>
        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-5 dark:border-gray-700">
          <span className="text-sm text-ink-subtle dark:text-ink-dark-subtle">
            {price ? (
              <>Desde <strong className="text-base text-ink dark:text-white">{price.display}</strong> / noche</>
            ) : (
              'Precio según fechas'
            )}
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-navy-900 group-hover:text-gold-700 dark:text-gold-300">
            Reservar <IconArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  )
}
