/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // --- LÍNEA AÑADIDA ---
    // Habilitamos el procesamiento de imágenes SVG.
    // Se considera "peligroso" solo si se usan fuentes de SVG no confiables.
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // Para las imágenes de tus propiedades
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Para las imágenes de placeholder
        port: '',
      },
    ],
  },
}

export default nextConfig

