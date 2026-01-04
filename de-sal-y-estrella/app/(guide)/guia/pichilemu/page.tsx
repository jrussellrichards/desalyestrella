import { Metadata } from 'next'
import Image from 'next/image'
import { 
  IconMapPin, 
  IconToolsKitchen2, 
  IconSunset2, 
  IconInfoCircle, 
  IconWaveSine, 
  IconBrandInstagram,
  IconPhone,
  IconFirstAidKit,
  IconBuildingBank,
  IconCar
} from '@tabler/icons-react'

export const metadata: Metadata = {
  title: 'Guía de Huéspedes - Pichilemu | De Sal y Estrella',
  description: 'Tu compañero de viaje en la capital del surf.',
  robots: {
    index: false,
    follow: false,
  },
}

const SECTIONS = [
  { id: 'explora', label: 'Explora', icon: IconMapPin },
  { id: 'sabores', label: 'Sabores', icon: IconToolsKitchen2 },
  { id: 'vive', label: 'Vive', icon: IconWaveSine },
  { id: 'datos', label: 'Datos', icon: IconInfoCircle },
]

const PLACES = [
  {
    title: 'Punta de Lobos',
    desc: 'Santuario de la naturaleza y capital mundial del surf. Sus imponentes morros y olas perfectas lo hacen un imperdible.',
    image: 'https://images.unsplash.com/photo-1526401281623-279b498910f5?q=80&w=800&auto=format&fit=crop',
    tag: 'Imperdible'
  },
  {
    title: 'Cáhuil y Salinas',
    desc: 'Donde el estero se une al mar. Famoso por la producción artesanal de sal y paseos en bote.',
    image: 'https://images.unsplash.com/photo-1621801306886-2e641e277743?q=80&w=800&auto=format&fit=crop',
    tag: 'Naturaleza'
  },
  {
    title: 'Bosque Municipal',
    desc: 'Un pulmón verde ideal para caminatas tranquilas entre pinos y eucaliptos centenarios.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
    tag: 'Relax'
  }
]

const RESTAURANTS = [
  {
    name: 'La Sal',
    desc: 'Cocina de autor con productos locales. La vista al mar es insuperable.',
    price: '$$$',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'El Pescador',
    desc: 'Clásico de Pichilemu. Los mariscos más frescos directo de la caleta.',
    price: '$$',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Cardumen',
    desc: 'Cafetería de especialidad y brunch delicioso. Ambiente relajado.',
    price: '$$',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop'
  }
]

