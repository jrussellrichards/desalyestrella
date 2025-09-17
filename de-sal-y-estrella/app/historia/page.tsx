import Image from 'next/image'
import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { urlFor } from '@/lib/image'
import { StyledPortableText } from '@/components/StyledPortableText' // <-- Importamos el nuevo componente

// Definimos la interfaz para el contenido de la página
interface PageContent {
  title: string
  mainImage: any
  body: any[]
}

// Consulta para obtener el contenido de la página con el slug "nuestra-historia"
const query = groq`*[_type == "page" && slug.current == "nuestra-historia"][0]`

export default async function HistoriaPage() {
  const pageContent: PageContent = await client.fetch(query)

  if (!pageContent) {
    return <div>Contenido no encontrado.</div>
  }

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-gray-50 shadow-sm dark:bg-gray-800 lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="px-6 pb-12 pt-10 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                {pageContent.title}
              </h1>
              {/* --- INICIO DE LA CORRECCIÓN --- */}
              {/* Reemplazamos el div con 'prose' por nuestro nuevo componente especializado. */}
              <div className="mt-6">
                <StyledPortableText value={pageContent.body} />
              </div>
              {/* --- FIN DE LA CORRECCIÓN --- */}
            </div>
          </div>
          <div className="relative aspect-video h-full w-full lg:aspect-auto">
            <Image
              src={urlFor(pageContent.mainImage).url()}
              alt={`Imagen principal de ${pageContent.title}`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

