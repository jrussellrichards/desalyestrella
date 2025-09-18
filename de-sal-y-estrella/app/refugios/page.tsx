import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import PropertyCard from '@/components/PropertyCard'
import { Property } from '@/types'

const query = groq`*[_type == "property"]{
  _id,
  name,
  slug,
  location,
  tagline,
  gallery
}`

export default async function RefugiosPage() {
  const properties: Property[] = await client.fetch(query)

  // --- INICIO DEL CÓDIGO DE DIAGNÓSTICO ---
  // Imprimiremos los datos en la terminal donde corre Next.js (Terminal A)
  console.log("--- DATOS RECIBIDOS DE SANITY ---")
  console.log(JSON.stringify(properties, null, 2))
  // --- FIN DEL CÓDIGO DE DIAGNÓSTICO ---

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Nuestros Refugios
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
          Cada uno de nuestros espacios está diseñado para ofrecer una conexión
          única con los paisajes más inspiradores de Chile.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      </div>
    </div>
  )
}