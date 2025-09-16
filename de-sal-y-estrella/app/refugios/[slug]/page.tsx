import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { Property } from '@/types'
import Image from 'next/image'
import { urlFor } from '@/lib/image'
import { PortableText } from '@portabletext/react'
import BookingWidget from '@/components/BookingWidget'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import CrossSell from './CrossSell'
import { computeDisplayPrice } from '@/utils/pricing'

// Revalidación ISR (5 min) para balance entre frescura y rendimiento
export const revalidate = 300

const propertyQuery = groq`*[_type == "property" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  location,
  tagline,
  gallery,
  description,
  capacity,
  amenities,
  bookingWidgetCode,
  basePrice,
  seasonalAdjustments
}`

export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await client.fetch(
    groq`*[_type == "property"]{"slug": slug}`
  )
  return slugs.map(({ slug }) => ({ slug: slug.current }))
}

// Metadata básica dinámica
export function generateMetadata({ params }: { params: { slug: string } }) {
  const baseTitle = 'Refugio'
  return {
    title: `${baseTitle} ${params.slug} | Sal & Estrella`,
    openGraph: {
      title: `${baseTitle} ${params.slug} | Sal & Estrella`,
      type: 'article'
    }
  }
}

// Optimización: memorizamos la consulta en build/runtime (cache React)
const fetchProperty = cache(async (slug: string) => {
  if (!slug) return null
  return client.fetch<Property | null>(propertyQuery, { slug })
})

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  const property = await fetchProperty(params.slug)
  if (!property) notFound()
  const hasImages = !!(property.gallery && property.gallery.length > 0)
  const priceInfo = computeDisplayPrice(property)

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* HERO GALERÍA */}
      <header className="relative">
        {hasImages ? (
          <div className="grid grid-cols-4 gap-2 px-4 pt-6 sm:px-6 lg:px-8">
            {property.gallery!.slice(0, 5).map((image: any, idx: number) => {
              const builder = urlFor(image)
              if (!builder) return null
              const url = builder
                .width(idx === 0 ? 1600 : 800)
                .height(idx === 0 ? 900 : 600)
                .quality(80)
                .fit('crop')
                .url()
              return (
                <div
                  key={image._key || idx}
                  className={`
                    relative overflow-hidden rounded-lg
                    ${idx === 0 ? 'col-span-4 md:col-span-2 row-span-2 aspect-[16/9]' : 'aspect-video'}
                  `}
                >
                  <Image
                    src={url}
                    alt={image.alt || `${property.name} – vista ${idx + 1}`}
                    fill
                    sizes={idx === 0 ? '(max-width:768px) 100vw, 50vw' : '(max-width:768px) 50vw, 25vw'}
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    priority={idx === 0}
                    placeholder="blur"
                    blurDataURL="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZWVlIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+"
                  />
                  {idx === 0 && (
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0" />
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
            <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-gray-500">No hay imágenes disponibles</p>
            </div>
          </div>
        )}
      </header>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-x-12">
          {/* CONTENIDO PRINCIPAL */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {property.name}
            </h1>
            {property.location && (
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">{property.location}</p>
            )}
            {property.tagline && (
              <p className="mt-2 inline-flex items-center rounded bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
                {property.tagline}
              </p>
            )}
            {priceInfo && (
              <p className="mt-4 text-base text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-gray-900 dark:text-white">Desde {priceInfo.display}/noche</span>
                {priceInfo.seasonNote && (
                  <span className="ml-2 text-xs text-gray-500">{priceInfo.seasonNote}</span>
                )}
              </p>
            )}
            {/* Micro narrativa diferenciadora */}
            <section aria-labelledby="porque" className="mt-8">
              <h2 id="porque" className="text-lg font-semibold text-gray-900 dark:text-white">
                ¿Por qué este refugio?
              </h2>
              <ul className="mt-4 grid gap-3 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-3">
                <li className="rounded-md bg-gray-50 p-3 dark:bg-gray-800/60">
                  Cuidado curatorial en cada detalle
                </li>
                <li className="rounded-md bg-gray-50 p-3 dark:bg-gray-800/60">
                  Conexión naturaleza + descanso profundo
                </li>
                <li className="rounded-md bg-gray-50 p-3 dark:bg-gray-800/60">
                  Ecosistema de experiencias locales
                </li>
              </ul>
            </section>

            <section aria-labelledby="descripcion" className="mt-10">
              <h2 id="descripcion" className="sr-only">
                Descripción
              </h2>
              <div className="prose prose-lg max-w-none text-gray-700 dark:prose-invert dark:text-gray-300">
                <PortableText value={property.description} />
              </div>
            </section>
          </div>

            {/* SIDEBAR RESERVA */}
          <aside className="mt-12 space-y-8 self-start lg:mt-0 lg:sticky lg:top-28">
            <div
              id="reservar"
              className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Reserva</h2>
              {priceInfo && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Desde <span className="font-semibold text-gray-900 dark:text-white">{priceInfo.display}</span> / noche
                </p>
              )}
              <div className="mt-4">
                <BookingWidget htmlCode={property.bookingWidgetCode || ''} />
              </div>
              <ul className="mt-5 flex flex-wrap gap-2 text-[11px] font-medium text-gray-500">
                <li className="inline-flex items-center rounded bg-white/60 px-2 py-1 dark:bg-gray-700/50">
                  Tarifa directa
                </li>
                <li className="inline-flex items-center rounded bg-white/60 px-2 py-1 dark:bg-gray-700/50">
                  Confirmación inmediata
                </li>
                <li className="inline-flex items-center rounded bg-white/60 px-2 py-1 dark:bg-gray-700/50">
                  Cancelación flexible*
                </li>
              </ul>
              <a
                href="#amenities"
                className="mt-6 inline-block w-full rounded-md bg-amber-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Ver comodidades
              </a>
            </div>

            <div
              id="amenities"
              className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Servicios incluidos</h2>
              <ul role="list" className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                {property.amenities?.map((amenity) => (
                  <li key={amenity} className="flex items-start">
                    <svg
                      className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{amenity}</span>
                  </li>
                ))}
                {typeof property.capacity === 'number' && (
                  <li className="flex items-start">
                    <svg
                      className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Capacidad: {property.capacity} personas</span>
                  </li>
                )}
              </ul>
            </div>
          </aside>
        </div>

        <CrossSell currentId={property._id} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LodgingBusiness',
              name: property.name,
              address: { '@type': 'PostalAddress', addressCountry: 'CL' },
              image:
                property.gallery?.[0] &&
                urlFor(property.gallery[0])?.width(1200).height(800).quality(80).url(),
              description: property.tagline || '',
              amenityFeature: (property.amenities || []).map((a) => ({
                '@type': 'LocationFeatureSpecification',
                name: a
              }))
            })
          }}
        />
      </div>

      {/* CTA FLOTANTE MOBILE */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:bg-gray-900/90 md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">¿Listo para reservar?</span>
          <a
            href="#reservar"
            className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            Consultar fechas
          </a>
        </div>
      </div>
    </div>
  )
}

