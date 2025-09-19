import { fetchSettings } from '@/lib/settings'
import ContactForm from '@/components/ContactForm'
import Link from 'next/link'

export const revalidate = 300

export default async function ContactoPage() {
  const settings = await fetchSettings()
  const wpp = settings.whatsappNumber ? `https://wa.me/${settings.whatsappNumber}` : null
  const instagram = settings.instagramUrl
  const email = settings.contactEmail
  const coord = settings.location?.lat && settings.location?.lng ? settings.location : null

  const faq = [
    { q: '¿Tiempo de respuesta?', a: 'Normalmente respondemos en menos de 12 horas.' },
    { q: '¿Pet Friendly?', a: 'Algunos refugios sí; consúltanos indicando fechas.' },
    { q: '¿Política de cancelación?', a: 'Flexible: hasta 7 días antes reembolso completo (salvo fechas pico).' },
  ]

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Contacto
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-300">
            Escríbenos y planificamos tu estancia perfecta.
          </p>
          {wpp && (
            <div className="mt-6 flex justify-center">
              <a
                href={wpp}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center rounded-md bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <svg aria-hidden="true" viewBox="0 0 32 32" className="mr-2 h-4 w-4" fill="currentColor"><path d="M16.04 3C9.4 3 4 8.4 4 15.06c0 2.63.86 5.07 2.33 7.06L4 29l7.16-2.3a12.02 12.02 0 0 0 4.88 1.02h.01c6.64 0 12.04-5.4 12.04-12.06C28.09 8.4 22.69 3 16.04 3Zm6.99 17.2c-.29.82-1.7 1.6-2.34 1.7-.6.12-1.36.17-2.2-.14-.51-.18-1.17-.38-2.02-.84-3.55-1.93-5.86-5.34-6.03-5.59-.18-.25-1.44-1.9-1.44-3.63 0-1.72.91-2.57 1.24-2.93.34-.36.74-.45.98-.45.25 0 .49.01.7.02.22.02.52-.08.82.63.29.7 1 2.43 1.09 2.61.09.18.15.38.03.62-.12.25-.18.4-.34.61-.17.2-.35.45-.5.6-.17.17-.34.35-.15.69.18.34.8 1.32 1.71 2.14 1.17 1.05 2.14 1.38 2.48 1.54.34.17.55.15.75-.08.2-.22.86-.95 1.09-1.28.23-.34.46-.27.77-.16.31.11 1.96.92 2.29 1.08.34.17.57.25.66.4.08.14.08.82-.21 1.64Z"/></svg>
                Contactar por WhatsApp
              </a>
            </div>
          )}
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-12 md:grid-cols-5">
          {/* Columna info */}
          <div className="space-y-8 md:col-span-2">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Datos directos</h3>
              <ul className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                {email && (
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-amber-600/10 text-amber-600">
                      @
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email</p>
                      <a href={`mailto:${email}`} className="hover:text-amber-600">{email}</a>
                    </div>
                  </li>
                )}
                {wpp && (
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-amber-600/10 text-amber-600">
                      <svg aria-hidden="true" viewBox="0 0 32 32" className="h-5 w-5" fill="currentColor"><path d="M16.04 3C9.4 3 4 8.4 4 15.06c0 2.63.86 5.07 2.33 7.06L4 29l7.16-2.3a12.02 12.02 0 0 0 4.88 1.02h.01c6.64 0 12.04-5.4 12.04-12.06C28.09 8.4 22.69 3 16.04 3Zm6.99 17.2c-.29.82-1.7 1.6-2.34 1.7-.6.12-1.36.17-2.2-.14-.51-.18-1.17-.38-2.02-.84-3.55-1.93-5.86-5.34-6.03-5.59-.18-.25-1.44-1.9-1.44-3.63 0-1.72.91-2.57 1.24-2.93.34-.36.74-.45.98-.45.25 0 .49.01.7.02.22.02.52-.08.82.63.29.7 1 2.43 1.09 2.61.09.18.15.38.03.62-.12.25-.18.4-.34.61-.17.2-.35.45-.5.6-.17.17-.34.35-.15.69.18.34.8 1.32 1.71 2.14 1.17 1.05 2.14 1.38 2.48 1.54.34.17.55.15.75-.08.2-.22.86-.95 1.09-1.28.23-.34.46-.27.77-.16.31.11 1.96.92 2.29 1.08.34.17.57.25.66.4.08.14.08.82-.21 1.64Z"/></svg>
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">WhatsApp</p>
                      <a href={wpp} target="_blank" rel="noopener" className="hover:text-amber-600">
                        +{settings.whatsappNumber}
                      </a>
                    </div>
                  </li>
                )}
                {instagram && (
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-amber-600/10 text-amber-600">
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm10.75 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 16a3.5 3.5 0 0 0 0-7Z"/></svg>
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Instagram</p>
                      <a href={instagram} target="_blank" rel="noopener" className="hover:text-amber-600">
                        Ver perfil
                      </a>
                    </div>
                  </li>
                )}
                {settings.address && (
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-amber-600/10 text-amber-600">
                      <svg width="16" height="16" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-5.686 6-11a6 6 0 10-12 0c0 5.314 6 11 6 11z" />
                        <circle cx="12" cy="10" r="2" />
                      </svg>
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Base Operativa</p>
                      <p>{settings.address}</p>
                    </div>
                  </li>
                )}
              </ul>
            </section>

            {settings.businessHours?.length ? (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Horario</h3>
                <ul className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  {settings.businessHours.map(h => <li key={h}>{h}</li>)}
                </ul>
              </section>
            ) : null}

            <section>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">FAQ</h3>
              <ul className="mt-4 space-y-4">
                {faq.map(f => (
                  <li key={f.q}>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{f.q}</p>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{f.a}</p>
                  </li>
                ))}
              </ul>
            </section>

            {coord && (
              <section>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mapa</h3>
                <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <iframe
                    title="Ubicación"
                    width="100%"
                    height="220"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${coord.lat},${coord.lng}&hl=es&z=10&output=embed`}
                  />
                </div>
              </section>
            )}

            <div>
              {wpp && (
                <Link
                  href={wpp}
                  target="_blank"
                  className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  Chat inmediato en WhatsApp
                </Link>
              )}
            </div>
          </div>

          {/* Columna formulario */}
          <div className="md:col-span-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Escríbenos</h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Cuéntanos fechas tentativas, número de huéspedes y dudas.
              </p>
              <div className="mt-6">
                <ContactForm defaultEmail={email} />
              </div>
            </div>
          </div>
        </div>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'ContactPage',
              name: 'Contacto - De Sal y Estrella',
              url: 'https://www.desalyestrella.com/contacto',
              contactPoint: [{
                '@type': 'ContactPoint',
                email: email,
                contactType: 'customer service',
                availableLanguage: ['es']
              }]
            })
          }}
        />
      </div>
    </div>
  )
}
