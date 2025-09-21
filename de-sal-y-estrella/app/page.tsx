import Link from 'next/link'
import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { Property, Testimonial, GlobalSettings } from '@/types'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import EmailCapture from '@/components/EmailCapture' // Asegúrate de que la ruta sea correcta
import { urlFor } from '@/lib/image'
import Image from 'next/image'
import { fetchSettings } from '@/lib/settings'

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
  const [properties, testimonials, settings]: [Property[], Testimonial[], GlobalSettings] = await Promise.all([
    client.fetch(query),
    client.fetch(testimonialQuery),
    fetchSettings()
  ])

  const heroImage = settings?.heroImage?.asset
    ? urlFor(settings.heroImage).width(2000).height(1100).fit('crop').auto('format').url()
    : (properties?.[2]?.gallery?.[3]
        ? urlFor(properties[2].gallery[3]).width(2000).height(1100).fit('crop').auto('format').url()
        : null)

  const destinations: Required<GlobalSettings>['destinations'] = (settings?.destinations && settings.destinations.length > 0)
    ? settings.destinations
    : [
        {
          _key: 'pichilemu-fallback',
          title: 'Pichilemu',
          slugParam: 'Pichilemu',
          description: 'Capital del surf chileno. Olas consistentes, energía salina y atardeceres intensos.'
        },
        {
          _key: 'la-serena-fallback',
          title: 'La Serena',
          slugParam: 'La Serena',
          description: 'Playas amplias, bruma matinal, arquitectura tradicional y cielos diáfanos.'
        }
      ]

  const heroTitle = settings?.heroTitle || 'Escapes costeros & cielos estrellados'
  const heroSubtitle = settings?.heroSubtitle || 'Refugios diseñados para desconectar, respirar mar y contemplar el cosmos en destinos únicos de Chile.'

  const whyUs: NonNullable<GlobalSettings['whyUs']> = settings?.whyUs?.length
    ? settings.whyUs
    : [
        { title: 'Selección única', description: 'Few, not many. Solo refugios que cumplen estándares de atmósfera y descanso.' },
        { title: 'Superhost probado', description: 'Historial consistente de evaluaciones altas y soporte rápido.' },
        { title: 'Cancelación flexible', description: 'Reembolso completo hasta 7 días antes (salvo fechas pico indicadas).' },
        { title: 'Experiencias locales', description: 'Recomendaciones verificadas para sumar valor sin improvisar.' },
        { title: 'Transparencia de precios', description: 'Sin tarifas sorpresa: claridad desde el inicio.' },
        { title: 'Soporte en la estadía', description: 'Acompañamiento antes, durante y después de la reserva.' }
      ]

  return (
    <main className="bg-white dark:bg-gray-900">
      {/* Hero Section (modernizada) */}
      <section className="relative">
        {heroImage && (
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt={`Escena de ${properties?.[0]?.name || 'refugio'}`}
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
              {heroTitle}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-copy-lg text-gray-200">
              {heroSubtitle}
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
            {whyUs.map((item) => (
              <div
                key={item._key || item.title}
                className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800/70 dark:hover:border-amber-400"
              >
                <h3 className="font-display text-base font-semibold text-ink dark:text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-subtle dark:text-ink-dark-subtle">
                  {item.description}
                </p>
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

      {/* Sección de Destinos dinámica */}
      <section id="refugios-destacados" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Destinos</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">Elige tu próxima escapada costera.</p>
          </div>
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-10 sm:mt-20 sm:grid-cols-2">
            {destinations?.map((dest) => {
              const imageUrl = dest.image?.asset ? urlFor(dest.image).width(1200).height(900).fit('crop').auto('format').url() : (dest.slugParam.toLowerCase().includes('pich') ? '/pichilemu-surf.jpg' : '/la-serena-faro.jpg')
              return (
                <Link
                  key={dest._key || dest.slugParam}
                  href={`/refugios?l=${encodeURIComponent(dest.slugParam)}`}
                  className="group relative block h-72 w-full overflow-hidden rounded-2xl focus:outline-none focus:ring-4 focus:ring-amber-500/60"
                >
                  <div className="absolute inset-0">
                    <Image
                      src={imageUrl}
                      alt={dest.title}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />
                  </div>
                  <div className="relative flex h-full flex-col justify-end p-6">
                    <h3 className="text-2xl font-semibold text-white drop-shadow-md">{dest.title}</h3>
                    {dest.description && (
                      <p className="mt-2 max-w-xs text-sm text-white/85">{dest.description}</p>
                    )}
                    <span className="mt-4 inline-flex items-center text-sm font-medium text-amber-300">Ver refugios <span className="ml-1 transition group-hover:translate-x-1">→</span></span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

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
