import { client } from '@/lib/sanity.client'
import { groq } from 'next-sanity'
import { Property } from '@/types'
import { urlFor } from '@/lib/image'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import Image from 'next/image'
import { IconMapPin, IconInfoCircle, IconCurrencyDollar, IconStar, IconFlame, IconDroplet, IconWifi, IconTrash, IconMessageCircle, IconHome, IconTools, IconSoup, IconBeach, IconCompass, IconBrandInstagram, IconShoppingBag, IconCoffee, IconDeviceTv, IconToolsKitchen2, IconBrandYoutube, IconCar } from '@tabler/icons-react'

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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return {
    title: `Guía del Huésped - ${slug} | Sal & Estrella`,
  }
}

const fetchProperty = cache(async (slug: string) => {
  if (!slug) return null
  return client.fetch<Property | null>(propertyQuery, { slug })
})

export default async function GuestGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = await fetchProperty(slug)

  if (!property) notFound()

  const mainImage = property.gallery?.[0] ? urlFor(property.gallery[0]).width(1200).height(600).url() : null
  const isLaSerena = property.location?.toLowerCase().includes('serena') || property.slug.current.includes('serena')

  const is308 = property.slug.current.includes('308') || property.name.includes('308');
  const is403 = property.slug.current.includes('403') || property.name.includes('403');
  
  let wifiName = property.wifiName;
  let wifiPassword = property.wifiPassword;
  if (!wifiName || !wifiPassword) {
      if (is308) {
          wifiName = 'Aqua 308-2';
          wifiPassword = 'A951096594.';
      } else if (is403) {
          wifiName = 'Aqua 403-3';
          wifiPassword = 'A951096594.';
      } else {
          wifiName = isLaSerena ? 'Aqua-Resort' : 'Richards';
          wifiPassword = isLaSerena ? 'laserena2024' : '951096594';
      }
  }

  let displayAddress = property.address;
  if (!displayAddress) {
      if (is308 || is403) {
          displayAddress = 'Avenida Las Higueras 671 Avenida del mar, La Serena, Coquimbo 1711371, Chile';
      } else {
          displayAddress = isLaSerena
            ? 'Avenida del Mar 2500, La Serena (Resort Aqua).'
            : 'José Miguel Camilo 442, Pichilemu, O\'Higgins.';
      }
  }
  
  let extraLocationInfo = [];
  if (property.tower) extraLocationInfo.push(`Torre: ${property.tower}`);
  else if (is308) extraLocationInfo.push('Torre: 2');
  else if (is403) extraLocationInfo.push('Torre: 3');
  
  let parkingNumber = property.parkingInfo;
  if (!parkingNumber) {
    if (is308) parkingNumber = '401';
    else if (is403) parkingNumber = '227';
  }

  if (is308) extraLocationInfo.unshift('Departamento: 308');
  else if (is403) extraLocationInfo.unshift('Departamento: 403');

  let mapsLink = "https://maps.app.goo.gl/SoXTBvNNBYsfckck8";
  if (isLaSerena) {
      if (is308 || is403) {
          mapsLink = "https://maps.app.goo.gl/SGmCPNPw346SFM5TA";
      } else {
          mapsLink = "https://maps.app.goo.gl/3N3Wv1qV8C6u9m9X9";
      }
  }
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header / Hero */}
      <header className="relative h-64 sm:h-80 md:h-96 w-full">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={property.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full w-full bg-slate-800" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <span className="text-amber-400 font-semibold tracking-widest uppercase text-sm mb-2 drop-shadow-md">
            Guía del Huésped
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg">
            Bienvenido a {property.name}
          </h1>
          <p className="mt-2 text-gray-200 text-lg flex items-center justify-center gap-2 drop-shadow">
            <IconMapPin className="h-5 w-5 text-amber-500" />
            {property.location}
          </p>
        </div>
      </header>

      {/* Sticky Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm overflow-x-auto no-scrollbar">
        <div className="mx-auto max-w-4xl flex items-center justify-start md:justify-center gap-2 p-3 whitespace-nowrap">
          <a href="#inicio" className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-ocean-50 dark:bg-amber-900/20 text-ocean-700 dark:text-amber-500 text-sm font-semibold transition-colors">
            <IconHome className="h-4 w-4" /> Inicio
          </a>
          <a href="#guia" className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium transition-colors">
            <IconTools className="h-4 w-4" /> Guía de Uso
          </a>
          <a href="#gastronomia" className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium transition-colors">
            <IconSoup className="h-4 w-4" /> Gastronomía
          </a>
          <a href="#bares" className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium transition-colors">
            <IconMessageCircle className="h-4 w-4" /> Bares
          </a>
          <a href="#playas" className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium transition-colors">
            <IconBeach className="h-4 w-4" /> Playas
          </a>
          {isLaSerena && (
            <a href="#compras" className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium transition-colors">
              <IconShoppingBag className="h-4 w-4" /> Shopping y Recuerdos
            </a>
          )}
          <a href="#experiencias" className="flex items-center gap-1.5 px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm font-medium transition-colors">
            <IconCompass className="h-4 w-4" /> Experiencias
          </a>
        </div>
      </nav>

      <main id="inicio" className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-12 scroll-mt-20">
        {/* Mensaje de Bienvenida General */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Bienvenidos a una experiencia inolvidable</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
            Nos alegra muchísimo recibirte. Hemos diseñado y preparado cada detalle de este espacio pensando en tu máximo confort y descanso.
            En esta guía encontrarás todo lo necesario para aprovechar al máximo tu estadía, desde el uso de las instalaciones hasta nuestras recomendaciones de la zona. 
            ¡Relájate, disfruta y siéntete como en casa! Si necesitas cualquier asistencia, estamos a tu disposición.
          </p>
        </section>

        {/* Guía de Uso de la Casa */}
        <section id="guia" className="space-y-8 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2 px-1">
            <IconInfoCircle className="h-6 w-6 text-ocean-600 dark:text-amber-500" />
            Guía de Uso {isLaSerena ? 'del Departamento' : 'de la Casa'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Acceso */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 transition-all hover:shadow-md md:col-span-2">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl h-fit">
                <IconHome className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Acceso Inteligente</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Tu ingreso es autónomo y seguro. Utiliza la <strong>clave temporal única</strong> que generamos especialmente para tu estadía. Simplemente toca el panel de la cerradura digital para iluminarlo e introduce tu código. <em>(Asegúrate de usar la cerradura de la puerta, no la caja fuerte externa).</em>
                </p>
              </div>
            </div>

            {/* Estacionamiento */}
            {parkingNumber && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 transition-all hover:shadow-md md:col-span-2">
                <div className="bg-slate-100 dark:bg-slate-900/30 p-3 rounded-xl h-fit">
                  <IconCar className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Estacionamiento Privado</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    Tu estadía incluye el estacionamiento exclusivo <strong>N° {parkingNumber}</strong>. Se encuentra al interior del condominio, el cual dispone de acceso controlado y un sistema de vigilancia 24/7 para tu total tranquilidad y la seguridad de tu vehículo.
                  </p>
                </div>
              </div>
            )}

            {/* Elemento Condicional: Chimenea (Pichilemu) vs Laguna (La Serena) */}
            {!isLaSerena ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 transition-all hover:shadow-md">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl h-fit">
                  <IconFlame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Chimenea / Calefacción</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    Para encenderla, usa primero astillas pequeñas y abre el tiraje. Una vez prendido, agrega leña seca para mantener el calor. Evita usar líquidos inflamables.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 transition-all hover:shadow-md">
                <div className="bg-ocean-100 dark:bg-ocean-900/30 p-3 rounded-xl h-fit">
                  <IconInfoCircle className="h-6 w-6 text-ocean-600 dark:text-ocean-400" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Check-in en Conserjería</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                    Por tu completa seguridad y para garantizar una experiencia de primer nivel, es indispensable registrarse al llegar en conserjería (disponible 24/7). Una vez registrado, tendrás pleno acceso para disfrutar de las increíbles instalaciones del complejo.
                  </p>
                  <a href="#amenidades" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                    <IconStar className="h-4 w-4 mr-1" /> Ver instalaciones
                  </a>
                </div>
              </div>
            )}

            {/* Calefont / Agua caliente */}
            {!isLaSerena ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 transition-all hover:shadow-md">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl h-fit">
                  <IconDroplet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Agua Caliente (Calefont)</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    El encendido es automático. El calefont es digital, desde el panel puedes ajustar la temperatura en el nivel que gustes.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 transition-all hover:shadow-md">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl h-fit">
                  <IconDroplet className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Agua Caliente</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    El sistema es completamente automático y de caudal continuo. Para disfrutar del agua caliente, simplemente gira la llave hacia la izquierda, y hacia la derecha para agua refrescante.
                  </p>
                </div>
              </div>
            )}

            {/* WiFi */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 transition-all hover:shadow-md">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-xl h-fit">
                <IconWifi className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="w-full">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h4 className="font-bold text-gray-900 dark:text-white">WiFi y Conectividad</h4>
                  <span className="text-[10px] md:text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-bold border border-purple-200 dark:border-purple-800/50">
                    🚀 Alta Velocidad 800 Mbps
                  </span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <p><strong>Red:</strong> {wifiName}</p>
                  <p>
                    <strong>Clave:</strong> {wifiPassword}
                    {isLaSerena && <span className="text-[11px] md:text-xs text-ocean-600 dark:text-amber-500 ml-2 font-medium">*(Incluye mayúscula y punto final)*</span>}
                  </p>
                  <span className="text-xs text-gray-400 mt-2 block italic">Conexión estable ideal para streaming en 4K tanto en interior como terraza.</span>
                </div>
              </div>
            </div>

            {/* Opciones extra para La Serena */}
            {isLaSerena && (
              <>
                {/* Cafetera */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 transition-all hover:shadow-md">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl h-fit">
                    <IconCoffee className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Cafetera</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                      Comienza tu mañana con estilo usando la cafetera Dolce Gusto Genio S Touch, ideal para preparar y disfrutar de un exquisito café de cápsulas a temperatura perfecta.
                    </p>
                    <a href="https://www.youtube.com/watch?v=okHniwK4Ie4" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400">
                      <IconBrandYoutube className="h-4 w-4 mr-1" /> Ver tutorial de uso
                    </a>
                  </div>
                </div>

                {/* Cocina */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 transition-all hover:shadow-md">
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-xl h-fit">
                    <IconToolsKitchen2 className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Cocina de Inducción</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      El espacio cuenta con una moderna cocina de inducción táctil. Para usarla, presiona el botón de encendido y luego toca el nivel de temperatura del quemador deseado. Por seguridad, mantén presionada la "llave" por 5 segundos para bloquear o desbloquear el panel táctil.
                    </p>
                  </div>
                </div>

                {/* TV */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 transition-all hover:shadow-md">
                  <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl h-fit">
                    <IconDeviceTv className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">Entretenimiento</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      La TV cuenta con televisión digital, YouTube Premium y YouTube Music para una experiencia completa. Las cuentas ya se encuentran agregadas, si hay algún problema contáctanos.
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Basura */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 transition-all hover:shadow-md">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl h-fit">
                <IconTrash className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Basura y Reciclaje</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {isLaSerena
                    ? 'Para tu comodidad y para mantener la limpieza del edificio, los ductos de basura se encuentran en tu mismo piso, frente a los ascensores. Por favor, asegúrate de bajar tus residuos en bolsas bien cerradas.'
                    : 'Para mantener el impecable entorno, te pedimos dejar la basura en los contenedores exteriores habilitados, cuidando de no dejar bolsas sueltas.'
                  }
                </p>
              </div>
            </div>

            {/* Ubicación */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 transition-all hover:shadow-md lg:col-span-1">
              <div className="bg-slate-100 dark:bg-slate-900/30 p-3 rounded-xl h-fit">
                <IconMapPin className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">Donde estamos</h4>
                <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3 space-y-1">
                  <p>{displayAddress}</p>
                  {extraLocationInfo.map((info, idx) => (
                    <p key={idx} className="font-medium text-ocean-700 dark:text-amber-400">{info}</p>
                  ))}
                </div>
                <a href={mapsLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                  <IconMapPin className="h-3 w-3 mr-1" /> Ver en Google Maps
                </a>
              </div>
            </div>

            {/* Contacto Sergio (Solo Pichilemu) */}
            {!isLaSerena && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4 transition-all hover:shadow-md lg:col-span-1">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl h-fit">
                  <IconMessageCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Contacto de Emergencia</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                    Sergio está encargado de ayudarlos en cualquier cosa que necesiten durante su estadía.
                  </p>
                  <a href="https://wa.me/56956605983" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                    <IconMessageCircle className="h-3 w-3 mr-1" /> WhatsApp Sergio: +56 9 5660 5983
                  </a>
                </div>
              </div>
            )}

            {/* Áreas Comunes y Amenidades (Solo La Serena) */}
            {isLaSerena && (
              <div id="amenidades" className="md:col-span-2 space-y-8 mt-4 scroll-mt-24">
                <div className="bg-ocean-50 dark:bg-amber-900/10 rounded-2xl p-6 border border-ocean-100 dark:border-amber-900/30">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-ocean-600 dark:bg-amber-500 p-2 rounded-lg text-white dark:text-gray-900">
                      <IconStar className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-gray-900 dark:text-white">Club House & Amenidades Premium</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Instalaciones de primer nivel para disfrutar durante tu estadía.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Piscina Temperada */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="p-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                          <IconDroplet className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-bold text-ocean-600 dark:text-amber-500">$3.000 p/p</span>
                      </div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-sm">Piscina Temperada</h5>
                      <p className="text-xs text-gray-500 mt-1">Bloques 1h: 08:00 - 22:00.</p>
                    </div>

                    {/* Gimnasio */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="p-1.5 bg-slate-50 dark:bg-slate-900/30 rounded-lg text-slate-600 dark:text-slate-400">
                          <IconTools className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-bold text-ocean-600 dark:text-amber-500">$1.000 p/p</span>
                      </div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-sm">Gimnasio Full Equipado</h5>
                      <p className="text-xs text-gray-500 mt-1">L-D: 05:00 - 21:00</p>
                    </div>

                    {/* Sauna */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="p-1.5 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                          <IconFlame className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-bold text-ocean-600 dark:text-amber-500">$5.000</span>
                      </div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-sm">Sauna</h5>
                      <p className="text-xs text-gray-500 mt-1">Bloques 1/2h: 09:00 - 21:30.</p>
                    </div>

                    {/* Jacuzzi */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="p-1.5 bg-teal-50 dark:bg-teal-900/30 rounded-lg text-teal-600 dark:text-teal-400">
                          <IconDroplet className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-bold text-ocean-600 dark:text-amber-500">$20.000</span>
                      </div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-sm">Jacuzzi</h5>
                      <p className="text-xs text-gray-500 mt-1">Bloques 1h: 10:00 - 21:00.</p>
                    </div>

                    {/* Sala de Juegos */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="p-1.5 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                          <IconCompass className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-bold text-green-600">Sin Costo</span>
                      </div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-sm">Sala de Juegos</h5>
                      <p className="text-xs text-gray-500 mt-1 mb-2">Bloques 3h. Horarios: 9-12h, 13-16h, 17-22h.</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Equipada con mesa de pool, taca taca, tenis de mesa y frigobar para una tarde muy entretenida.</p>
                    </div>

                    {/* Sala de Cine */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="p-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                          <IconStar className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-bold text-green-600">Sin Costo</span>
                      </div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-sm">Sala de Cine</h5>
                      <p className="text-xs text-gray-500 mt-1">Bloques 3h. L-D varios horarios. Vi-Sa hastas 1:30 AM.</p>
                    </div>

                    {/* Sala Multiuso */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="p-1.5 bg-pink-50 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                          <IconHome className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-bold text-green-600">Sin Costo</span>
                      </div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-sm">Sala Multiuso</h5>
                      <p className="text-xs text-gray-500 mt-1">L-J: hasta 22h. V-S: hasta 00:00. Cap. 25px.</p>
                    </div>

                    {/* Quinchos */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="p-1.5 bg-red-50 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
                          <IconFlame className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-bold text-ocean-600">$15.000</span>
                      </div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-sm">Quinchos para Asados</h5>
                      <p className="text-xs text-gray-500 mt-1 mb-2">L-J: 12-17h, 18-23h. V-S: 18-00h.</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Fantástico espacio techado ideal para parrillar en familia o con amigos, ¡y que además incluye uso de piscina! (Aplica multa si no se entrega limpio).</p>
                    </div>

                    {/* Piscinas Externas */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="p-1.5 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg text-cyan-600 dark:text-cyan-400">
                          <IconBeach className="h-5 w-5" />
                        </span>
                        <span className="text-xs font-bold text-green-600">Sin Costo</span>
                      </div>
                      <h5 className="font-bold text-gray-900 dark:text-white text-sm">Piscinas Externas</h5>
                      <p className="text-xs text-gray-500 mt-1">10:00 - 20:00 hrs. <br/> <strong>Nota:</strong> Solo funcionan en temporada alta.</p>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center border-t border-ocean-100 dark:border-amber-900/30 pt-6">
                    <div>
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">¿Cómo reservar?</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Para disfrutar de estas instalaciones, debes coordinar tu bloque en **Conserjería**.
                        Se recomienda reservar con anticipación, especialmente para el cine y los quinchos.
                      </p>
                    </div>
                    <div className="bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-white dark:border-gray-800">
                      <span className="text-[10px] font-bold text-ocean-700 dark:text-amber-500 uppercase tracking-widest block mb-2">Datos para el pago</span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 space-y-0.5">
                        <p><strong>Condominio Aqua La Serena</strong> | RUT 53.323.974-9</p>
                        <p>Banco Santander | Cta Cte: 7843849</p>
                        <p className="text-ocean-600 dark:text-amber-600 font-medium pt-1">Envía tu comprobante a: conserje@aquaserena.cl</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>




        {/* Recomendaciones Locales (Generales para todos, pero adaptadas a la ubicación) */}
        <section id="gastronomia" className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 dark:border-gray-700 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <IconStar className="h-6 w-6 text-amber-500" />
            Nuestras Recomendaciones en {property.location}
          </h2>

          <div className="space-y-12">
            {/* GASTRONOMÍA */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">
                🍽️ Gastronomía
              </h3>

              {/* Restaurantes y Cafeterías */}
              <div>
                <h4 className="font-semibold text-lg text-ocean-600 dark:text-amber-500 mb-4 px-1">{isLaSerena ? 'Imperdibles frente al Mar' : 'Restaurantes y Cafeterías'}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {isLaSerena ? (
                    <>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <h5 className="font-bold text-gray-900 dark:text-white mb-2">Taikin Sushi Bar</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Asian Fusion en plena Av. del Mar. Exquisita combinación de sushi japonés con toques sudamericanos en un ambiente moderno.</p>
                        <a href="https://www.google.com/maps/search/Taikin+Sushi+Bar+La+Serena" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                          <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                        </a>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <h5 className="font-bold text-gray-900 dark:text-white mb-2">Bendito Completo / Entre Tacos</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Lo mejor de dos mundos: auténticos completos chilenos y tacos mexicanos en un solo lugar. Ideal para un almuerzo rápido y sabroso.</p>
                        <a href="https://maps.app.goo.gl/3N3Wv1qV8C6u9m9X9" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                          <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                        </a>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <h5 className="font-bold text-gray-900 dark:text-white mb-2">Mare by Bombo</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Gastronomía de autor especializada en productos del mar, ceviches y cortes a la parrilla. Destaca por su ambiente premium y platos como el Arrisotado de Mariscos.</p>
                        <a href="https://www.google.com/maps/search/Mare+by+Bombo+La+Serena" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                          <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                        </a>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <h5 className="font-bold text-gray-900 dark:text-white mb-2">Cafetería La Trinidad</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Acogedora cafetería cerca de la playa ideal para desayunos y onces. Excelente selección de café y pastelería para comenzar el día de la mejor forma.</p>
                        <a href="https://www.google.com/maps/search/Cafeteria+La+Trinidad+La+Serena" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                          <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                        </a>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <h5 className="font-bold text-gray-900 dark:text-white mb-2">Bakulic</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Un clásico de la Av. del Mar para disfrutar de pescados y mariscos de alta calidad con la mejor vista al Faro.</p>
                        <a href="https://www.google.com/maps/search/Bakulic+La+Serena" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                          <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                        </a>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <h5 className="font-bold text-gray-900 dark:text-white mb-2">La Sal</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Cocina de autor especializada en pescados y mariscos. Un ambiente sofisticado y premium ubicado en el sector de Punta de Lobos.</p>
                        <a href="https://www.google.com/maps/search/Restaurante+La+Sal+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                          <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                        </a>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <h5 className="font-bold text-gray-900 dark:text-white mb-2">Cardumen Café</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Cafetería de especialidad en la zona centro. Imperdible su pastelería de autor y excelentes opciones de brunch.</p>
                        <a href="https://www.google.com/maps/search/Cardumen+Cafe+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                          <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                        </a>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <h5 className="font-bold text-gray-900 dark:text-white mb-2">Cúrcuma</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">La mejor alternativa céntrica para cuidarse con comida inteligente, que brinda creativas y sabrosas opciones vegetarianas y veganas.</p>
                        <a href="https://www.google.com/maps/search/Curcuma+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                          <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                        </a>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <h5 className="font-bold text-gray-900 dark:text-white mb-2">Costa Maria</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Un clásico absoluto para la hora de almuerzo. Perfecto para probar reineta fresca, pastel de jaiba y deliciosas empanadas con vista directa al mar.</p>
                        <a href="https://www.google.com/maps/search/Restaurante+Costa+Maria+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                          <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                        </a>
                      </div>

                      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                        <h5 className="font-bold text-gray-900 dark:text-white mb-2">Los Piures Club Social</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Comida típica chilena en un entorno rústico único. Muy reconocidos por sus contundentes empanadas y mariscos maridados con gran compañía local, frente a la laguna de Cáhuil.</p>
                        <a href="https://www.google.com/maps/search/Los+Piures+Club+Social+Cahuil" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                          <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Picadas Tradicionales (Solo Pichilemu) */}
              {!isLaSerena && (
                <div>
                  <h4 className="font-semibold text-lg text-ocean-600 dark:text-amber-500 mb-4 px-1 mt-8">Picadas Tradicionales</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Sanguchería La Casa Verde</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Generosos sándwiches gourmet, crudos, y un menú con opciones deliciosamente veganas. Es una parada estratégica ideal tras un día de surf.</p>
                      <a href="https://www.google.com/maps/search/Sangucheria+La+Casa+Verde+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Nativo Restobar</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Situado en plena Avenida Ortúzar. Destaca por su impecable coctelería de autor y atmósfera vibrante, convirtiéndose en una excelente opción de precio moderado.</p>
                      <a href="https://www.google.com/maps/search/Nativo+Restobar+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Sandwichería Mi Tercer Tiempo</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">El lugar definitivo para un sandwich contundente. Famosos por su rapidez y sabor urbano chileno, son la parada obligatoria después de un día intenso o una larga noche.</p>
                      <a href="https://www.google.com/maps/search/Sandwicheria+Mi+Tercer+Tiempo+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Sushi Tsumare</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Sushi de alta calidad con ingredientes frescos y preparaciones creativas. Una de las mejores opciones en Pichilemu para disfrutar de sabores japoneses bien ejecutados.</p>
                      <a href="https://www.google.com/maps/search/Sushi+Tsumare+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Empanadas El Diablito</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Favoritas del sector de Playa Hermosa por sus contundentes empanadas fritas. Un local auténtico con rellenos abundantes; imperdibles las de pino y las de mariscos.</p>
                      <a href="https://maps.app.goo.gl/J8CXywh7ncku9Kzy6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* BARES Y VIDA NOCTURNA */}
            <div id="bares" className="space-y-6 scroll-mt-24">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 mt-12">
                🍸 Bares y Vida Nocturna
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isLaSerena ? (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">OVO Nightclub</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">La discoteca más exclusiva de la zona, ubicada en Enjoy Coquimbo. El lugar preferido para eventos masivos y noches de fiesta inolvidables.</p>
                      <a href="https://www.google.com/maps/search/OVO+Nightclub+Coquimbo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">New City</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Bar y discoteca con dos niveles: ritmos urbanos abajo y electrónica arriba. Un imperdible en el sector de El Santo.</p>
                      <a href="https://www.google.com/maps/search/New+City+La+Serena" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">El Muelle</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Pub clásico frente al mar. Famoso por sus "Poncherazos" y su ambiente relajado para disfrutar del atardecer con amigos.</p>
                      <a href="https://www.google.com/maps/search/El+Muelle+La+Serena" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Huentelauquen</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Restobar de estilo rústico en plena Av. del Mar. Mezcla perfecta de sabores del mar, tragos de autor y música en vivo.</p>
                      <a href="https://www.google.com/maps/search/Huentelauquen+La+Serena" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Waitara Club</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">El gran epicentro de la fiesta en La Puntilla. Discoteca completa con dos pistas de baile muy activas y grandes eventos a poquísimos pasos de las olas.</p>
                      <a href="https://www.google.com/maps/search/Waitara+Club+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Bar La Virgen</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">El spot más "trendy" de Pichilemu. Ofrece una mezcla perfecta de coctelería de autor y ambiente relajado con una vista privilegiada al mar.</p>
                      <a href="https://maps.app.goo.gl/vY2N6oGgD2z6Vv7V6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Osaka</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Propuesta exclusiva de cocina Nikkei (fusión peruano-japonesa). Mixología de alto nivel frente a la playa en un entorno muy sofisticado.</p>
                      <a href="https://maps.app.goo.gl/vY2N6oGgD2z6Vv7V6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* PLAYAS */}
            <div id="playas" className="space-y-6 scroll-mt-24">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 mt-12">
                🌊 Playas Principales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {isLaSerena ? (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Totoralillo</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Una de las mejores playas de la región, famosa por sus aguas turquesas y su arena blanca. El lugar perfecto para el surf y el descanso total.</p>
                      <a href="https://www.google.com/maps/search/Totoralillo+beach,+Coquimbo,+Chile" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Cuatro Esquinas</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Punto de encuentro clásico en plena Avenida del Mar. Excelente ambiente, amplia oferta gastronómica y actividades perfectas para pasear.</p>
                      <a href="https://www.google.com/maps/search/Avenida+Cuatro+Esquinas+La+Serena" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Guanaqueros</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Extensa bahía de aguas tranquilas y cálidas ideales para el baño y windsurf. Un destino insuperable por su variada gastronomía marina.</p>
                      <a href="https://www.google.com/maps/search/Playa+Guanaqueros" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">La Puntilla (Playa Principal)</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Ideal para familias y principiantes del surf. Cuenta con servicios, restaurantes cercanos y una caminata agradable por la costanera.</p>
                      <a href="https://www.google.com/maps/search/La+Puntilla+Pichilemu+playa" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Playa Hermosa</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Extensa playa de arenas grises, perfecta para largas caminatas y disfrutar de atardeceres tranquilos lejos del centro.</p>
                      <a href="https://www.google.com/maps/search/Playa+Hermosa+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Punta de Lobos</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Santuario de la Naturaleza y Capital Mundial del Surf. Un spot impresionante con sus icónicos morros y olas de clase mundial.</p>
                      <a href="https://www.google.com/maps/search/Punta+de+Lobos+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* DÓNDE COMPRAR (Solo La Serena) */}
            {isLaSerena && (
              <div id="compras" className="space-y-6 scroll-mt-24">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 mt-12">
                  🛍️ Shopping y Recuerdos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                    <h5 className="font-bold text-gray-900 dark:text-white mb-2">Mall Plaza La Serena</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">El principal centro comercial de la zona. Encontrarás tiendas, supermercado, cine y un buen patio de comidas para todas las necesidades.</p>
                    <a href="https://www.google.com/maps/search/Mall+Plaza+La+Serena" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                      <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                    </a>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                    <h5 className="font-bold text-gray-900 dark:text-white mb-2">Supermercado Jumbo</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Ubicado junto al Mall Plaza, es la opción más completa para abastecerte con gran variedad de productos frescos, carnes y panadería.</p>
                    <a href="https://www.google.com/maps/search/Jumbo+La+Serena" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                      <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                    </a>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                    <h5 className="font-bold text-gray-900 dark:text-white mb-2">Pueblito Peñuelas</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Un agradable lugar al aire libre para vitrinear artesanías locales, tiendas de emprendedores, food trucks y a veces música en vivo.</p>
                    <a href="https://www.google.com/maps/search/Pueblito+Pe%C3%B1uelas+La+Serena" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                      <IconMapPin className="h-4 w-4 mr-1" /> Ver en Google Maps
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* EXPERIENCIAS Y CULTURA */}
            <div id="experiencias" className="space-y-6 scroll-mt-24">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2 mt-12">
                🏄‍♂️ Experiencias, Tours y Cultura
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLaSerena ? (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Maranatha Tour (Ballenas)</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Vive la experiencia inolvidable de ver ballenas y delfines en su hábitat natural en Caleta Chañaral de Aceituno. Un tour imperdible de vida silvestre.</p>
                      <div className="flex flex-wrap gap-4">
                        <a href="https://www.google.com/maps/search/Caleta+Chañaral+de+Aceituno" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                          <IconMapPin className="h-4 w-4 mr-1" /> Ver ubicación
                        </a>
                        <a href="https://www.instagram.com/turismo_maranata/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-pink-600 hover:text-pink-700 dark:text-pink-500 dark:hover:text-pink-400">
                          <IconBrandInstagram className="h-4 w-4 mr-1" /> Instagram
                        </a>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Valle del Elqui (Observatorio Mamalluca)</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Explora la magia del Valle del Elqui y maravíllate con los cielos más limpios del mundo en el Observatorio Mamalluca. Turismo astronómico de primer nivel.</p>
                      <div className="flex flex-wrap gap-4">
                        <a href="https://www.google.com/maps?q=-29.9899318,-70.6852942" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                          <IconMapPin className="h-4 w-4 mr-1" /> Ver ubicación
                        </a>
                        <a href="https://www.instagram.com/observatorio_mamalluca/?hl=es" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-pink-600 hover:text-pink-700 dark:text-pink-500 dark:hover:text-pink-400">
                          <IconBrandInstagram className="h-4 w-4 mr-1" /> Instagram
                        </a>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow">
                      <h5 className="font-bold text-gray-900 dark:text-white mb-2">Clases de Surf (Escuela Poisson)</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Ubicada a pasos del Faro en plena Avenida del Mar. Ideal para tomar clases de surf, arrendar equipos y disfrutar de las olas con instructores certificados.</p>
                      <div className="flex flex-wrap gap-4">
                        <a href="https://www.google.com/maps/search/Escuela+de+Surf+Poisson+La+Serena" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                          <IconMapPin className="h-4 w-4 mr-1" /> Ver ubicación
                        </a>
                        <a href="https://www.instagram.com/escuelasurfpoisson/?hl=es-la" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium text-pink-600 hover:text-pink-700 dark:text-pink-500 dark:hover:text-pink-400">
                          <IconBrandInstagram className="h-4 w-4 mr-1" /> Instagram
                        </a>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-transform">
                      <h5 className="font-bold text-ocean-700 dark:text-amber-500 mb-1">Clases de Surf</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Actividad emblema local. Toma clases de iniciación pura en La Puntilla o escala al nivel avanzado y contemplativo que exige Punta de Lobos.</p>
                      <a href="https://www.google.com/maps/search/Clases+de+Surf+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-3 w-3 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-transform">
                      <div className="flex justify-between items-center mb-1">
                        <h5 className="font-bold text-ocean-700 dark:text-amber-500">Ruta de la Sal (Cáhuil)</h5>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Sumérgete a solo 15 km en la paciencia ancestral chilena. Observa y adquiere maravillosa sal de mar directamente en las pozas artesanales de extracción.</p>
                      <a href="https://www.google.com/maps/search/Ruta+de+la+Sal+Cahuil" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-3 w-3 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-transform">
                      <h5 className="font-bold text-ocean-700 dark:text-amber-500 mb-1">Deportes Acuáticos</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Un ecosistema ideal sin fuertes olas; permite un tranquilo pero desafiante recorrido en Stand Up Paddle o hermosos paseos en bote en la Laguna de Cáhuil.</p>
                      <a href="https://www.google.com/maps/search/Deportes+Acuaticos+Laguna+Cahuil" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-3 w-3 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-transform">
                      <h5 className="font-bold text-ocean-700 dark:text-amber-500 mb-1">Parque Agustín Ross</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Pasea reflexivamente en el imponente Monumento Nacional repleto de centenarias palmeras, jardines simétricos y la gran fachada del icónico casino francés.</p>
                      <a href="https://www.google.com/maps/search/Parque+Agustin+Ross+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-3 w-3 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-transform">
                      <h5 className="font-bold text-ocean-700 dark:text-amber-500 mb-1">Arte en Arcilla de Pañul</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Camino al sur, podrás acercarte a los tornos antiguos de maestros artesanos para llevar a casa la famosa artesanía noble en arcilla blanca.</p>
                      <a href="https://www.google.com/maps/search/Artesania+Pa%C3%B1ul+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-3 w-3 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-5 border border-gray-100 dark:border-gray-800 hover:-translate-y-1 transition-transform">
                      <h5 className="font-bold text-ocean-700 dark:text-amber-500 mb-1">Iglesia San Andrés</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Enclavada en el valle interior (Ciruelos), es un viaje en el tiempo patrimonial descubriendo su gruesa estructura colonial original levantada en 1778.</p>
                      <a href="https://www.google.com/maps/search/Iglesia+San+Andres+Ciruelos+Pichilemu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs font-medium text-ocean-600 hover:text-ocean-700 dark:text-amber-500 dark:hover:text-amber-400">
                        <IconMapPin className="h-3 w-3 mr-1" /> Ver en Google Maps
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
