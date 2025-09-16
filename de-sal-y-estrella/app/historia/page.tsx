import Image from 'next/image'

export default function HistoriaPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-gray-50 shadow-sm dark:bg-gray-800 lg:grid lg:grid-cols-2 lg:gap-4">
          <div className="px-6 pb-12 pt-10 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
            <div className="lg:self-center">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Nuestra Historia
              </h1>
              <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
                "De Sal y Estrella" nació de una convicción simple: un verdadero
                escape no es solo un cambio de lugar, sino un cambio de
                perspectiva.
              </p>
              <p className="mt-6 text-base leading-7 text-gray-700 dark:text-gray-400">
                Soy Javier Richards, y mi pasión por los paisajes contrastantes
                de Chile me llevó a crear estos refugios. Desde la energía
                vibrante del surf en Pichilemu hasta la calma cósmica del Valle
                del Elqui, cada propiedad está diseñada no solo como un lugar
                para alojarse, sino como un punto de partida para la aventura y
                la introspección.
              </p>
              <p className="mt-6 text-base leading-7 text-gray-700 dark:text-gray-400">
                Nuestra filosofía es la hospitalidad curada: espacios con
                diseño, todas las comodidades para el viajero moderno y una
                conexión auténtica con el entorno.
              </p>
            </div>
          </div>
          <div className="relative aspect-video h-full w-full lg:aspect-auto">
            <Image
              src="https://placehold.co/600x800/111827/FFFFFF?text=Javier+Richards"
              alt="Foto de Javier Richards, fundador de De Sal y Estrella"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

