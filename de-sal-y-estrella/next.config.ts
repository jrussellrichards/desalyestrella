/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
      },
      // --- LÍNEA AÑADIDA ---
      // Añadimos el dominio para las imágenes de placeholder
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
      },
    ],
  },
}

export default nextConfig
