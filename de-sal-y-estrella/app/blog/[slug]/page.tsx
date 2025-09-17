import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import Image from 'next/image'
import { urlFor } from '@/lib/image'
import { PortableText } from '@portabletext/react'
import { Image as SanityImage } from 'sanity'
import { PortableTextBlock } from '@portabletext/react'

// Definimos una interfaz para los datos de un post individual
interface BlogPost {
  _id: string
  title: string
  mainImage: SanityImage
  publishedAt: string
  body: PortableTextBlock[]
}

// Consulta para obtener un solo post basado en su slug
const query = groq`*[_type == "blogPost" && slug.current == $slug][0]{
  _id,
  title,
  mainImage,
  publishedAt,
  body
}`

// Generamos las páginas estáticas para cada post
export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await client.fetch(
    groq`*[_type == "blogPost"]{"slug": slug}`
  )
  return slugs.map(({ slug }) => ({
    slug: slug.current,
  }))
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const post: BlogPost = await client.fetch(query, params)

  if (!post) {
    return <div>Artículo no encontrado</div>
  }

  return (
    <article className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-gray-500">
            Publicado el{' '}
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('es-CL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </time>
          </p>
        </div>

        <div className="relative mx-auto mt-12 aspect-video max-w-2xl overflow-hidden rounded-lg shadow-lg">
          <Image
            src={urlFor(post.mainImage).url()}
            alt={`Imagen principal de ${post.title}`}
            fill
            className="object-cover"
          />
        </div>

        <div className="mt-12 prose prose-lg max-w-none text-gray-700 dark:prose-invert dark:text-gray-300">
          <PortableText value={post.body} />
        </div>
      </div>
    </article>
  )
}
