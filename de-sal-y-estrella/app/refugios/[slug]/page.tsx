import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { Property } from '@/types'
import { urlFor } from '@/lib/image'
import { PortableText } from '@portabletext/react'
import BookingWidget from '@/components/BookingWidget'
import Beds24Booking from '@/components/Beds24Booking'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import CrossSell from './CrossSell'
import { computeDisplayPrice } from '@/utils/pricing'
import { fetchSettings } from '@/lib/settings'
import LightboxGallery from '@/components/LightboxGallery'
import { hasAssetRef } from '@/utils/hasAssetRef'
import { AmenityIcon } from '@/components/AmenityIcon'
import { IconUsers, IconBed, IconBath, IconBrandWhatsapp, IconStarFilled } from '@tabler/icons-react'
import type { Metadata } from 'next'
import { AIRBNB_PROFILE_URL, SITE_URL, getRating, whatsappLink } from '@/lib/site'
import type { Testimonial } from '@/types'

// Revalidación ISR (5 min) para balance entre frescura y rendimiento
export const revalidate = 300

const propertyQuery = groq`*[_type == "property" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  beds24PropId,
  beds24RoomId,
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
  bathrooms,
  metaTitle,
  metaDescription,
  rating,
  reviewCount
}`

const reviewsQuery = groq`*[_type == "testimonial" && property._ref == $id] | order(_createdAt desc)[0...3]{
  _id,
  quote,
  author,
  location,
  rating
}`

export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await client.fetch(
    groq`*[_type == "property"]{"slug": slug}`
  )
  return slugs.map(({ slug }) => ({ slug: slug.current }))
}

// Optimización: memorizamos la consulta en build/runtime (cache React)
const fetchProperty = cache(async (slug: string) => {
  if (!slug) return null
  return client.fetch<Property | null>(propertyQuery, { slug })
})

