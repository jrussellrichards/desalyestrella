import createImageUrlBuilder from '@sanity/image-url'
import { SanityImageSource } from '@sanity/image-url/lib/types/types' // Importamos el tipo específico
import { projectId, dataset } from '@/lib/sanity.client'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

// --- CORRECCIÓN ---
// Reemplazamos 'any' con el tipo correcto 'SanityImageSource'
export const urlFor = (source: SanityImageSource) => {
  return imageBuilder.image(source)
}