export default function PichilemuGuidePage() {
  return (
    <div className="bg-stone-50 dark:bg-stone-950 min-h-screen font-sans text-ink dark:text-ink-dark pb-24">
      
      {/* Hero Section */}
      <header className="relative h-[85vh] w-full overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1415604934674-561df9abf539?q=80&w=2000&auto=format&fit=crop"
          alt="Pichilemu Sunset"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 pb-12">
          <span className="inline-block px-3 py-1 mb-4 text-xs font-medium tracking-widest text-white uppercase bg-white/20 backdrop-blur-md rounded-full border border-white/30">
            Guía de Huéspedes
          </span>
          <h1 className="font-display text-5xl md:text-7xl text-white mb-2 drop-shadow-lg leading-tight">
            Pichilemu
          </h1>
          <p className="text-stone-200 text-lg md:text-xl max-w-md font-light leading-relaxed">
            Donde el bosque abraza al océano. Descubre los secretos de nuestra costa.
          </p>
        </div>
      </header>

      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-lg border-b border-stone-200 dark:border-stone-800 overflow-x-auto no-scrollbar">
        <div className="flex justify-around md:justify-center md:gap-12 min-w-max px-4 py-3">
          {SECTIONS.map((section) => (
            <a 
              key={section.id}
              href={`#${section.id}`}
              className="flex flex-col items-center gap-1 min-w-[64px] group"
            >
              <div className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 group-hover:bg-amber-100 dark:group-hover:bg-amber-900/30 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                <section.icon size={20} stroke={1.5} />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                {section.label}
              </span>
            </a>
          ))}
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 md:px-0">
        
        {/* Intro Text */}
        <div className="py-12 px-2 text-center">
          <p className="font-display text-2xl md:text-3xl text-stone-800 dark:text-stone-100 leading-relaxed">
            "Aquí el tiempo se detiene entre la sal del mar y la calma de las estrellas."
          </p>
        </div>

        {/* Section: Explora */}
        <section id="explora" className="py-8 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6 px-2">
            <IconMapPin className="text-amber-500" size={28} stroke={1.5} />
            <h2 className="font-display text-3xl text-stone-900 dark:text-white">Explora</h2>
          </div>
          
          <div className="flex overflow-x-auto gap-4 pb-8 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 md:overflow-visible snap-x snap-mandatory">
            {PLACES.map((place, idx) => (
              <div key={idx} className="snap-center shrink-0 w-[85vw] md:w-auto bg-white dark:bg-stone-900 rounded-3xl overflow-hidden shadow-sm border border-stone-100 dark:border-stone-800">
                <div className="relative h-48 w-full">
                  <Image 
                    src={place.image} 
                    alt={place.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/60 backdrop-blur px-2 py-1 rounded-full text-xs font-bold text-stone-800 dark:text-white shadow-sm">
                    {place.tag}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl mb-2 text-stone-900 dark:text-white">{place.title}</h3>
                  <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">
                    {place.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Sabores */}
        <section id="sabores" className="py-8 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6 px-2">
            <IconToolsKitchen2 className="text-amber-500" size={28} stroke={1.5} />
            <h2 className="font-display text-3xl text-stone-900 dark:text-white">Sabores</h2>
          </div>

          <div className="space-y-4">
            {RESTAURANTS.map((rest, idx) => (
              <div key={idx} className="flex gap-4 bg-white dark:bg-stone-900 p-3 rounded-2xl shadow-sm border border-stone-100 dark:border-stone-800 items-center">
                <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-stone-200">
                  <Image 
                    src={rest.image} 
                    alt={rest.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-display text-lg text-stone-900 dark:text-white truncate">{rest.name}</h3>
                    <span className="text-xs font-medium text-stone-400">{rest.price}</span>
                  </div>
                  <p className="text-sm text-stone-600 dark:text-stone-400 line-clamp-2">
                    {rest.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Vive */}
        <section id="vive" className="py-8 scroll-mt-24">
          <div className="flex items-center gap-3 mb-6 px-2">
            <IconWaveSine className="text-amber-500" size={28} stroke={1.5} />
            <h2 className="font-display text-3xl text-stone-900 dark:text-white">Vive</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/30 flex flex-col items-center text-center gap-2">
              <div className="bg-white dark:bg-amber-900/40 p-3 rounded-full text-amber-600 dark:text-amber-400">
                <IconWaveSine size={24} />
              </div>
              <h3 className="font-bold text-stone-800 dark:text-stone-200">Clases de Surf</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">Aprende a dominar las olas en La Puntilla.</p>
            </div>
            <div className="bg-stone-100 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 flex flex-col items-center text-center gap-2">
              <div className="bg-white dark:bg-stone-700 p-3 rounded-full text-stone-600 dark:text-stone-300">
                <IconSunset2 size={24} />
              </div>
              <h3 className="font-bold text-stone-800 dark:text-stone-200">Yoga al Atardecer</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400">Conecta cuerpo y mente frente al mar.</p>
            </div>
          </div>
        </section>

        {/* Section: Datos */}
        <section id="datos" className="py-8 scroll-mt-24 mb-12">
          <div className="flex items-center gap-3 mb-6 px-2">
            <IconInfoCircle className="text-amber-500" size={28} stroke={1.5} />
            <h2 className="font-display text-3xl text-stone-900 dark:text-white">Datos Útiles</h2>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800 overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
            <div className="p-4 flex items-center gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-xl text-blue-600 dark:text-blue-400">
                <IconFirstAidKit size={24} />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 dark:text-white">Hospital de Pichilemu</h4>
                <p className="text-sm text-stone-500">Av. Cáhuil 200 • Urgencias 24/7</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-xl text-green-600 dark:text-green-400">
                <IconBuildingBank size={24} />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 dark:text-white">Cajeros / Bancos</h4>
                <p className="text-sm text-stone-500">Plaza de Armas y Av. Ortúzar</p>
              </div>
            </div>
            <div className="p-4 flex items-center gap-4">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-xl text-purple-600 dark:text-purple-400">
                <IconCar size={24} />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 dark:text-white">Radio Taxis</h4>
                <p className="text-sm text-stone-500">+56 9 1234 5678 (Radio Taxi Playa)</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center py-8 border-t border-stone-200 dark:border-stone-800">
          <p className="font-display text-stone-400 text-lg">De Sal y Estrella</p>
          <p className="text-xs text-stone-300 mt-1">Disfruta tu estadía</p>
        </footer>

      </div>
    </div>
  )
}
