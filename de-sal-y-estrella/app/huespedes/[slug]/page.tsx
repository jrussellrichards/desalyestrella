import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { Property } from '@/types'
import { urlFor } from '@/lib/image'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import Image from 'next/image'
import { IconMapPin, IconInfoCircle, IconCurrencyDollar, IconStar } from '@tabler/icons-react'

// Revalidación ISR (5 min)
export const revalidate = 300

const propertyQuery = groq`*[_type == "property" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  location,
  gallery
}`

export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await client.fetch(
    groq`*[_type == "property"]{"slug": slug}`
  )
  return slugs.map(({ slug }) => ({ slug: slug.current }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return {
    title: `Guía del Huésped - ${slug} | Sal & Estrella`,
  }
}

const fetchProperty = cache(async (slug: string) => {
  if (!slug) return null
  return client.fetch<Property | null>(propertyQuery, { slug })
})

export default async function GuestGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = await fetchProperty(slug)

  if (!property) notFound()

  const mainImage = property.gallery?.[0] ? urlFor(property.gallery[0]).width(1200).height(600).url() : null
  const isLaSerena = property.location?.toLowerCase().includes('serena') || property.slug.current.includes('serena')

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header / Hero */}
      <header className="relative h-64 sm:h-80 md:h-96 w-full">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={property.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full w-full bg-slate-800" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm mb-2 drop-shadow-md">
            Guía del Huésped
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
            Bienvenido a {property.name}
          </h1>
          <p className="mt-2 text-gray-200 text-lg flex items-center justify-center gap-2 drop-shadow">
            <IconMapPin className="h-5 w-5 text-amber-500" />
            {property.location}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
        {/* Mensaje de Bienvenida General */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">¡Hola! Qué alegría recibirte</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Hemos preparado este espacio con mucho cariño para que tu estadía sea inolvidable.
            Aquí encontrarás toda la información útil sobre el alojamiento y nuestras recomendaciones
            personales para que disfrutes al máximo. Si necesitas algo durante tu estancia,
            no dudes en contactarnos.
          </p>
        </section>

        {/* Sección Específica: La Serena */}
        {isLaSerena && (
          <section className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-amber-100 dark:border-amber-900/30">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <IconInfoCircle className="h-6 w-6 text-amber-500" />
                Instalaciones del Condominio
              </h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                <li><strong>Laguna Navegable y Piscinas:</strong> Abiertas en temporada alta. Fuera de temporada, consultar horarios en conserjería.</li>
                <li><strong>Estacionamiento:</strong> Tienes un (1) espacio de estacionamiento privado asignado. Las visitas deben estacionar fuera del recinto.</li>
                <li><strong>Áreas Comunes:</strong> Se ruega mantener el silencio después de las 22:00 hrs para respetar el descanso de los vecinos.</li>
                <li><strong>Basura:</strong> Los ductos de basura se encuentran en el pasillo, frente a los ascensores.</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <IconCurrencyDollar className="h-6 w-6 text-green-600" />
                Costos Adicionales (Opcionales)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                  <p className="font-semibold text-gray-900 dark:text-white">Arriendo de Kayaks</p>
                  <p className="text-sm text-gray-500 mt-1">Disponible en la laguna (consultar en recepción del condominio).</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
                  <p className="font-semibold text-gray-900 dark:text-white">Lavandería</p>
                  <p className="text-sm text-gray-500 mt-1">Funciona con fichas. Las máquinas están en el subterráneo -1.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recomendaciones Locales (Generales para todos, pero adaptadas a la ubicación) */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <IconStar className="h-6 w-6 text-amber-500" />
            Nuestras Recomendaciones en {property.location}
          </h2>
          {isLaSerena ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white">Para Comer</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Bakulic:</strong> Excelente gastronomía de mar.</li>
                  <li>• <strong>Tololo Beach:</strong> Ideal para almorzar frente a la playa.</li>
                  <li>• <strong>Punto de Encuentro:</strong> Maravilloso para pescados y mariscos.</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-lg text-gray-900 dark:text-white">Paseos</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <li>• <strong>Faro Monumental:</strong> A solo minutos caminando por la Avenida del Mar.</li>
                  <li>• <strong>Valle del Elqui:</strong> Imperdible tour astronómico y pisquero a 1 hora.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {/* GASTRONOMÍA */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">
                  🍽️ Gastronomía
                </h3>

                {/* Restaurantes y Cafeterías */}
                <div>
                  <h4 className="font-semibold text-lg text-ocean-600 dark:text-amber-500 mb-4 px-1">Restaurantes y Cafeterías</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">La Sal</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Cocina de autor especializada en pescados y mariscos. Un ambiente sofisticado y premium ubicado en el sector de Punta de Lobos.</p>
                      <a href="https://www.google.com/maps/search/Restaurante+La+Sal+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Cardumen Café</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Cafetería de especialidad en la zona centro. Imperdible su pastelería de autor y excelentes opciones de brunch.</p>
                      <a href="https://www.google.com/maps/search/Cardumen+Cafe+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Cúrcuma</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">La mejor alternativa céntrica para cuidarse con comida inteligente, que brinda creativas y sabrosas opciones vegetarianas y veganas.</p>
                      <a href="https://www.google.com/maps/search/Curcuma+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Costa Maria</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Un clásico absoluto para la hora de almuerzo. Perfecto para probar reineta fresca, pastel de jaiba y deliciosas empanadas con vista directa al mar.</p>
                      <a href="https://www.google.com/maps/search/Restaurante+Costa+Maria+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Los Piures Club Social</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Comida típica chilena en un entorno rústico único. Muy reconocidos por sus contundentes empanadas y mariscos maridados con gran compañía local, frente a la laguna de Cáhuil.</p>
                      <a href="https://www.google.com/maps/search/Los+Piures+Club+Social+Cahuil" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                  </div>
                </div>

                {/* Picadas Tradicionales */}
                <div>
                  <h4 className="font-semibold text-lg text-ocean-600 dark:text-amber-500 mb-4 px-1 mt-8">Picadas Tradicionales</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Sanguchería La Casa Verde</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Generosos sándwiches gourmet, crudos, y un menú con opciones deliciosamente veganas. Es una parada estratégica ideal tras un día de surf.</p>
                      <a href="https://www.google.com/maps/search/Sangucheria+La+Casa+Verde+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Nativo Restobar</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Situado en plena Avenida Ortúzar. Destaca por su impecable coctelería de autor y atmósfera vibrante, convirtiéndose en una excelente opción de precio moderado.</p>
                      <a href="https://www.google.com/maps/search/Nativo+Restobar+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Sandwichería Mi Tercer Tiempo</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">El lugar definitivo para un sandwich contundente. Famosos por su rapidez y sabor urbano chileno, son la parada obligatoria después de un día intenso o una larga noche.</p>
                      <a href="https://www.google.com/maps/search/Sandwicheria+Mi+Tercer+Tiempo+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Sushi Tsumare</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Sushi de alta calidad con ingredientes frescos y preparaciones creativas. Una de las mejores opciones en Pichilemu para disfrutar de sabores japoneses bien ejecutados.</p>
                      <a href="https://www.google.com/maps/search/Sushi+Tsumare+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Empanadas El Diablito</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Favoritas del sector de Playa Hermosa por sus contundentes empanadas fritas. Un local auténtico con rellenos abundantes; imperdibles las de pino y las de mariscos.</p>
                      <a href="https://maps.app.goo.gl/J8CXywh7ncku9Kzy6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              </div>

                {/* BARES Y VIDA NOCTURNA */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 mt-12">
                    🍸 Bares y Vida Nocturna
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Waitara Club</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">El gran epicentro de la fiesta en La Puntilla. Discoteca completa con dos pistas de baile muy activas y grandes eventos a poquísimos pasos de las olas.</p>
                      <a href="https://www.google.com/maps/search/Waitara+Club+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Bar La Virgen</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">El spot más "trendy" de Pichilemu. Ofrece una mezcla perfecta de coctelería de autor y ambiente relajado con una vista privilegiada al mar.</p>
                      <a href="https://maps.app.goo.gl/vY2N6oGgD2z6Vv7V6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Osaka</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Propuesta exclusiva de cocina Nikkei (fusión peruano-japonesa). Mixología de alto nivel frente a la playa en un entorno muy sofisticado.</p>
                      <a href="https://maps.app.goo.gl/vY2N6oGgD2z6Vv7V6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                  </div>
                </div>

              {/* PLAYAS */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 mt-12">
                  🌊 Playas Principales
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-l-4 border-ocean-500 shadow-sm transition-all hover:bg-ocean-50 dark:hover:bg-gray-700">
                    <h5 className="font-bold text-gray-900 dark:text-white mb-1">La Puntilla (Playa Principal)</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-3">Corredores de olas largas y suaves. Es la sede primordial de escuelas de surf y brinda de lejos el balneario más amigable para un baño seguro y familiar.</p>
                    <a href="https://www.google.com/maps/search/Playa+La+Puntilla+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                      <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                    </a>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-l-4 border-ocean-500 shadow-sm transition-all hover:bg-ocean-50 dark:hover:bg-gray-700">
                    <h5 className="font-bold text-gray-900 dark:text-white mb-1">Playa Hermosa</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-3">Un amplio sector de arenas infinitas y claras, maravillosamente menos concurrido que el centro, aunque reclama prudencia al interactuar con el agua debido a corrientes activas.</p>
                    <a href="https://www.google.com/maps/search/Playa+Hermosa+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                      <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                    </a>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-l-4 border-ocean-500 shadow-sm transition-all hover:bg-ocean-50 dark:hover:bg-gray-700">
                    <h5 className="font-bold text-gray-900 dark:text-white mb-1">Punta de Lobos</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 mb-3">La joya de Pichilemu y Reserva Mundial de Surf. Famosa por sus imponentes acantilados, los icónicos peñones y olas de clase mundial que desafían a los mejores.</p>
                    <a href="https://www.google.com/maps/search/Playa+Punta+de+Lobos+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                      <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                    </a>
                  </div>
                </div>
              </div>

              {/* EXPERIENCIAS Y CULTURA */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 mt-12">
                  🏄‍♂️ Experiencias, Tours y Cultura
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-transform">
                    <h5 className="font-bold text-ocean-700 dark:text-amber-500 mb-1">Clases de Surf</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Actividad emblema local. Toma clases de iniciación pura en La Puntilla o escala al nivel avanzado y contemplativo que exige Punta de Lobos.</p>
                    <a href="https://www.google.com/maps/search/Clases+de+Surf+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                      <IconMapPin className="h-3 w-3 mr-1" /> Ver en Google Maps
                    </a>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-transform">
                    <div className="flex justify-between items-center mb-1">
                      <h5 className="font-bold text-ocean-700 dark:text-amber-500">Ruta de la Sal (Cáhuil)</h5>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Sumérgete a solo 15 km en la paciencia ancestral chilena. Observa y adquiere maravillosa sal de mar directamente en las pozas artesanales de extracción.</p>
                    <a href="https://www.google.com/maps/search/Ruta+de+la+Sal+Cahuil" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                      <IconMapPin className="h-3 w-3 mr-1" /> Ver en Google Maps
                    </a>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-transform">
                    <h5 className="font-bold text-ocean-700 dark:text-amber-500 mb-1">Deportes Acuáticos</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Un ecosistema ideal sin fuertes olas; permite un tranquilo pero desafiante recorrido en Stand Up Paddle o hermosos paseos en bote en la Laguna de Cáhuil.</p>
                    <a href="https://www.google.com/maps/search/Deportes+Acuaticos+Laguna+Cahuil" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                      <IconMapPin className="h-3 w-3 mr-1" /> Ver en Google Maps
                    </a>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-transform">
                    <h5 className="font-bold text-ocean-700 dark:text-amber-500 mb-1">Parque Agustín Ross</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Pasea reflexivamente en el imponente Monumento Nacional repleto de centenarias palmeras, jardines simétricos y la gran fachada del icónico casino francés.</p>
                    <a href="https://www.google.com/maps/search/Parque+Agustin+Ross+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                      <IconMapPin className="h-3 w-3 mr-1" /> Ver en Google Maps
                    </a>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-transform">
                    <h5 className="font-bold text-ocean-700 dark:text-amber-500 mb-1">Arte en Arcilla de Pañul</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Camino al sur, podrás acercarte a los tornos antiguos de maestros artesanos para llevar a casa la famosa artesanía noble en arcilla blanca.</p>
                    <a href="https://www.google.com/maps/search/Artesania+Pa%C3%B1ul+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                      <IconMapPin className="h-3 w-3 mr-1" /> Ver en Google Maps
                    </a>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-transform">
                    <h5 className="font-bold text-ocean-700 dark:text-amber-500 mb-1">Iglesia San Andrés</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Enclavada en el valle interior (Ciruelos), es un viaje en el tiempo patrimonial descubriendo su gruesa estructura colonial original levantada en 1778.</p>
                    <a href="https://www.google.com/maps/search/Iglesia+San+Andres+Ciruelos+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                      <IconMapPin className="h-3 w-3 mr-1" /> Ver en Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
