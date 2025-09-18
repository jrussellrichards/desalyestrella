import type { PortableTextBlock } from '@portabletext/types'

interface PageContent {
  _id: string
  title: string
  slug: { current: string }
  mainImage: import('sanity').Image
  body: PortableTextBlock[]
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Habilita el uso de imágenes SVG, necesario para placehold.co
    dangerouslyAllowSVG: true,
    // Lista de dominios de imagen permitidos
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // Para las imágenes de tus propiedades desde el CMS
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Para las imágenes de placeholder
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'photos.fife.usercontent.google.com', // Para la foto de Google Photos
        port: '',
      },
    ],
  },
}

export default nextConfig

