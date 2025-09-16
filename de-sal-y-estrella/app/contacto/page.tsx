export default function ContactoPage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Contacto
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            ¿Tienes alguna pregunta sobre nuestros refugios o necesitas ayuda
            con una reserva? Estamos aquí para ayudarte.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-xl sm:mt-20">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Información de Contacto
              </h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-x-4">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">
                    contacto@desalyestrella.com (ejemplo)
                  </span>
                </div>
                {/* Puedes añadir más información de contacto aquí */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
