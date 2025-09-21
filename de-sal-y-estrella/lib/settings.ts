import { client } from './sanity.client'
import { groq } from 'next-sanity'
import { GlobalSettings } from '@/types'

const settingsQuery = groq`*[_type == "settings"][0]{
  airbnbProfileUrl,
  siteLogo{asset->,alt},
  contactEmail,
  phone,
  whatsappNumber,
  instagramUrl,
  address,
  location,
  businessHours,
  heroTitle,
  heroSubtitle,
  heroImage{asset->, alt},
  whyUs[]{ title, description, _key },
  destinations[]{
    _key,
    title,
    slugParam,
    description,
    image{asset->, alt}
  }
}`

export async function fetchSettings(): Promise<GlobalSettings> {
  const data = await client.fetch<GlobalSettings | null>(settingsQuery).catch(() => null)
  return data || {}
}