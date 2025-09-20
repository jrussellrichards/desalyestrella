import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { Property } from '@/types'
import { urlFor } from '@/lib/image'
import { PortableText } from '@portabletext/react'
import BookingWidget from '@/components/BookingWidget'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import CrossSell from './CrossSell'
import { computeDisplayPrice } from '@/utils/pricing'
import { fetchSettings } from '@/lib/settings'
import LightboxGallery from '@/components/LightboxGallery'
import { hasAssetRef } from '@/utils/hasAssetRef'
import { AmenityIcon } from '@/components/AmenityIcon'

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
  seasonalAdjustments,
  airbnbListingUrl,
  airbnbProfileUrl,
  bedrooms,
  bathrooms
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
  const [property, settings] = await Promise.all([
    fetchProperty(params.slug),
    fetchSettings()
  ])
  if (!property) notFound()
  const hasImages = !!(property.gallery && property.gallery.length > 0)
  const priceInfo = computeDisplayPrice(property)

  const hostProfileUrl = property.airbnbProfileUrl || settings.airbnbProfileUrl

  const firstValid = property.gallery?.find(hasAssetRef)

  return (
    <div className="bg-white dark:bg-gray-900">
      <header className="relative">
        {hasImages ? (
          <LightboxGallery
            images={property.gallery || []}
            propertyName={property.name}
          />
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
            {(typeof property.capacity === 'number' ||
              typeof property.bedrooms === 'number' ||
              typeof property.bathrooms === 'number') && (
              <ul className="mt-4 flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-300">
                {typeof property.capacity === 'number' && (
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM4 21a8 8 0 0116 0H4z" />
                    </svg>
                    <span className="ml-2">{property.capacity} huéspedes</span>
                  </li>
                )}
                {typeof property.bedrooms === 'number' && (
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M6 10V7a3 3 0 013-3h6a3 3 0 013 3v3m-2 4v5m-8-5v5M3 10v10h18V10" />
                    </svg>
                    <span className="ml-2">
                      {property.bedrooms} {property.bedrooms === 1 ? 'dormitorio' : 'dormitorios'}
                    </span>
                  </li>
                )}
                {typeof property.bathrooms === 'number' && (
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V5a3 3 0 016 0v4m4 2H5v6a4 4 0 004 4h6a4 4 0 004-4v-6z" />
                    </svg>
                    <span className="ml-2">
                      {property.bathrooms} {property.bathrooms === 1 ? 'baño' : 'baños'}
                    </span>
                  </li>
                )}
              </ul>
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
                  Cuidado único en cada detalle
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
              {(property.airbnbListingUrl || hostProfileUrl) && (
                <div className="mt-5 space-y-2">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    Confianza
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {property.airbnbListingUrl && (
                      <a
                        href={property.airbnbListingUrl}
                        target="_blank"
                        rel="nofollow noopener"
                        className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:border-amber-300 hover:text-amber-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-amber-500"
                      >
                        <svg
                          role="img"
                          aria-label="Airbnb"
                          viewBox="0 0 24 24"
                          className="mr-1.5 h-4 w-4 text-[#FF5A5F]"
                          fill="currentColor"
                        >
                          <path d="M12 10.748c-1.09 0-1.974.936-1.974 2.09 0 1.11.884 2.046 1.974 2.046 1.09 0 1.974-.936 1.974-2.09 0-1.11-.884-2.046-1.974-2.046zm10.832 3.292c-.14-.35-.284-.7-.44-1.046-.284-.62-.6-1.233-.936-1.834-.62-1.108-1.31-2.183-2.07-3.223-.552-.765-1.14-1.507-1.76-2.214-.477-.556-.972-1.1-1.485-1.63C14.803 1.94 13.436.92 12 .92c-1.438 0-2.802 1.02-4.146 2.164-.513.53-1.008 1.074-1.485 1.63-.62.707-1.208 1.45-1.76 2.214-.76 1.04-1.45 2.115-2.07 3.223-.337.601-.652 1.214-.936 1.834-.155.345-.3.695-.44 1.046-.402 1.004-.71 1.99-.892 2.92-.102.531-.154 1.04-.154 1.516 0 1.354.477 2.52 1.343 3.356.81.78 1.917 1.208 3.153 1.208.513 0 1.05-.078 1.593-.234.788-.23 1.6-.62 2.42-1.17 1.138-.78 2.31-1.888 3.573-3.407 1.262 1.52 2.435 2.627 3.572 3.406.82.55 1.633.94 2.42 1.17.543.156 1.08.234 1.593.234 1.236 0 2.343-.43 3.153-1.208.866-.837 1.343-2.002 1.343-3.356 0-.476-.052-.985-.154-1.516-.182-.93-.49-1.916-.892-2.92zm-8.37-9.26c.406.416.81.858 1.204 1.318.543.638 1.06 1.3 1.544 1.982.636.91 1.216 1.846 1.74 2.802.3.555.58 1.115.84 1.684.13.282.25.565.365.847.345.86.6 1.67.76 2.39.084.44.125.84.125 1.195 0 .918-.306 1.644-.866 2.187-.51.486-1.215.74-2.037.74-.38 0-.78-.06-1.192-.178-.58-.17-1.18-.46-1.775-.862-.968-.66-1.98-1.59-3.06-2.84 1.396-1.824 2.56-3.557 3.467-5.157.53-.94.98-1.84 1.352-2.69.45-1.03.676-1.9.676-2.58 0-.45-.098-.86-.292-1.22-.183-.33-.437-.59-.76-.75-.247-.12-.52-.183-.81-.183-.88 0-1.857.63-2.77 1.553-.94-.952-1.913-1.553-2.787-1.553-.29 0-.56.062-.808.183-.323.16-.577.42-.76.75-.194.36-.29.77-.29 1.22 0 .68.226 1.55.676 2.58.37.85.82 1.75 1.353 2.69.905 1.6 2.07 3.333 3.467 5.156-1.08 1.25-2.093 2.18-3.06 2.84-.595.404-1.195.694-1.775.862-.413.12-.81.178-1.193.178-.82 0-1.526-.254-2.037-.74-.56-.543-.866-1.27-.866-2.187 0-.355.042-.755.125-1.195.16-.72.415-1.53.76-2.39.115-.282.236-.565.365-.847.26-.57.54-1.13.84-1.684.524-.956 1.104-1.892 1.74-2.802.484-.683 1.002-1.344 1.545-1.982.392-.46.797-.902 1.203-1.318 1.175-1.207 2.32-2.018 3.185-2.018.265 0 .507.052.722.155.242.116.43.29.566.525.15.26.226.57.226.93 0 .5-.164 1.17-.49 1.93-.318.74-.76 1.57-1.314 2.47-.656 1.06-1.442 2.21-2.345 3.42-.902-1.21-1.687-2.36-2.345-3.42-.55-.9-.996-1.73-1.314-2.47-.327-.76-.49-1.43-.49-1.93 0-.36.074-.67.225-.93.136-.234.324-.41.566-.525.215-.103.457-.155.722-.155.864 0 2.01.81 3.185 2.018z" />
                        </svg>
                        Ver en Airbnb
                      </a>
                    )}
                    {hostProfileUrl && (
                      <a
                        href={hostProfileUrl}
                        target="_blank"
                        rel="nofollow noopener"
                        className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:border-amber-300 hover:text-amber-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-amber-500"
                      >
                        Perfil Superhost
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div
              id="amenities"
              className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <h2 className="font-display text-h3 font-semibold text-ink dark:text-white">Servicios incluidos</h2>
        <ul className="mt-6 grid grid-cols-1 gap-y-3 text-sm sm:grid-cols-2">
                {(property.amenities || []).map(a => (
          <li key={a} className="grid grid-cols-[1.75rem_1fr] items-start gap-x-2">
                    <span className="flex h-5 w-5 items-center justify-center text-amber-600 dark:text-amber-400" aria-hidden="true">
                      <AmenityIcon amenity={a} />
                    </span>
                    <span className="leading-snug text-ink-subtle dark:text-ink-dark-subtle">{a}</span>
                  </li>
                ))}
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
              image: firstValid ? urlFor(firstValid)?.width(1200).height(800).quality(80).url() : undefined,
              description: property.tagline || '',
              amenityFeature: (property.amenities || []).map(a => ({
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