// Título y descripción desde los campos SEO del CMS (con respaldo en nombre y tagline)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const property = await fetchProperty(slug)
  if (!property) return {}
  const title = property.metaTitle || [property.name, property.location].filter(Boolean).join(' · ')
  const description =
    property.metaDescription ||
    property.tagline ||
    `${property.name}${property.location ? ` en ${property.location}` : ''}. Reserva directo con De Sal y Estrella.`
  const cover = property.gallery?.find(hasAssetRef)
  const image = cover ? urlFor(cover).width(1200).height(630).fit('crop').auto('format').url() : '/og.jpg'
  return {
    title,
    description,
    alternates: { canonical: `/refugios/${slug}` },
    openGraph: { title, description, type: 'website', url: `/refugios/${slug}`, images: [{ url: image, width: 1200, height: 630 }] },
  }
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [property, settings] = await Promise.all([
    fetchProperty(slug),
    fetchSettings()
  ])
  if (!property) notFound()
  const reviews = await client.fetch<Testimonial[]>(reviewsQuery, { id: property._id }).catch(() => [])
  const rating = getRating(property)
  const bookingText = `Hola, quisiera reservar ${property.name}. Mis fechas son: `
  const hasBeds24 = Boolean(property.beds24RoomId || property.beds24PropId)
  const hasImages = !!(property.gallery && property.gallery.length > 0)
  const priceInfo = computeDisplayPrice(property)

  const hostProfileUrl = property.airbnbProfileUrl || settings.airbnbProfileUrl || AIRBNB_PROFILE_URL

  const firstValid = property.gallery?.find(hasAssetRef)

  return (
    <div className="bg-salt dark:bg-gray-900">
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

      <div className="mx-auto max-w-7xl px-4 pb-28 pt-8 sm:px-6 md:pb-20 lg:px-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-x-12">
          {/* CONTENIDO PRINCIPAL */}
          <div className="lg:col-span-2">
            {property.location && (
              <p className="text-sm font-semibold uppercase tracking-wider text-gold-700">{property.location}</p>
            )}
            <h1 className="mt-2 font-display text-h1 font-semibold text-ink dark:text-white">
              {property.name}
            </h1>
            {property.tagline && (
              <p className="mt-3 text-copy-lg text-ink-subtle dark:text-ink-dark-subtle">{property.tagline}</p>
            )}
            {rating && (
              <a
                href={property.airbnbListingUrl || hostProfileUrl}
                target="_blank"
                rel="nofollow noopener"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink hover:text-gold-700 dark:text-gray-200"
              >
                <IconStarFilled className="h-4 w-4 text-gold-500" />
                <strong>{rating.rating.toFixed(2).replace('.', ',')}</strong>
                <span className="text-ink-subtle dark:text-ink-dark-subtle">· {rating.reviewCount} reseñas en Airbnb · Superanfitriones</span>
              </a>
            )}
            {(typeof property.capacity === 'number' ||
              typeof property.bedrooms === 'number' ||
              typeof property.bathrooms === 'number') && (
              <ul className="mt-4 flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-300">
                {typeof property.capacity === 'number' && (
                  <li className="flex items-center">
                    <IconUsers className="h-5 w-5 text-gold-500" stroke={1.8} />
                    <span className="ml-2">{property.capacity} huéspedes</span>
                  </li>
                )}
                {typeof property.bedrooms === 'number' && (
                  <li className="flex items-center">
                    <IconBed className="h-5 w-5 text-gold-500" stroke={1.8} />
                    <span className="ml-2">
                      {property.bedrooms} {property.bedrooms === 1 ? 'dormitorio' : 'dormitorios'}
                    </span>
                  </li>
                )}
                {typeof property.bathrooms === 'number' && (
                  <li className="flex items-center">
                    <IconBath className="h-5 w-5 text-gold-500" stroke={1.8} />
                    <span className="ml-2">
                      {property.bathrooms} {property.bathrooms === 1 ? 'baño' : 'baños'}
                    </span>
                  </li>
                )}
              </ul>
            )}
            {/* Micro narrativa diferenciadora */}
            <section aria-labelledby="porque" className="mt-8">
              <h2 id="porque" className="font-display text-h3 font-semibold text-ink dark:text-white">
                ¿Por qué este refugio?
              </h2>
              <ul className="mt-4 grid gap-3 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-3">
                <li className="rounded-xl bg-sand-50 p-4 dark:bg-gray-800/60">
                  {rating
                    ? `Huéspedes lo califican con ${rating.rating.toFixed(2).replace('.', ',')} en ${rating.reviewCount} reseñas`
                    : 'Atendido personalmente por sus dueños, Superanfitriones en Airbnb'}
                </li>
                <li className="rounded-xl bg-sand-50 p-4 dark:bg-gray-800/60">
                  Reservando directo te ahorras la comisión de la plataforma
                </li>
                <li className="rounded-xl bg-sand-50 p-4 dark:bg-gray-800/60">
                  Te respondemos por WhatsApp antes y durante tu estadía
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

            {reviews.length > 0 && (
              <section aria-labelledby="resenas" className="mt-10">
                <h2 id="resenas" className="font-display text-h3 font-semibold text-ink dark:text-white">Lo que dicen los huéspedes</h2>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                  {reviews.map(r => (
                    <li key={r._id} className="rounded-xl border border-gray-200 p-5 text-sm shadow-sm dark:border-gray-700">
                      <p className="text-gray-700 dark:text-gray-300">“{r.quote}”</p>
                      <p className="mt-2 font-medium text-gray-900 dark:text-white">
                        {r.author}{r.location ? <span className="font-normal text-gray-500"> · {r.location}</span> : null}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

          </div>

            {/* SIDEBAR RESERVA */}
          <aside className="mt-12 space-y-8 self-start lg:mt-0 lg:sticky lg:top-28">
            <div
              id="reservar"
              className="scroll-mt-28 rounded-2xl border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <h2 className="font-display text-h3 font-semibold text-ink dark:text-white">Reserva directo</h2>
              <p className="mt-1 text-sm text-ink-subtle dark:text-ink-dark-subtle">
                {priceInfo ? (
                  <>
                    Desde <strong className="text-lg text-ink dark:text-white">{priceInfo.display}</strong> / noche
                    {priceInfo.seasonNote && <span className="ml-1 text-xs">({priceInfo.seasonNote})</span>}
                  </>
                ) : (
                  'Sin comisión de plataforma. Elige tus fechas para ver el precio.'
                )}
              </p>
              <div id="calendario" className="mt-5 scroll-mt-28">
                {property.bookingWidgetCode && !hasBeds24 ? (
                  <BookingWidget htmlCode={property.bookingWidgetCode} />
                ) : hasBeds24 ? (
                  <Beds24Booking
                    propId={property.beds24PropId}
                    roomId={property.beds24RoomId}
                    maxGuests={property.capacity || 4}
                    propertyName={property.name}
                    variant="sidebar"
                  />
                ) : (
                  <a
                    href={whatsappLink(bookingText)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 py-3.5 text-base font-semibold text-navy-950 shadow transition hover:bg-gold-300"
                  >
                    <IconBrandWhatsapp className="h-5 w-5" />
                    Consultar disponibilidad
                  </a>
                )}
              </div>
              {hasBeds24 && (
                <a
                  href={whatsappLink(bookingText)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-ink-subtle hover:text-navy-900 dark:text-gray-300"
                >
                  <IconBrandWhatsapp className="h-4 w-4" />
                  ¿Dudas? Escríbenos por WhatsApp
                </a>
              )}

              {(property.airbnbListingUrl || hostProfileUrl) && (
                <div className="mt-5 space-y-2">
                  <p className="border-t border-gray-100 pt-4 text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    Míranos en Airbnb
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {property.airbnbListingUrl && (
                      <a
                        href={property.airbnbListingUrl}
                        target="_blank"
                        rel="nofollow noopener"
                        className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:border-gold-300 hover:text-gold-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gold-500"
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
                        className="inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:border-gold-300 hover:text-gold-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gold-500"
                      >
                        Perfil de Superanfitrión
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div
              id="amenities"
              className="rounded-2xl border border-gray-200 bg-sand-50 p-6 dark:border-gray-700 dark:bg-gray-800"
            >
              <h2 className="font-display text-h3 font-semibold text-ink dark:text-white">Servicios incluidos</h2>
        <ul className="mt-6 grid grid-cols-1 gap-y-3 text-sm sm:grid-cols-2">
                {(property.amenities || []).map(a => (
          <li key={a} className="grid grid-cols-[1.75rem_1fr] items-start gap-x-2">
                    <span className="flex h-5 w-5 items-center justify-center text-gold-700 dark:text-gold-400" aria-hidden="true">
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
              url: `${SITE_URL}/refugios/${slug}`,
              address: { '@type': 'PostalAddress', addressLocality: property.location || undefined, addressCountry: 'CL' },
              ...(rating
                ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: rating.rating, reviewCount: rating.reviewCount, bestRating: 5 } }
                : {}),
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
      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur dark:border-gray-700 dark:bg-gray-900/95 md:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3 px-4 py-3">
          <span className="flex-1 text-sm text-ink-subtle dark:text-gray-200">
            {priceInfo ? (
              <>Desde <strong className="text-base text-ink dark:text-white">{priceInfo.display}</strong> / noche</>
            ) : (
              'Reserva directo, sin comisión'
            )}
          </span>
          <a
            href={whatsappLink(bookingText)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Consultar por WhatsApp"
            className="rounded-xl border border-gray-300 p-2.5 text-[#128C7E] dark:border-gray-600"
          >
            <IconBrandWhatsapp className="h-5 w-5" />
          </a>
          <a
            href="#reservar"
            className="rounded-xl bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 shadow"
          >
            Reservar
          </a>
        </div>
      </div>
    </div>
  )
}

