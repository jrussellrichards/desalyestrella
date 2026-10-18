import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { Property, Testimonial } from '@/types'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import EmailCapture from '@/components/EmailCapture'
import RefugioCard from '@/components/RefugioCard'
import {
  IconBrandWhatsapp,
  IconStarFilled,
  IconCalendarCheck,
  IconShieldCheck,
  IconMessageCircle,
  IconPigMoney,
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

const steps = [
  {
    icon: IconCalendarCheck,
    title: 'Elige fechas',
    text: 'Revisa disponibilidad y precio final en la ficha de cada refugio.',
  },
  {
    icon: IconShieldCheck,
    title: 'Reserva seguro',
    text: 'Pagas en nuestro sistema de reservas, el mismo que conecta con Airbnb.',
  },
  {
    icon: IconMessageCircle,
    title: 'Te acompañamos',
    text: 'Instrucciones de llegada y atención directa por WhatsApp durante tu estadía.',
  },
]

const faqs = [
  {
    q: '¿Es seguro reservar directo?',
    a: `Sí. Somos Superanfitriones en Airbnb, con ${AIRBNB_STATS.totalReviews} reseñas y un promedio de ${formatRating(AIRBNB_STATS.averageRating)}. Reservando directo te ahorras la comisión de la plataforma y hablas directamente con nosotros.`,
  },
  {
    q: '¿Por qué es más barato reservar aquí?',
    a: 'Las plataformas cobran una tarifa de servicio al huésped. Reservando directo no pagas esa comisión.',
  },
  {
    q: '¿Cómo funciona el check-in?',
    a: 'Es autónomo o asistido, según prefieras. Antes de tu llegada te enviamos instrucciones precisas y el código de acceso.',
  },
  {
    q: '¿Cuál es la política de cancelación?',
    a: 'Flexible: reembolso completo hasta 7 días antes de la llegada, salvo fechas peak indicadas al reservar.',
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
    <div className="bg-white dark:bg-gray-900">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-navy-900 text-white">
        {/* cielo estrellado sutil, como en el logo */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 12% 18%, rgba(223,192,147,.55) 0 1.5px, transparent 2px), radial-gradient(circle at 38% 8%, rgba(255,255,255,.45) 0 1px, transparent 1.5px), radial-gradient(circle at 27% 62%, rgba(223,192,147,.4) 0 1px, transparent 1.5px), radial-gradient(circle at 46% 84%, rgba(255,255,255,.35) 0 1px, transparent 1.5px), radial-gradient(circle at 6% 88%, rgba(223,192,147,.45) 0 1.5px, transparent 2px)',
          }}
        />
        <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-gold-500/10 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-12 sm:pb-24 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8 lg:pt-20">
          <div>
            <div className="flex items-center gap-4">
              <Image src="/brand/isotipo-claro.png" alt="" width={600} height={600} priority className="h-16 w-16 sm:h-20 sm:w-20" />
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-300 sm:text-sm">
                Frente al mar · La Serena y Pichilemu
              </p>
            </div>

            <h1 className="mt-8 font-display text-hero font-semibold">
              Despierta frente al mar en <span className="italic text-gold-300">La Serena</span> o <span className="italic text-gold-300">Pichilemu</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">
              Departamentos en Aqua Resort, en el mejor sector de la Avenida del Mar, y una cabaña a pasos de las olas de Pichilemu. Reserva directo con nosotros y ahórrate la comisión de las plataformas.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#refugios"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-7 py-4 text-base font-semibold text-navy-950 shadow-lg transition hover:bg-gold-300"
              >
                Ver refugios y precios
                <IconArrowRight className="h-5 w-5" />
              </a>
              <a
                href={whatsappLink('Hola, quisiera consultar disponibilidad')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 px-7 py-4 text-base font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/20"
              >
                <IconBrandWhatsapp className="h-5 w-5" />
                Consultar por WhatsApp
              </a>
            </div>

            <a
              href={AIRBNB_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 text-sm text-white/80 hover:text-white"
            >
              <span className="flex text-gold-300">
                {[0, 1, 2, 3, 4].map(i => (
                  <IconStarFilled key={i} className="h-4 w-4" />
                ))}
              </span>
              <span>
                <strong className="font-semibold text-white">{formatRating(AIRBNB_STATS.averageRating)}</strong> en {AIRBNB_STATS.totalReviews} reseñas · Superanfitriones en Airbnb
              </span>
            </a>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-gold-500/40 sm:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src="/destinos/la-serena-vista.jpg"
                alt="Vista al mar y las palmeras de la Avenida del Mar desde Aqua Resort La Serena"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover object-[50%_80%]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/80 to-transparent p-5 pt-16">
                <p className="text-xs font-semibold uppercase tracking-widest text-gold-300">Aqua Resort La Serena</p>
                <p className="font-display text-xl font-semibold">Frente al mar, en la Avenida del Mar</p>
              </div>
            </div>
            <div className="absolute -left-4 -top-6 hidden w-40 overflow-hidden rounded-2xl shadow-xl ring-4 ring-navy-900 sm:block lg:-left-10 lg:w-48">
              <div className="relative aspect-[4/3]">
                <Image src="/destinos/pichilemu-cabana.jpg" alt="Cabaña en Pichilemu" fill sizes="200px" className="object-cover" />
              </div>
              <p className="bg-white px-3 py-2 text-xs font-semibold text-navy-900">Cabaña en Pichilemu</p>
            </div>
          </div>
        </div>
      </section>

      {/* BARRA DE CONFIANZA */}
      <section className="border-b border-gray-100 bg-sand-50 dark:border-gray-800 dark:bg-gray-800/50">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 text-center sm:grid-cols-4 lg:px-8">
          {[
            { k: formatRating(AIRBNB_STATS.averageRating), v: 'Promedio en Airbnb' },
            { k: String(AIRBNB_STATS.totalReviews), v: 'Reseñas reales' },
            { k: 'Superanfitriones', v: 'Reconocidos por Airbnb' },
            { k: '0%', v: 'Comisión al reservar directo' },
          ].map(item => (
            <div key={item.v}>
              <dt className="sr-only">{item.v}</dt>
              <dd className="font-display text-2xl font-semibold text-navy-900 dark:text-white sm:text-3xl">{item.k}</dd>
              <dd className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-faint dark:text-ink-dark-faint">{item.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* REFUGIOS */}
      <section id="refugios" className="scroll-mt-24 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-700">Nuestros refugios</p>
            <h2 className="mt-2 font-display text-h2 font-semibold text-ink dark:text-white">Elige dónde despertar</h2>
            <p className="mt-4 text-copy-lg text-ink-subtle dark:text-ink-dark-subtle">
              Tres refugios que atendemos personalmente. Revisa fotos, disponibilidad y precio, y reserva directo.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {properties.map(property => (
              <RefugioCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* RESERVA DIRECTO */}
      <section className="bg-navy-900 py-20 text-white sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-300">Reserva directo</p>
            <h2 className="mt-2 font-display text-h2 font-semibold">Mismo refugio, sin comisión de plataforma</h2>
            <p className="mt-5 text-copy-lg text-white/80">
              Somos los mismos anfitriones que te reciben en Airbnb. Al reservar aquí no pagas la tarifa de servicio de la plataforma y hablas directamente con nosotros, antes y durante tu estadía.
            </p>
            <div className="mt-8 flex items-center gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
              <IconPigMoney className="h-8 w-8 shrink-0 text-gold-300" />
              <p className="text-sm text-white/85">
                Ese ahorro queda para ti: una cena frente al mar, un tour a las estrellas o una noche más.
              </p>
            </div>
          </div>
          <ol className="grid gap-5">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-5 rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold-500 text-navy-950">
                  <step.icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold">{i + 1}. {step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-white/75">{step.text}</p>
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
            <p className="text-sm font-semibold uppercase tracking-wider text-gold-700">Dos destinos</p>
            <h2 className="mt-2 font-display text-h2 font-semibold text-ink dark:text-white">Del mar a las estrellas</h2>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {[
              {
                name: 'La Serena',
                image: '/destinos/la-serena.jpg',
                text: 'Playas amplias en la Avenida del Mar, ballenas en la costa y los cielos más limpios del mundo en el Valle del Elqui.',
                count: laSerena.length,
                guide: '/experiencias/estrella',
                param: 'La Serena',
              },
              {
                name: 'Pichilemu',
                image: '/destinos/pichilemu-cabana.jpg',
                text: 'La capital del surf chileno: olas para todos los niveles, salinas de Cáhuil y atardeceres sobre el Pacífico.',
                count: pichilemu.length,
                guide: '/experiencias/sal',
                param: 'Pichilemu',
              },
            ].map(dest => (
              <div key={dest.name} className="group relative overflow-hidden rounded-3xl">
                <div className="relative aspect-[4/3]">
                  <Image src={dest.image} alt={dest.name} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/25 to-transparent" />
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
        <section className="bg-sand-50 py-20 dark:bg-gray-800/50 sm:py-28">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-gold-700">Reseñas</p>
              <h2 className="mt-2 font-display text-h2 font-semibold text-ink dark:text-white">Lo que dicen nuestros huéspedes</h2>
              <a href={AIRBNB_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-medium text-gold-700 hover:underline">
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
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-navy-900 px-8 py-14 text-center text-white sm:px-16">
          <h2 className="font-display text-h2 font-semibold">¿Tienes fechas en mente?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Escríbenos y te confirmamos disponibilidad y precio al tiro. O revisa las fechas libres en cada refugio.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href={whatsappLink('Hola, quisiera consultar disponibilidad para estas fechas: ')}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-7 py-4 font-semibold text-navy-950 hover:bg-gold-400"
            >
              <IconBrandWhatsapp className="h-5 w-5" />
              Escribir por WhatsApp
            </a>
            <a href="#refugios" className="inline-flex items-center justify-center rounded-xl px-7 py-4 font-semibold text-white ring-1 ring-white/30 hover:bg-white/10">
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
