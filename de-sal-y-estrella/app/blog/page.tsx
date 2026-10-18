import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/image'
import { Image as SanityImage } from 'sanity'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Guías de viaje',
  description: 'Consejos y guías para tu viaje a La Serena, el Valle del Elqui y Pichilemu.',
  alternates: { canonical: '/blog' },
}

// Definimos una interfaz para los datos de un post en la lista
interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  mainImage: SanityImage
  publishedAt: string
  excerpt: string
}

// Consulta para obtener todos los artículos del blog, ordenados por fecha
const query = groq`*[_type == "blogPost"] | order(publishedAt desc){
  _id,
  title,
  slug,
  mainImage,
  publishedAt,
  excerpt
}`

export default async function BlogPage() {
  const posts: BlogPost[] = await client.fetch(query)

  return (
    <div className="bg-salt dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-h1 font-semibold text-ink dark:text-white">
            Guías de Viaje
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Ideas y datos para aprovechar tu viaje a La Serena, el Valle del Elqui y Pichilemu.
          </p>
        </div>
        {posts.length === 0 && (
          <p className="mx-auto mt-10 max-w-xl text-center text-ink-subtle dark:text-ink-dark-subtle">
            Pronto publicaremos nuestras guías. Mientras tanto, revisa{' '}
            <Link href="/experiencias" className="font-medium text-sea-700 hover:underline">qué hacer en cada destino</Link>.
          </p>
        )}
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug.current}`}
              className="flex flex-col items-start justify-between"
            >
              <article>
                <div className="relative w-full">
                  <Image
                    src={urlFor(post.mainImage).width(500).height(300).url()}
                    alt={`Imagen de ${post.title}`}
                    width={500}
                    height={300}
                    className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                  />
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                </div>
                <div className="mt-8">
                  <div className="flex items-center gap-x-4 text-xs">
                    <time
                      dateTime={post.publishedAt}
                      className="text-gray-500"
                    >
                      {new Date(post.publishedAt).toLocaleDateString('es-CL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                  <h3 className="mt-3 font-display text-[1.05rem] font-semibold leading-snug text-ink group-hover:text-sea-700 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="mt-4 line-clamp-3 text-[0.85rem] leading-[1.5] text-ink-subtle dark:text-ink-dark-subtle">
                    {post.excerpt}
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
