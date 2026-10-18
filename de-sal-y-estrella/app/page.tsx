import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { Property, Testimonial } from '@/types'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import EmailCapture from '@/components/EmailCapture'
import RefugioCard from '@/components/RefugioCard'
import { Laurel } from '@/components/Laurel'
import {
  IconBrandWhatsapp,
  IconAwardFilled,
  IconStarFilled,
  IconBeach,
  IconMessageCircle,
  IconClock24,
  IconArrowRight,
  IconChevronDown,
} from '@tabler/icons-react'
import { AIRBNB_PROFILE_URL, AIRBNB_STATS, INSTAGRAM_URL, SITE_NAME, SITE_URL, whatsappLink } from '@/lib/site'

export const revalidate = 300

const query = groq`*[_type == "property"] | order(_createdAt asc){
  _id,
  name,
  slug,
  location,
  tagline,
  gallery,
  capacity,
  bedrooms,
  bathrooms,
  basePrice,
  seasonalAdjustments,
  rating,
  reviewCount
}`

const testimonialQuery = groq`*[_type == "testimonial"] | order(_createdAt desc)[0...8]{
  _id,
  quote,
  author,
  location,
  rating
}`

const formatRating = (n: number) => n.toFixed(2).replace('.', ',')

const reasons = [
  {
    icon: IconBeach,
    title: 'Frente al mar, de verdad',
    text: 'En el mejor sector de la Avenida del Mar y a pasos de las olas de Pichilemu.',
  },
  {
    icon: IconStarFilled,
    title: `${formatRating(AIRBNB_STATS.averageRating)} en ${AIRBNB_STATS.totalReviews} reseñas`,
    text: 'Superanfitriones: nuestros huéspedes vuelven y nos recomiendan.',
  },
  {
    icon: IconMessageCircle,
    title: 'Te atienden sus dueños',
    text: 'Javier te responde por WhatsApp antes y durante tu estadía.',
  },
  {
    icon: IconClock24,
    title: 'Respuestas 24/7',
    text: 'Llegada, salida, el departamento y qué hacer en la zona, a cualquier hora por WhatsApp.',
  },
]

const faqs = [
  {
    q: '¿Es seguro reservar aquí?',
    a: `Sí. Somos Superanfitriones en Airbnb, con ${AIRBNB_STATS.totalReviews} reseñas y un promedio de ${formatRating(AIRBNB_STATS.averageRating)}. Reservas hablando directamente con nosotros por WhatsApp.`,
  },
  {
    q: '¿Cómo reservo y pago?',
    a: 'Escríbenos por WhatsApp con tus fechas y te confirmamos disponibilidad y precio. Puedes pagar por transferencia directa o reservar a través de Airbnb.',
  },
  {
    q: '¿Cómo funciona el check-in?',
    a: 'Antes de tu llegada te enviamos por WhatsApp instrucciones claras para entrar, y te acompañamos si lo necesitas.',
  },
  {
    q: '¿Cuál es la política de cancelación?',
    a: 'Flexible: reembolso completo hasta 7 días antes de la llegada, salvo fechas peak, que te avisamos al reservar.',
  },
  {
    q: '¿Aceptan mascotas?',
    a: 'Depende de cada refugio. Escríbenos por WhatsApp antes de reservar y te confirmamos.',
  },
]

