import createImageUrlBuilder from '@sanity/image-url'
import {projectId, dataset} from './sanity.client'

// Este helper nos permite construir URLs optimizadas para las imágenes de Sanity.
const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export const urlFor = (source: any) => {
  // Nos aseguramos de que la fuente de la imagen es válida antes de procesarla
  if (!source || !source.asset) {
    // Puedes devolver una URL de una imagen de respaldo si lo deseas
    // Por ejemplo: 'https://placehold.co/500x300/e2e8f0/e2e8f0?text=.'
    return null
  }
  return imageBuilder.image(source)
}

