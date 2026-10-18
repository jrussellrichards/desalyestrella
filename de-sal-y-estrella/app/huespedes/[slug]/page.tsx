import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { Property } from '@/types'
import { urlFor } from '@/lib/image'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  IconBrandInstagram, IconBrandWhatsapp, IconBrandYoutube, IconChevronDown, IconClock, IconCompass,
  IconDoorExit, IconHome, IconKey, IconMapPin, IconPhone, IconAlertTriangle, IconWifi, IconCar, IconSunset2, IconDiscount,
} from '@tabler/icons-react'
import { INSTAGRAM_URL, assistantLink } from '@/lib/site'
import { AQUA_AMENITIES, AQUA_PAYMENT, DISCOUNTS, EMERGENCY_NUMBERS, ZONES, getStay } from '@/lib/guide'
import CopyButton from '@/components/CopyButton'
import ThemeToggle, { THEME_SCRIPT } from '@/components/ThemeToggle'

// Revalidación ISR (5 min)
export const revalidate = 300

const propertyQuery = groq`*[_type == "property" && slug.current == $slug][0]{
  _id,
  name,
  slug,
  location,
  gallery,
  address,
  wifiName,
  wifiPassword,
  tower,
  parkingInfo
}`

export async function generateStaticParams() {
  const slugs: { slug: { current: string } }[] = await client.fetch(
    groq`*[_type == "property"]{"slug": slug}`
  )
  return slugs.map(({ slug }) => ({ slug: slug.current }))
}

const fetchProperty = cache(async (slug: string) => {
  if (!slug) return null
  return client.fetch<Property | null>(propertyQuery, { slug })
})

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = await fetchProperty(slug)
  const stay = property ? getStay(slug, property.name) : null
  return {
    title: `Guía del huésped${stay ? ` · ${stay.shortName}` : ''}`,
    // Página privada para huéspedes: fuera de Google
    robots: { index: false, follow: false, nocache: true },
  }
}

const card = 'rounded-2xl bg-white p-5 shadow-sm ring-1 ring-sea-100 dark:bg-gray-800 dark:ring-gray-700'
const linkCls = 'inline-flex items-center gap-1 text-sm font-semibold text-sea-700 hover:text-sea-800 dark:text-sea-300'

function SectionTitle({ id, icon: Icon, title, kicker }: { id: string; icon: typeof IconHome; title: string; kicker: string }) {
  return (
    <div id={id} className="scroll-mt-20 pt-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-sea-600">{kicker}</p>
      <h2 className="mt-1 flex items-center gap-2 font-display text-2xl font-bold text-ink dark:text-white">
        <Icon className="h-6 w-6 text-sea-500" />
        {title}
      </h2>
    </div>
  )
}

