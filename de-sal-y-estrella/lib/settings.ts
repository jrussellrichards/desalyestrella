import { client } from './sanity.client'
import { groq } from 'next-sanity'
import { GlobalSettings } from '@/types'

const settingsQuery = groq`*[_type == "settings"][0]{
  airbnbProfileUrl,
  siteLogo{ asset->, alt },
  contactEmail,
  phone,
  whatsappNumber,
  instagramUrl,
  address,
  location,
  businessHours
}`

export async function fetchSettings(): Promise<GlobalSettings> {
  const data = await client.fetch<GlobalSettings | null>(settingsQuery).catch(() => null)
  return data || {}
}