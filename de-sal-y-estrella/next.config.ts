
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Lista de dominios de imagen permitidos
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // Para las imágenes de tus propiedades desde el CMS
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