export default async function GuestGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = await fetchProperty(slug)
  if (!property) notFound()
  const stay = getStay(slug, property.name)
  if (!stay) notFound()

  const zone = ZONES[stay.zone]
  const isDepto = stay.kind === 'depto'
  const cover = property.gallery?.[0] ? urlFor(property.gallery[0]).width(1200).height(900).url() : null
  // Los datos de Sanity, si están cargados, mandan sobre los del archivo
  const parking = property.parkingInfo || stay.parking
  const tower = property.tower || stay.tower
  const address = property.address || stay.address
  const wifiName = property.wifiName
  const wifiPassword = property.wifiPassword
  const help = assistantLink(`Hola, estoy en ${stay.shortName}`)

  const nav = [
    { href: '#llegada', label: 'Llegada', icon: IconKey },
    { href: '#estadia', label: 'Estadía', icon: IconHome },
    { href: '#zona', label: 'La zona', icon: IconCompass },
    { href: '#salida', label: 'Salida', icon: IconDoorExit },
  ]

  return (
    <div data-guia className="min-h-screen bg-white pb-28 dark:bg-gray-900" suppressHydrationWarning>
      {/* Aplica el modo elegido con el botón antes de pintar, para que no parpadee */}
      <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      {/* Encabezado propio de la guía */}
      <header className="sticky top-0 z-40 border-b border-sea-100 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-4 py-2.5">
          <Link href="/" className="flex min-w-0 items-center gap-2.5">
            <Image src="/brand/isotipo-oscuro.png" alt="De Sal y Estrella" width={36} height={36} className="shrink-0 dark:hidden" />
            <Image src="/brand/isotipo-claro.png" alt="De Sal y Estrella" width={36} height={36} className="hidden shrink-0 dark:block" />
            <span className="truncate text-sm font-semibold text-ink dark:text-white">{stay.shortName}</span>
          </Link>
          <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />
          <a href={help} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-sea-500 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-sea-600">
            <IconBrandWhatsapp className="h-4 w-4" /> Ayuda 24/7
          </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl space-y-8 px-4 pt-4">
        {/* Portada */}
        <section className="relative overflow-hidden rounded-3xl">
          <div className="relative aspect-[4/3] w-full bg-sea-700">
            {cover && <Image src={cover} alt={stay.shortName} fill sizes="(max-width: 672px) 100vw, 672px" className="object-cover" priority />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-sm font-semibold text-sea-100">Guía del huésped</p>
              <h1 className="mt-1 font-display text-3xl font-bold leading-tight text-white">¡Bienvenidos!</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-white/90"><IconMapPin className="h-4 w-4" /> {stay.shortName}</p>
            </div>
          </div>
        </section>

        {/* Accesos rápidos */}
        <section className="grid grid-cols-2 gap-3">
          <a href="#llegada" className={`${card} flex flex-col gap-1`}>
            <IconKey className="h-6 w-6 text-sea-500" />
            <span className="font-semibold text-ink dark:text-white">Cómo entrar</span>
            <span className="text-xs text-ink-subtle dark:text-ink-dark-subtle">{stay.checkIn ? (stay.checkInUntil ? `De ${stay.checkIn} a ${stay.checkInUntil}` : `Desde las ${stay.checkIn}`) : 'Paso a paso'}</span>
          </a>
          <a href="#wifi" className={`${card} flex flex-col gap-1`}>
            <IconWifi className="h-6 w-6 text-sea-500" />
            <span className="font-semibold text-ink dark:text-white">WiFi</span>
            <span className="text-xs text-ink-subtle dark:text-ink-dark-subtle">{wifiPassword ? 'Ver clave' : '800 Mbps'}</span>
          </a>
          <a href="#llegada" className={`${card} flex flex-col gap-1`}>
            <IconCar className="h-6 w-6 text-sea-500" />
            <span className="font-semibold text-ink dark:text-white">Estacionamiento</span>
            <span className="text-xs text-ink-subtle dark:text-ink-dark-subtle">{parking ? `N° ${parking} · Gratis` : 'Gratis'}</span>
          </a>
          <a href="#salida" className={`${card} flex flex-col gap-1`}>
            <IconDoorExit className="h-6 w-6 text-sea-500" />
            <span className="font-semibold text-ink dark:text-white">Salida</span>
            <span className="text-xs text-ink-subtle dark:text-ink-dark-subtle">{stay.checkOut ? `Hasta las ${stay.checkOut}` : 'Antes de irte'}</span>
          </a>
        </section>

        {/* Asistente 24/7 */}
        <a href={help} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-sea-500 to-sea-700 p-5 text-white shadow-sm">
          <IconBrandWhatsapp className="h-9 w-9 shrink-0" />
          <span>
            <span className="block font-display text-lg font-bold">¿Una duda? Escríbenos 24/7</span>
            <span className="block text-sm text-sea-50">Te respondemos por WhatsApp a cualquier hora.</span>
          </span>
        </a>

        {/* LLEGADA */}
        <section className="space-y-4">
          <SectionTitle id="llegada" icon={IconKey} kicker="Al llegar" title="Llegada" />
          <div className={`${card} flex items-center gap-3`}>
            <IconClock className="h-6 w-6 shrink-0 text-sea-500" />
            <p className="text-sm text-ink dark:text-white">
              {!stay.checkIn
                ? 'La hora de llegada te la confirmamos por WhatsApp.'
                : stay.checkInUntil
                  ? <>Check-in de <strong>{stay.checkIn}</strong> a <strong>{stay.checkInUntil}</strong>.</>
                  : <>Check-in desde las <strong>{stay.checkIn}</strong>.</>}
              {stay.lateArrival && <> {stay.lateArrival}</>}
            </p>
          </div>
          <ol className={`${card} space-y-4`}>
            {stay.arrival.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sea-500 text-sm font-bold text-white">{i + 1}</span>
                <span className="pt-0.5 text-sm leading-relaxed text-ink dark:text-ink-dark">{step}</span>
              </li>
            ))}
          </ol>
          {stay.localContact && (
            <a href={`https://wa.me/${stay.localContact.phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-2xl bg-sea-500 p-4 font-semibold text-white shadow-sm hover:bg-sea-600">
              <IconBrandWhatsapp className="h-5 w-5" /> Escribir a {stay.localContact.name}
            </a>
          )}
          <div className={card}>
            <p className="text-sm font-semibold text-ink dark:text-white">Dirección</p>
            <p className="mt-1 text-sm text-ink-subtle dark:text-ink-dark-subtle">{address}</p>
            {(tower || stay.unit) && (
              <p className="mt-1 text-sm text-ink-subtle dark:text-ink-dark-subtle">
                {[tower && `Torre ${tower}`, stay.unit && `Depto ${stay.unit}`, parking && `Estacionamiento ${parking}`].filter(Boolean).join(' · ')}
              </p>
            )}
            <a href={stay.mapsLink} target="_blank" rel="noopener noreferrer" className={`${linkCls} mt-3`}>
              <IconMapPin className="h-4 w-4" /> Abrir en Google Maps
            </a>
          </div>
        </section>

        {/* ESTADÍA */}
        <section className="space-y-4">
          <SectionTitle id="estadia" icon={IconHome} kicker="Durante tu estadía" title={isDepto ? 'Cómo usar el depto' : 'Cómo usar la cabaña'} />

          <div id="wifi" className={`${card} scroll-mt-20`}>
            <div className="flex items-center gap-2">
              <IconWifi className="h-5 w-5 text-sea-500" />
              <p className="font-semibold text-ink dark:text-white">WiFi</p>
              <span className="rounded-full bg-sea-50 px-2 py-0.5 text-xs font-semibold text-sea-700 dark:bg-gray-900 dark:text-sea-300">Alta velocidad 800 Mbps</span>
            </div>
            {wifiPassword ? (
              <div className="mt-3 space-y-2 text-sm">
                {wifiName && <p className="text-ink-subtle dark:text-ink-dark-subtle">Red: <strong className="text-ink dark:text-white">{wifiName}</strong></p>}
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-ink-subtle dark:text-ink-dark-subtle">Clave: <strong className="font-mono text-base text-ink dark:text-white">{wifiPassword}</strong></p>
                  <CopyButton value={wifiPassword} label="Copiar clave" />
                </div>
                {wifiPassword.endsWith('.') && (
                  <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:bg-amber-900/20 dark:text-amber-200">Ojo: la clave termina con un punto (.) y la primera letra es mayúscula.</p>
                )}
              </div>
            ) : (
              <p className="mt-2 text-sm text-ink-subtle dark:text-ink-dark-subtle">Te enviamos la red y la clave por WhatsApp antes de tu llegada.</p>
            )}
          </div>

          <div className="space-y-2">
            {stay.howTo.map(item => (
              <details key={item.id} className={`${card} group py-4`}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-ink dark:text-white">
                  {item.title}
                  <IconChevronDown className="h-5 w-5 shrink-0 text-sea-500 transition group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-ink-subtle dark:text-ink-dark-subtle">{item.text}</p>
                {item.video && (
                  <a href={item.video} target="_blank" rel="noopener noreferrer" className={`${linkCls} mt-2`}>
                    <IconBrandYoutube className="h-4 w-4" /> Ver video
                  </a>
                )}
              </details>
            ))}

            {isDepto && (
              <details className={`${card} group py-4`}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-ink dark:text-white">
                  Instalaciones del condominio
                  <IconChevronDown className="h-5 w-5 shrink-0 text-sea-500 transition group-open:rotate-180" />
                </summary>
                <p className="mt-2 text-sm text-ink-subtle dark:text-ink-dark-subtle">Se reservan en conserjería. Para el cine y los quinchos conviene reservar con anticipación.</p>
                <ul className="mt-3 divide-y divide-sea-100 dark:divide-gray-700">
                  {AQUA_AMENITIES.map(a => (
                    <li key={a.name} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                      <span className="min-w-0">
                        <span className="block font-medium text-ink dark:text-white">{a.name}</span>
                        <span className="block text-xs text-ink-subtle dark:text-ink-dark-subtle">{a.hours}</span>
                      </span>
                      <span className="shrink-0 text-right text-xs font-semibold text-sea-700 dark:text-sea-300">{a.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 rounded-xl bg-sea-50 p-3 text-xs text-ink-subtle dark:bg-gray-900 dark:text-ink-dark-subtle">
                  <p className="font-semibold text-ink dark:text-white">Pago de instalaciones</p>
                  <p className="mt-1">{AQUA_PAYMENT.holder} · RUT {AQUA_PAYMENT.rut}</p>
                  <p>{AQUA_PAYMENT.bank}</p>
                  <p>Envía el comprobante a {AQUA_PAYMENT.email}</p>
                </div>
              </details>
            )}
          </div>

          {/* Emergencias */}
          <div id="emergencias" className={`${card} scroll-mt-20 space-y-4`}>
            <div className="flex items-center gap-2">
              <IconPhone className="h-5 w-5 text-sea-500" />
              <p className="font-semibold text-ink dark:text-white">Emergencias</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {EMERGENCY_NUMBERS.map(n => (
                <a key={n.number} href={`tel:${n.number}`} className="rounded-xl bg-sea-50 p-3 text-center dark:bg-gray-900">
                  <span className="block font-display text-xl font-bold text-ink dark:text-white">{n.number}</span>
                  <span className="block text-xs text-ink-subtle dark:text-ink-dark-subtle">{n.label}</span>
                </a>
              ))}
            </div>
            <ul className="space-y-1.5">
              {zone.emergency.map(e => (
                <li key={e.label}>
                  <a href={e.maps} target="_blank" rel="noopener noreferrer" className={linkCls}>
                    <IconMapPin className="h-4 w-4" /> {e.label}
                  </a>
                </li>
              ))}
            </ul>
            {stay.localContact && (
              <p className="text-sm text-ink-subtle dark:text-ink-dark-subtle">
                <strong className="text-ink dark:text-white">{stay.localContact.name}</strong> {stay.localContact.role}:{' '}
                <a href={`https://wa.me/${stay.localContact.phone}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-sea-700 dark:text-sea-300">WhatsApp</a>
              </p>
            )}
            <div className="flex gap-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-900/20 dark:text-amber-200">
              <IconAlertTriangle className="h-5 w-5 shrink-0" />
              <p><strong>Tsunami.</strong> {zone.tsunami}</p>
            </div>
          </div>
        </section>

        {/* LA ZONA */}
        <section className="space-y-4">
          <SectionTitle id="zona" icon={IconCompass} kicker="Nuestras recomendaciones" title={`La zona: ${zone.name}`} />
          {zone.groups.some(g => g.places.some(p => p.view)) && (
            <p className="flex items-center gap-1.5 px-1 text-sm text-ink-subtle dark:text-ink-dark-subtle">
              <IconSunset2 className="h-4 w-4 text-amber-500" /> Con bonita vista
            </p>
          )}
          <div className="space-y-2">
            {zone.groups.map((group, gi) => (
              <details key={group.id} open={gi === 0} className={`${card} group py-4`}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-ink dark:text-white">
                  <span>{group.title} <span className="font-normal text-ink-faint">({group.places.length})</span></span>
                  <IconChevronDown className="h-5 w-5 shrink-0 text-sea-500 transition group-open:rotate-180" />
                </summary>
                {group.id === 'comer' && (
                  <div className="mt-3 rounded-xl bg-sea-50 p-4 text-sm dark:bg-gray-900">
                    <p className="flex items-center gap-1.5 font-semibold text-ink dark:text-white"><IconDiscount className="h-4 w-4 text-sea-600" /> {DISCOUNTS.title}</p>
                    <p className="mt-1 text-ink-subtle dark:text-ink-dark-subtle">{DISCOUNTS.text}</p>
                    <p className="mt-1 font-medium text-ink dark:text-white">{DISCOUNTS.perk}</p>
                    <a href={zone.discounts} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center rounded-full bg-sea-600 px-4 py-2 font-semibold text-white">Ver descuentos en buzka.cl</a>
                  </div>
                )}
                <ul className="mt-2 divide-y divide-sea-100 dark:divide-gray-700">
                  {group.places.map(place => (
                    <li key={place.name} className="py-3">
                      <p className="flex items-center gap-1.5 font-medium text-ink dark:text-white">
                        {place.name}
                        {place.view && <IconSunset2 className="h-4 w-4 text-amber-500" aria-label="Con bonita vista" />}
                      </p>
                      <p className="mt-0.5 text-sm text-ink-subtle dark:text-ink-dark-subtle">{place.text}</p>
                      {place.season && <p className="mt-1 inline-block rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">{place.season}</p>}
                      <div className="mt-1.5 flex flex-wrap gap-4">
                        <a href={place.maps} target="_blank" rel="noopener noreferrer" className={linkCls}><IconMapPin className="h-4 w-4" /> Mapa</a>
                        {place.instagram && (
                          <a href={place.instagram} target="_blank" rel="noopener noreferrer" className={linkCls}><IconBrandInstagram className="h-4 w-4" /> Instagram</a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
          <p className="px-1 text-sm text-ink-subtle dark:text-ink-dark-subtle">
            ¿Buscas algo más? Pregúntale a nuestro asistente 24/7 por WhatsApp.
          </p>
        </section>

        {/* SALIDA */}
        <section className="space-y-4">
          <SectionTitle id="salida" icon={IconDoorExit} kicker="El último día" title="Salida" />
          <div className={`${card} flex items-center gap-3`}>
            <IconClock className="h-6 w-6 shrink-0 text-sea-500" />
            <p className="text-sm text-ink dark:text-white">
              {stay.checkOut ? <>Check-out hasta las <strong>{stay.checkOut}</strong>.</> : 'La hora de salida te la confirmamos por WhatsApp.'}
            </p>
          </div>
          <ul className={`${card} space-y-3`}>
            {stay.departure.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-ink dark:text-ink-dark">
                <span className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-2 border-sea-300" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <div className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-sea-100 dark:bg-gray-800 dark:ring-gray-700">
            <Image src="/brand/isotipo-oscuro.png" alt="" width={56} height={56} className="mx-auto dark:hidden" />
            <Image src="/brand/isotipo-claro.png" alt="" width={56} height={56} className="mx-auto hidden dark:block" />
            <p className="mt-3 font-display text-lg font-bold text-ink dark:text-white">¡Gracias por quedarte con nosotros!</p>
            <p className="mt-1 text-sm text-ink-subtle dark:text-ink-dark-subtle">Nos encantaría saber cómo te fue y recibirte de nuevo.</p>
            <div className="mt-4 rounded-xl bg-sea-50 p-4 dark:bg-gray-900">
              <p className="font-semibold text-ink dark:text-white">Un descuento para tu próxima visita</p>
              <ul className="mx-auto mt-2 max-w-xs space-y-1 text-sm text-ink dark:text-white">
                <li><strong>10%</strong> si nos sigues en Instagram</li>
                <li><strong>20%</strong> si subes una historia disfrutando la zona (la playa, un paseo, lo que sea) y nos etiquetas</li>
              </ul>
              <p className="mt-2 text-xs text-ink-subtle dark:text-ink-dark-subtle">Escríbenos por WhatsApp para recibir tu cupón. No aplica en temporada alta.</p>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-sea-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sea-600">
                <IconBrandInstagram className="h-4 w-4" /> Seguir a @de_sal_y_estrella
              </a>
            </div>
            <Link href="/refugios" className={`${linkCls} mt-4`}>
              Volver a De Sal y Estrella
            </Link>
          </div>
        </section>
      </main>

      {/* Menú fijo abajo, siempre visible en el celular */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-sea-100 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-gray-800 dark:bg-gray-900/95">
        <div className="mx-auto grid max-w-2xl grid-cols-5">
          {nav.map(item => (
            <a key={item.href} href={item.href} className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-ink-subtle dark:text-ink-dark-subtle hover:text-sea-700 dark:text-ink-dark-subtle">
              <item.icon className="h-5 w-5" />
              {item.label}
            </a>
          ))}
          <a href={help} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold text-sea-700 dark:text-sea-300">
            <IconBrandWhatsapp className="h-5 w-5" />
            Ayuda
          </a>
        </div>
      </nav>
    </div>
  )
}
