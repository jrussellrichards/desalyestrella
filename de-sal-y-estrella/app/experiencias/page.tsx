import Link from 'next/link'
import Image from 'next/image'

const experiences = [
  {
    name: 'Experiencia Sal',
    href: '/experiencias/sal',
    description:
      'Sumérgete en la cultura del surf, la gastronomía costera y los atardeceres infinitos de Pichilemu.',
    imageUrl:
      'https://placehold.co/600x400/111827/FFFFFF?text=Olas+%26+Surf',
  },
  {
    name: 'Experiencia Estrella',
    href: '/experiencias/estrella',
    description:
      'Descubre los cielos más limpios del mundo, explora viñedos de pisco y conecta con el cosmos en el Valle del Elqui.',
    imageUrl:
      'https://placehold.co/600x400/111827/FFFFFF?text=Cosmos+%26+Valle',
  },
]

export default function ExperienciasPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Vive la Experiencia
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Nuestros refugios son el punto de partida. La aventura la defines
            tú. Explora nuestras guías diseñadas para cada destino.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {experiences.map((exp) => (
            <Link
              key={exp.name}
              href={exp.href}
              className="group relative block overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-shadow duration-300 hover:shadow-xl dark:border-gray-700"
            >
              <div className="relative h-72 w-full">
                <Image
                  src={exp.imageUrl}
                  alt={`Imagen representativa de ${exp.name}`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-semibold text-white">
                  {exp.name}
                </h3>
                <p className="mt-2 text-sm text-gray-200">{exp.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