export default async function HomePage() {
  const [properties, testimonials]: [Property[], Testimonial[]] = await Promise.all([
    client.fetch(query),
    client.fetch(testimonialQuery),
  ])


  const laSerena = properties.filter(p => /serena/i.test(p.location || ''))
  const pichilemu = properties.filter(p => /pichilemu/i.test(p.location || ''))

  return (
    <div className="bg-salt dark:bg-gray-900">
      {/* HERO */}
      <section className="relative isolate flex min-h-[78vh] items-end overflow-hidden text-white sm:min-h-[84vh]">
        <Image
          src="/destinos/hero-mar.jpg"
          alt="Vista al mar y las palmeras de la Avenida del Mar desde Aqua Resort La Serena"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[50%_60%]"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-950/70 via-gray-950/20 to-transparent" />

        <div className="mx-auto w-full max-w-7xl px-6 pb-14 sm:pb-20 lg:px-8">
          <p className="inline-flex items-center rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold backdrop-blur">
            La Serena · Pichilemu
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-hero font-bold">Despierta frente al mar</h1>
          <p className="mt-4 max-w-xl text-lg text-white/90 sm:text-xl">Departamentos en Aqua Resort La Serena y una cabaña en Pichilemu.</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#refugios"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-base font-semibold text-navy-900 shadow-lg transition hover:bg-sea-50"
            >
              Ver refugios y precios
              <IconArrowRight className="h-5 w-5" />
            </a>
            <a
              href={whatsappLink('Hola, quisiera consultar disponibilidad')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-7 py-4 text-base font-semibold text-white ring-1 ring-white/50 backdrop-blur transition hover:bg-white/20"
            >
              <IconBrandWhatsapp className="h-5 w-5" />
              WhatsApp
            </a>
          </div>

        </div>
      </section>

      {/* BARRA DE CONFIANZA: una línea, al estilo de la ficha de Airbnb */}
      <section className="border-b border-gray-100 bg-sea-50 dark:border-gray-800 dark:bg-gray-800/50">
        <a
          href={AIRBNB_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mx-auto flex max-w-3xl flex-col items-center px-4 py-7 text-navy-900 dark:text-white"
        >
          <dl className="flex w-full items-center justify-center">
            <div className="flex flex-col items-center px-3 sm:px-8">
              <dt className="sr-only">Calificación global</dt>
              <dd className="font-display text-xl font-semibold leading-none sm:text-2xl">{formatRating(AIRBNB_STATS.averageRating)}</dd>
              <dd className="mt-1 flex text-gold-500" aria-hidden="true">
                {[0, 1, 2, 3, 4].map(i => (
                  <IconStarFilled key={i} className="h-3 w-3" />
                ))}
              </dd>
            </div>
            <div className="flex items-center gap-1.5 border-x border-navy-900/15 px-3 dark:border-white/20 sm:px-8">
              <Laurel className="h-10 w-4 shrink-0 text-gold-500" />
              <div className="text-center leading-tight">
                <dt className="sr-only">Distinción</dt>
                <dd className="font-display text-sm font-semibold sm:text-lg">Favorito entre huéspedes</dd>
                <dd className="text-[11px] text-ink-faint dark:text-ink-dark-faint sm:text-xs">Top 10% en Airbnb</dd>
              </div>
              <Laurel className="h-10 w-4 shrink-0 text-gold-500" flip />
            </div>
            <div className="flex flex-col items-center px-3 sm:px-8">
              <dt className="sr-only">Reseñas</dt>
              <dd className="font-display text-xl font-semibold leading-none sm:text-2xl">{AIRBNB_STATS.totalReviews}</dd>
              <dd className="mt-1 text-xs text-ink-faint dark:text-ink-dark-faint">Reseñas</dd>
            </div>
          </dl>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-ink-subtle dark:text-ink-dark-subtle">
            <IconAwardFilled className="h-4 w-4 text-[#FF385C]" />
            Superanfitriones en Airbnb
          </p>
        </a>
      </section>

      {/* REFUGIOS */}
      <section id="refugios" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-sea-600">Nuestros refugios</p>
            <h2 className="mt-2 font-display text-h2 font-semibold text-ink dark:text-white">Elige dónde despertar</h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {properties.map(property => (
              <RefugioCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* POR QUÉ NOSOTROS */}
      <section className="bg-sea-50 py-20 text-navy-900 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-sea-600">Por qué De Sal y Estrella</p>
            <h2 className="mt-2 font-display text-h2 font-semibold">Refugios que se cuidan con cariño</h2>
            <p className="mt-5 text-copy-lg text-ink-subtle">
              Pocos refugios, elegidos y atendidos por nosotros mismos.
            </p>
          </div>
          <ol className="grid gap-5">
            {reasons.map(step => (
              <li key={step.title} className="flex gap-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sea-100">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sea-500 text-white">
                  <step.icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink-subtle">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* DESTINOS */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-sea-600">Dos destinos</p>
            <h2 className="mt-2 font-display text-h2 font-semibold text-ink dark:text-white">Del mar a las estrellas</h2>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                name: 'La Serena',
                image: '/destinos/la-serena.jpg',
                text: 'Playa, ballenas y el Valle del Elqui.',
                count: laSerena.length,
                guide: '/experiencias/estrella',
                param: 'La Serena',
              },
              {
                name: 'Pichilemu',
                image: '/destinos/pichilemu-cabana.jpg',
                text: 'Surf, salinas y atardeceres.',
                count: pichilemu.length,
                guide: '/experiencias/sal',
                param: 'Pichilemu',
              },
            ].map(dest => (
              <div key={dest.name} className="group relative overflow-hidden rounded-3xl">
                <div className="relative aspect-[4/3]">
                  <Image src={dest.image} alt={dest.name} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/75 via-gray-950/20 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <h3 className="font-display text-3xl font-semibold text-white">{dest.name}</h3>
                  <p className="mt-2 max-w-md text-sm leading-relaxed text-white/85">{dest.text}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      href={`/refugios?l=${encodeURIComponent(dest.param)}`}
                      className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-navy-900 hover:bg-gold-100"
                    >
                      {dest.count > 1 ? `Ver los ${dest.count} refugios` : dest.count === 1 ? 'Ver el refugio' : 'Ver refugios'}
                    </Link>
                    <Link href={dest.guide} className="rounded-lg px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/40 hover:bg-white/10">
                      Qué hacer
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      {testimonials.length > 0 && (
        <section className="bg-sea-50 py-20 dark:bg-gray-800/50 sm:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-sea-600">Reseñas</p>
              <h2 className="mt-2 font-display text-h2 font-semibold text-ink dark:text-white">Lo que dicen nuestros huéspedes</h2>
              <a href={AIRBNB_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-medium text-sea-700 hover:underline">
                Ver las {AIRBNB_STATS.totalReviews} reseñas en Airbnb
              </a>
            </div>
            <div className="mt-12">
              <TestimonialCarousel testimonials={testimonials} />
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section id="preguntas" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h2 className="text-center font-display text-h2 font-semibold text-ink dark:text-white">Preguntas frecuentes</h2>
          <div className="mt-10 divide-y divide-gray-200 border-y border-gray-200 dark:divide-gray-700 dark:border-gray-700">
            {faqs.map(f => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-ink dark:text-white [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <IconChevronDown className="h-5 w-5 shrink-0 text-gold-600 transition group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-subtle dark:text-ink-dark-subtle">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="px-6 pb-20 lg:px-8">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-sea-500 to-sea-700 px-8 py-14 text-center text-white sm:px-16">
          <h2 className="font-display text-h2 font-semibold">¿Tienes fechas en mente?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/90">
            Escríbenos y te respondemos al tiro.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={whatsappLink('Hola, quisiera consultar disponibilidad para estas fechas: ')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 font-semibold text-sea-700 hover:bg-sea-50"
            >
              <IconBrandWhatsapp className="h-5 w-5" />
              Escribir por WhatsApp
            </a>
            <a href="#refugios" className="inline-flex items-center justify-center rounded-full px-7 py-4 font-semibold text-white ring-1 ring-white/60 hover:bg-white/10">
              Ver refugios
            </a>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="pb-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <EmailCapture />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'LodgingBusiness',
              name: SITE_NAME,
              url: SITE_URL,
              image: `${SITE_URL}/og.jpg`,
              telephone: '+56990736569',
              sameAs: [INSTAGRAM_URL, AIRBNB_PROFILE_URL],
              areaServed: ['La Serena', 'Pichilemu'],
              address: { '@type': 'PostalAddress', addressRegion: 'Coquimbo', addressCountry: 'CL' },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
            },
          ]),
        }}
      />
    </div>
  )
}
