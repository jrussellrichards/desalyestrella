import Image from 'next/image'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import StyledPortableText from '@/components/StyledPortableText' // <-- CORRECCIÓN: Importamos sin llaves
import { urlFor } from '@/lib/image'
import type { Image as SanityImage, PortableTextBlock } from 'sanity'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Nuestra historia',
  description: 'Quiénes somos y por qué creamos De Sal y Estrella.',
  alternates: { canonical: '/historia' },
}

// Definimos la interfaz para el contenido de la página con tipos específicos
interface PageContent {
  title: string
  mainImage: SanityImage
  body: PortableTextBlock[]
}

// Consulta para obtener el contenido de la página con el slug "nuestra-historia"
const query = groq`*[_type == "page" && slug.current == "nuestra-historia"][0]`

export default async function HistoriaPage() {
  const pageContent: PageContent = await client.fetch(query)

  if (!pageContent) notFound()

  return (
    <div className="bg-salt dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-gray-50 shadow-sm dark:bg-gray-800 lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="px-6 pb-12 pt-10 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h1 className="font-display text-h2 font-semibold tracking-tight text-ink dark:text-white">
                {pageContent.title}
              </h1>
              <div className="mt-6">
                <StyledPortableText value={pageContent.body} />
              </div>
            </div>
          </div>
          <div className="relative aspect-video h-full w-full lg:aspect-auto">
            <Image
              src={urlFor(pageContent.mainImage).width(1400).auto('format').url()}
              alt={`Imagen principal de ${pageContent.title}`}
              fill
              sizes="(min-width:1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

