import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { Property } from '@/types'
import Image from 'next/image'
import { urlFor } from '@/lib/image'
import { PortableText } from '@portabletext/react'
import BookingWidget from '@/components/BookingWidget'

const query = groq`*[_type == "property" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  location,
  tagline,
  gallery,
  description,
  capacity,
  amenities,
  bookingWidgetCode
}`

export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await client.fetch(
    groq`*[_type == "property"]{"slug": slug}`
  )
  return slugs.map(({ slug }) => ({
    slug: slug.current,
  }))
}

export default async function PropertyPage({
  params,
}: {
  params: { slug: string }
}) {
  // --- CORRECCIÓN ---
  // Volvemos a pasar el slug de forma explícita.
  // Esto soluciona el error de GROQ.
  const property: Property = await client.fetch(query, { slug: params.slug })

  if (!property) {
    return <div>Propiedad no encontrada</div>
  }

  const hasImages = property.gallery && property.gallery.length > 0

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Galería de Imágenes */}
        <div className="mb-12">
          {hasImages ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {property.gallery.map((image) => (
                <div
                  key={(image as any)._key}
                  className="relative aspect-video overflow-hidden rounded-lg shadow-md"
                >
                  <Image
                    src={urlFor(image).url()}
                    alt={`Imagen de ${property.name}`}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
              <p className="text-gray-500">No hay imágenes disponibles</p>
            </div>
          )}
        </div>

        {/* Contenido Principal */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-x-12">
          {/* Columna de Descripción */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {property.name}
            </h1>
            <p className="mt-2 text-xl text-gray-600 dark:text-gray-300">
              {property.location}
            </p>
            <div className="mt-8 prose prose-lg max-w-none text-gray-700 dark:prose-invert dark:text-gray-300">
              <PortableText value={property.description} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="mt-12 space-y-8 lg:mt-0">
            {/* Sección de Reservas */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Reservar Ahora
              </h2>
              <div className="mt-4">
                <BookingWidget htmlCode={property.bookingWidgetCode || ''} />
              </div>
            </div>

            {/* Sección de Servicios */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Servicios Incluidos
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                {property.amenities?.map((amenity) => (
                  <li key={amenity} className="flex items-center">
                    <svg
                      className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>{amenity}</span>
                  </li>
                ))}
                <li className="flex items-center">
                  <svg
                    className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  <span>Capacidad: {property.capacity} personas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

