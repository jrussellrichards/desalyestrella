import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/image'
import { cache } from 'react'

interface CrossSellProps {
  currentId: string
}

const crossSellQuery = groq`*[_type == "property" && _id != $currentId][0...2]{
  _id,
  name,
  slug,
  tagline,
  gallery[0]
}`

const fetchCross = cache(async (currentId: string) => {
  return client.fetch<any[]>(crossSellQuery, { currentId })
})

export default async function CrossSell({ currentId }: CrossSellProps) {
  const refs = await fetchCross(currentId)
  if (!refs || refs.length === 0) return null
  return (
    <section aria-labelledby="explora-tambien" className="mt-16 border-t border-gray-200 pt-12 dark:border-gray-800">
      <div className="mb-6 flex items-center justify-between">
        <h2 id="explora-tambien" className="text-lg font-semibold text-gray-900 dark:text-white">
          Explora también
        </h2>
        <Link
          href="/refugios"
          className="text-sm font-medium text-amber-600 hover:text-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-600"
        >
          Ver todos
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {refs.map((p) => {
          const image = p.gallery
          const builder = image ? urlFor(image) : null
          const imgUrl = builder?.width(600).height(400).fit('crop').quality(80).url()
          return (
            <Link
              key={p._id}
              href={`/refugios/${p.slug?.current || ''}`}
              className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
            >
              {imgUrl && (
                <div className="relative aspect-[3/2] w-full overflow-hidden">
                  <Image
                    src={imgUrl}
                    alt={image?.alt || p.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0" />
                </div>
              )}
              <div className="p-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{p.name}</h3>
                {p.tagline && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">{p.tagline}</p>
                )}
                <span className="mt-3 inline-block text-xs font-medium text-amber-600">Ver refugio →</span>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
