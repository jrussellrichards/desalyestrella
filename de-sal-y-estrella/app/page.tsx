import Link from 'next/link'
import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { Property, Testimonial } from '@/types' // Importamos Testimonial
import PropertyCard from '@/components/PropertyCard'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import EmailCapture from '@/components/EmailCapture' // Asegúrate de que la ruta sea correcta
import { urlFor } from '@/lib/image'
import Image from 'next/image'

const query = groq`*[_type == "property"] | order(_createdAt desc)[0...3]{
  _id,
  name,
  slug,
  location,
  tagline,
  gallery,
  capacity,
  bedrooms,
  bathrooms
}`

const testimonialQuery = groq`*[_type == "testimonial"] | order(_createdAt desc)[0...8]{
  _id,
  quote,
  author,
  location,
  rating
}`

export default async function HomePage() {
  // Hacemos ambas consultas en paralelo para mayor eficiencia
  const [properties, testimonials]: [Property[], Testimonial[]] =
    await Promise.all([client.fetch(query), client.fetch(testimonialQuery)])

  const heroImage =
    properties?.[2]?.gallery?.[3]
      ? urlFor(properties[2].gallery[3]).width(2000).height(1100).fit('crop').auto('format').url()
      : null

  return (
    <main className="bg-white dark:bg-gray-900">
      {/* Hero Section (modernizada) */}
      <section className="relative">
        {heroImage && (
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt={`Escena de ${properties[0]?.name || 'refugio'}`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/20 dark:from-black/80" />
          </div>
        )}
        <div className={`relative mx-auto max-w-4xl px-6 pt-40 pb-36 sm:pt-48 sm:pb-44 lg:px-8 ${!heroImage ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700 text-white rounded-b-3xl' : ''}`}>
          <div className="text-center">
            <h1 className="font-display text-hero font-semibold text-white drop-shadow-[0_4px_14px_rgba(0,0,0,0.35)]">
              Escapes costeros & cielos estrellados
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-copy-lg text-gray-200 md:text-lg">
              Refugios diseñados para desconectar, respirar mar y contemplar el cosmos en destinos únicos de Chile.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/refugios"
                className="inline-flex items-center rounded-md bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-black"
              >
                Ver refugios
              </Link>
              <a
                href="#porque-nosotros"
                className="inline-flex items-center rounded-md border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                ¿Por qué nosotros?
              </a>
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
            <div className="flex h-10 w-6 items-start justify-center">
              <span className="h-5 w-px animate-pulse rounded-full bg-white/60" />
            </div>
          </div>
        </div>
      </section>

      <section
        id="porque-nosotros"
        className="relative overflow-hidden py-24 sm:py-32"
      >
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_25%_20%,rgba(251,191,36,0.12),transparent_65%)] dark:[background:radial-gradient(circle_at_70%_30%,rgba(251,191,36,0.15),transparent_70%)]" />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-h2 font-semibold tracking-tight text-ink dark:text-white">
              ¿Por qué reservar con nosotros?
            </h2>
            <p className="mt-6 max-w-prose text-copy-lg text-ink-subtle dark:text-ink-dark-subtle">
              Diseñamos pocos refugios para maximizar calidad y autenticidad.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: 'Selección única', d: 'Few, not many. Solo refugios que cumplen estándares de atmósfera y descanso.' },
              { t: 'Superhost probado', d: 'Historial consistente de evaluaciones altas y soporte rápido.' },
              { t: 'Cancelación flexible', d: 'Reembolso completo hasta 7 días antes (salvo fechas pico indicadas).' },
              { t: 'Experiencias locales', d: 'Recomendaciones verificadas para sumar valor sin improvisar.' },
              { t: 'Transparencia de precios', d: 'Sin tarifas sorpresa al final: claridad desde el inicio.' },
              { t: 'Soporte durante tu estadía', d: 'Acompañamiento antes, durante y después de la reserva.' }
            ].map(item => (
              <div
                key={item.t}
                className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/70 dark:hover:border-amber-400"
              >
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600 ring-1 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-800/60">
                  <svg
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    className="h-5 w-5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {item.t}
                </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {item.d}
                </p>
                <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px w-full scale-x-0 bg-gradient-to-r from-amber-400 to-amber-500 transition group-hover:scale-x-100" />
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="#refugios-destacados"
              className="inline-flex items-center rounded-md bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Ver refugios
            </a>
            <a
              href="/contacto"
              className="inline-flex items-center rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:border-amber-400 hover:text-amber-600 dark:border-gray-600 dark:text-gray-200 dark:hover:border-amber-500 dark:hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              Consultar fechas
            </a>
          </div>
        </div>
      </section>

      {/* Sección de Propiedades Destacadas */}
      <div id="refugios-destacados" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Refugios seleccionados
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Arquitectura simple, confort honesto y naturaleza protagonista.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </div>

      {/* Testimonios con fondo radial suave */}
      <section className="relative overflow-hidden py-24 dark:bg-gray-800/80 sm:py-32">
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_30%_30%,rgba(251,191,36,0.15),transparent_60%)] dark:[background:radial-gradient(circle_at_70%_40%,rgba(251,191,36,0.15),transparent_65%)]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Lo que dicen nuestros huéspedes
            </h2>
          </div>
          <div className="mt-14">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </div>
      </section>

      {/* Email Capture (band limpia) */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <EmailCapture />
        </div>
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LodgingBusiness',
            name: 'De Sal y Estrella',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              reviewCount: testimonials.length || 1
            }
          })
        }}
      />
    </main>
  )
}
