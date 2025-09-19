import { client } from './sanity.client'
import { groq } from 'next-sanity'
import { GlobalSettings } from '@/types'

const settingsQuery = groq`*[_type == "settings"][0]{ airbnbProfileUrl }`

export async function fetchSettings(): Promise<GlobalSettings> {
  return client.fetch(settingsQuery)
}