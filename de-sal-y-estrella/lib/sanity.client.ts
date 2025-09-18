import { createClient } from 'next-sanity'

// Leemos las variables de entorno para una configuración segura
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const apiVersion =
process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03'
console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID)

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // true para rendimiento en producción
})

