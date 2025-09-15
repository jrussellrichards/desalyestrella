/** @type {import('next').NextConfig} */
const nextConfig = {
  // Añadimos esta sección para configurar los dominios de imágenes permitidos.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
      },
    ],
  },
}

export default nextConfig

