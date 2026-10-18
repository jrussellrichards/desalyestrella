import { fetchSettings } from '@/lib/settings'
import ContactForm from '@/components/ContactForm'
import Link from 'next/link'
import { IconBrandWhatsapp } from '@tabler/icons-react'
import type { Metadata } from 'next'
import { INSTAGRAM_URL, SITE_URL, WHATSAPP_NUMBER } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contacto y reservas',
  description: 'Escríbenos por WhatsApp, email o formulario para consultar fechas y reservar directo en La Serena o Pichilemu.',
  alternates: { canonical: '/contacto' },
}

export const revalidate = 300

export default async function ContactoPage() {
  const settings = await fetchSettings()
  const whatsappNumber = settings.whatsappNumber || WHATSAPP_NUMBER
  const wpp = `https://wa.me/${whatsappNumber}`
  const instagram = INSTAGRAM_URL
  const email = settings.contactEmail
  const coord = settings.location?.lat && settings.location?.lng ? settings.location : null


  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-h1 font-semibold text-ink dark:text-white">
            Contacto
          </h1>
          <p className="mt-4 text-copy-lg text-ink-subtle dark:text-ink-dark-subtle">
            Por WhatsApp te respondemos normalmente en minutos. También puedes dejarnos un mensaje en el formulario.
          </p>
          {wpp && (
            <div className="mt-6 flex justify-center">
              <a
                href={wpp}
                target="_blank"
                rel="noopener"
                className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-7 py-4 text-base font-semibold text-navy-950 shadow-lg transition hover:bg-gold-300"
              >
                <IconBrandWhatsapp className="h-5 w-5" />
                Escribir por WhatsApp
              </a>
            </div>
          )}
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-12 md:grid-cols-5">
          {/* Columna info */}
          <div className="space-y-8 md:col-span-2">
            <section>
              <h3 className="font-display text-xl font-semibold text-ink dark:text-white">Datos directos</h3>
              <ul className="mt-4 space-y-4 text-sm text-gray-600 dark:text-gray-300">
                {email && (
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-navy-900/10 text-gold-700">
                      @
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Email</p>
                      <a href={`mailto:${email}`} className="hover:text-gold-700">{email}</a>
                    </div>
                  </li>
                )}
                {wpp && (
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-navy-900/10 text-gold-700">
                      <svg aria-hidden="true" viewBox="0 0 32 32" className="h-5 w-5" fill="currentColor"><path d="M16.04 3C9.4 3 4 8.4 4 15.06c0 2.63.86 5.07 2.33 7.06L4 29l7.16-2.3a12.02 12.02 0 0 0 4.88 1.02h.01c6.64 0 12.04-5.4 12.04-12.06C28.09 8.4 22.69 3 16.04 3Zm6.99 17.2c-.29.82-1.7 1.6-2.34 1.7-.6.12-1.36.17-2.2-.14-.51-.18-1.17-.38-2.02-.84-3.55-1.93-5.86-5.34-6.03-5.59-.18-.25-1.44-1.9-1.44-3.63 0-1.72.91-2.57 1.24-2.93.34-.36.74-.45.98-.45.25 0 .49.01.7.02.22.02.52-.08.82.63.29.7 1 2.43 1.09 2.61.09.18.15.38.03.62-.12.25-.18.4-.34.61-.17.2-.35.45-.5.6-.17.17-.34.35-.15.69.18.34.8 1.32 1.71 2.14 1.17 1.05 2.14 1.38 2.48 1.54.34.17.55.15.75-.08.2-.22.86-.95 1.09-1.28.23-.34.46-.27.77-.16.31.11 1.96.92 2.29 1.08.34.17.57.25.66.4.08.14.08.82-.21 1.64Z"/></svg>
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">WhatsApp</p>
                      <a href={wpp} target="_blank" rel="noopener" className="hover:text-gold-700">
                        +{whatsappNumber}
                      </a>
                    </div>
                  </li>
                )}
                {instagram && (
                  <li className="flex items-start gap-3">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-navy-900/10 text-gold-700">
                      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm10.75 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5A3.5 3.5 0 1 0 12 16a3.5 3.5 0 0 0 0-7Z"/></svg>
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Instagram</p>
                      <a href={instagram} target="_blank" rel="noopener" className="hover:text-gold-700">
                        Ver perfil
                      </a>
                    </div>
                  </li>
                )}
       
              </ul>
            </section>

            {settings.businessHours?.length ? (
              <section>
                <h3 className="font-display text-xl font-semibold text-ink dark:text-white">Horario</h3>
                <ul className="mt-3 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                  {settings.businessHours.map(h => <li key={h}>{h}</li>)}
                </ul>
              </section>
            ) : null}

            <section>
              <h3 className="font-display text-xl font-semibold text-ink dark:text-white">¿Tienes dudas?</h3>
              <p className="mt-2 text-sm text-ink-subtle dark:text-ink-dark-subtle">
                Revisa las <Link href="/#preguntas" className="font-medium text-gold-700 hover:underline">preguntas frecuentes</Link> sobre reservas, check-in, cancelación y mascotas.
              </p>
            </section>

            {coord && (
              <section>
                <h3 className="font-display text-xl font-semibold text-ink dark:text-white">Mapa</h3>
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

          </div>

          {/* Columna formulario */}
          <div className="md:col-span-3">
            <div className="rounded-2xl border border-gray-200 bg-sand-50 p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="font-display text-h3 font-semibold text-ink dark:text-white">Escríbenos</h2>
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
              url: `${SITE_URL}/contacto`,
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
