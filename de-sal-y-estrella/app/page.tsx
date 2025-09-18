import Link from 'next/link'
import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { Property, Testimonial, Blog } from '@/types' // Importamos Testimonial
import PropertyCard from '@/components/PropertyCard'
import TestimonialCarousel from '@/components/TestimonialCarousel'

// Consulta para obtener las 3 propiedades más recientes
const query = groq`*[_type == "property"] | order(_createdAt desc)[0...3]{
  _id,
  name,
  slug,
  location,
  tagline,
  gallery
}`

// Nueva consulta para obtener hasta 8 testimonios recientes
const testimonialQuery = groq`*[_type == "testimonial"] | order(_createdAt desc)[0...8]{
  _id,
  quote,
  author,
  location
}`

export default async function HomePage() {
  // Hacemos ambas consultas en paralelo para mayor eficiencia
  const [properties, testimonials]: [Property[], Testimonial[]] =
    await Promise.all([client.fetch(query), client.fetch(testimonialQuery)])

  return (
    <main className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
              De Sal y Estrella
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Refugios únicos donde el océano se encuentra con el cosmos.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/refugios"
                className="rounded-md bg-gray-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-gray-700"
              >
                Descubre Nuestros Refugios
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Propiedades Destacadas */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Explora Nuestros Refugios
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Espacios diseñados para la aventura, el descanso y la conexión.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        </div>
      </div>

      {/* Sección de Testimonios */}
      <section className="bg-gray-50 py-24 dark:bg-gray-800 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Lo que dicen nuestros huéspedes
            </h2>
          </div>
          <div className="mt-14">
            <TestimonialCarousel testimonials={testimonials} />
          </div>
        </div>
      </section>
    </main>
  )
}

