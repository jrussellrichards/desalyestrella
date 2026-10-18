import type { MetadataRoute } from 'next'
import { groq } from 'next-sanity'
import { client } from '@/lib/sanity.client'
import { SITE_URL } from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, posts] = await Promise.all([
    client.fetch<{ slug: string; _updatedAt: string }[]>(groq`*[_type == "property" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`).catch(() => []),
    client.fetch<{ slug: string; _updatedAt: string }[]>(groq`*[_type == "blogPost" && defined(slug.current)]{ "slug": slug.current, _updatedAt }`).catch(() => []),
  ])

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/refugios`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/en`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/experiencias`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/experiencias/estrella`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/experiencias/sal`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/historia`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/contacto`, changeFrequency: 'yearly', priority: 0.5 },
  ]

  return [
    ...staticPages,
    ...properties.map(p => ({ url: `${SITE_URL}/refugios/${p.slug}`, lastModified: p._updatedAt, changeFrequency: 'weekly' as const, priority: 0.9 })),
    ...posts.map(p => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p._updatedAt, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ]
}
