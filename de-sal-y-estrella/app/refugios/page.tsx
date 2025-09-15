import {client} from '@/lib/sanity.client'
import {groq} from 'next-sanity'
import PropertyCard from '@/components/PropertyCard'

// Esta es la consulta GROQ para obtener los datos de Sanity.
const query = groq`*[_type == "property"]{
  _id,
  name,
  slug,
  location,
  tagline,
  "mainImage": gallery[0]
}`

// Esta es la página que mostrará la lista de propiedades.
// Es un Server Component, por lo que podemos hacerlo async.
export default async function RefugiosPage() {
  const properties = await client.fetch(query)

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Nuestros Refugios
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
          Descubre los espacios que hemos preparado para tu próxima aventura.
        </p>
      </div>

      {properties.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property: any) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-lg text-gray-500">No hay propiedades disponibles en este momento.</p>
        </div>
      )}
    </main>
  )
}
