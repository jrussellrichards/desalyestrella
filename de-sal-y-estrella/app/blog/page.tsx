import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/image'

// Definimos una interfaz para los datos de un post en la lista
interface BlogPost {
  _id: string
  title: string
  slug: { current: string }
  mainImage: any
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
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Guías de Viaje
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Descubre los secretos de nuestros destinos, curados por expertos
            locales.
          </p>
        </div>
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
                  <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600 dark:text-white">
                    {post.title}
                  </h3>
                  <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
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
