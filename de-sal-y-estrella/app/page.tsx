import Link from 'next/link'
import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { Property, Testimonial, GlobalSettings } from '@/types'
import TestimonialCarousel from '@/components/TestimonialCarousel'
import EmailCapture from '@/components/EmailCapture' // Asegúrate de que la ruta sea correcta
import { urlFor } from '@/lib/image'
import Image from 'next/image'
import { fetchSettings } from '@/lib/settings'
import { IconBrandWhatsapp, IconStarFilled, IconCalendar } from '@tabler/icons-react'

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
      {/* Hero Section (Centrado Vertical + Menos gap) */}
      <section className="relative h-[92vh] min-h-[600px] w-full overflow-hidden">
        {heroImage && (
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt="Vista del refugio"
              fill
              priority
              className="object-cover"
            />
            {/* Capas de gradiente refinadas para legibilidad */}
            <div className="absolute inset-0 bg-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          </div>
        )}

        <div className="relative z-10 mx-auto grid h-full w-full max-w-[1920px] grid-cols-1 items-center gap-12 px-6 sm:px-8 md:grid-cols-12 lg:px-12 pb-32 md:pb-40">

          {/* Columna de Texto - Izquierda (Más ancho para balancear) */}
          <div className="md:col-span-12 lg:col-span-8 flex flex-col justify-center pt-20 md:pt-0 pl-4 lg:pl-0">
            <h1 className="flex flex-col text-white drop-shadow-2xl">
              <span className="text-xl font-medium tracking-widest text-gray-200 uppercase sm:text-2xl mb-2">
                Bienvenido a
              </span>
              <span className="text-6xl font-extrabold tracking-tight text-white sm:text-8xl md:text-9xl leading-[0.9]">
                De sal
              </span>
              <span className="font-display italic text-6xl text-amber-200 sm:text-8xl md:text-9xl leading-none mt-2">
                y estrella
              </span>
            </h1>

            <div className="mt-10 flex max-w-3xl items-start gap-6 border-l-4 border-amber-500 pl-8 backdrop-blur-sm bg-black/10 py-6 pr-8 rounded-r-2xl">
              <p className="text-xl font-light leading-relaxed text-gray-100 sm:text-2xl">
                Donde el desierto florece y el mar abraza las estrellas. <br />
                <strong className="font-semibold text-white">La Serena & Pichilemu.</strong>
              </p>
            </div>
          </div>

          {/* Columna de CTA - Derecha (Optimizada para Captación) */}
          <div className="md:col-span-12 lg:col-span-4 flex w-full flex-col items-start lg:items-end justify-center pr-4 lg:pr-12 mt-10 lg:mt-0">

            {/* Dual Action Bar: Filtra intención (Exploración vs Acción) */}
            {/* Nuevos Botones Modernos: Separados y con jerarquía visual Clara */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href="#coleccion"
                className="px-8 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-medium hover:bg-white/20 transition-all"
              >
                Ver refugios
              </a>

              <a
                href="https://wa.me/56990736569?text=Hola,%20quisiera%20reservar%20una%20estadía..."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-2xl bg-white text-gray-900 font-bold shadow-xl hover:scale-105 hover:bg-gray-50 transition-all flex items-center gap-3"
              >
                <span>Reserva Directa</span>
                <IconBrandWhatsapp className="h-5 w-5 text-green-600" />
              </a>
            </div>

            {/* Live Trust Indicator */}
            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-white/90 pr-4 drop-shadow-md">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 border border-white/30"></span>
              </span>
              <span>Online: Respondemos en &lt; 5 min</span>
            </div>
          </div>
        </div>

        {/* Hero Footer: Stats & Features para llenar el espacio inferior */}
        <div className="absolute bottom-0 left-0 w-full z-20 border-t border-white/10 bg-black/40 backdrop-blur-md">
          <div className="mx-auto max-w-[1920px] px-6 sm:px-8 lg:px-12 py-5">
            <div className="flex flex-wrap justify-between items-center gap-6 text-white/90">

              {/* Features (Left) */}
              <div className="flex gap-8 md:gap-16 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
                <div className="flex items-center gap-3 min-w-max group">
                  <span className="text-2xl text-amber-400">★</span>
                  <a
                    href="https://www.airbnb.cl/users/profile/1469564861055215917?previous_page_name=PdpHomeMarketplace"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col"
                  >
                    <span className="font-bold text-sm uppercase tracking-wider text-white group-hover:text-amber-300 transition-colors">Superhost Airbnb</span>
                    <span className="text-[10px] text-gray-300 font-light tracking-wide">Trayectoria & Confianza</span>
                  </a>
                </div>
                <div className="flex items-center gap-3 min-w-max">
                  <span className="text-2xl text-amber-400">❤</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm uppercase tracking-wider text-white">Favorito entre Huéspedes</span>
                    <span className="text-[10px] text-gray-300 font-light tracking-wide">Top 5% Propiedades</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 min-w-max">
                  <span className="text-2xl text-amber-400">✦</span>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm uppercase tracking-wider text-white">Ubicacion privilegiada</span>
                    <span className="text-[10px] text-gray-300 font-light tracking-wide">Seguras y Frente al Mar</span>
                  </div>
                </div>
              </div>

              {/* Trust/Rating (Right) */}
              <div className="hidden md:flex items-center gap-4 pl-8 border-l border-white/20">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-8 w-8 rounded-full bg-gray-200 border-2 border-black overflow-hidden relative">
                      <Image src={`https://randomuser.me/api/portraits/thumb/men/${i * 4}.jpg`} alt="Guest" fill className="object-cover grayscale hover:grayscale-0 transition" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex text-amber-400 text-xs">★★★★★</div>
                  <span className="text-xs font-medium text-white">+500 Huéspedes Felices</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Colección Exclusiva (Propiedades específicas) */}
      <section id="coleccion" className="py-24 bg-sand-50/50 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <span className="text-amber-600 font-semibold tracking-wide uppercase text-sm">Escasez y Exclusividad</span>
            <h2 className="mt-2 text-3xl font-display font-bold text-gray-900 dark:text-white sm:text-4xl">Colección Privada</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Propiedades exclusivas con seguridad, privacidad y todas las comodidades premium. <br className="hidden sm:block" />
              <strong className="text-gray-900 dark:text-white font-medium">Tus vacaciones no estarán al azar.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => {
              const mainImage = property.gallery?.[0]
                ? urlFor(property.gallery[0]).width(800).height(600).url()
                : '/placeholder.jpg'

              return (
                <div key={property._id} className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                  {/* Imagen */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                    <Image
                      src={mainImage}
                      alt={property.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="inline-flex items-center rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm shadow-sm">
                        <IconStarFilled className="mr-1 h-3 w-3 text-amber-400" />
                        4.9
                      </span>
                      <span className="inline-flex items-center rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm shadow-sm">
                        Superhost
                      </span>
                    </div>
                  </div>

                  {/* Contenido */}
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-2 text-sm text-ocean-600 font-medium">{property.location}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-ocean-700 transition-colors">
                      <Link href={`/refugios/${property.slug.current}`}>
                        <span className="absolute inset-0" />
                        {property.name}
                      </Link>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-6 flex-grow">
                      {property.tagline || 'Un refugio único frente al mar, diseñado para el descanso absoluto.'}
                    </p>

                    {/* Botón CTA Whatsapp */}
                    <div className="relative z-10 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
                      <Link
                        href={`/refugios/${property.slug.current}`}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                      >
                        <IconCalendar className="h-5 w-5" />
                        Ver Disponibilidad
                      </Link>
                    </div>
                  </div>
                </div>
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
            <p className="mt-6 mx-auto max-w-2xl text-copy-lg text-ink-subtle dark:text-ink-dark-subtle">
              De Sal y Estrella ofrece refugios pensados para el viajero moderno. Son tu base para explorar y tu espacio para desconectar, con todo el confort y una conexión real al paisaje chileno.
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
              href="#coleccion"
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

      {/* FAQ Rápida */}
      <section className="py-16 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">Preguntas Frecuentes</h2>
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">¿Es seguro reservar directo?</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">Totalmente. Somos Superhosts en Airbnb con años de trayectoria. Al reservar directo te ahorras las comisiones de la plataforma y tienes contacto directo con nosotros.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">¿Cómo funciona el check-in?</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">Es autónomo o asistido, según prefieras. Te enviaremos instrucciones precisas y un código de acceso antes de tu llegada.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">¿Aceptan mascotas?</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">Nos encantan los animales, pero depende de cada propiedad. Por favor consúltanos por WhatsApp antes de reservar.</p>
            </div>
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
