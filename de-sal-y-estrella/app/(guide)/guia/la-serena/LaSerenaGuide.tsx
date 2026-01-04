'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  IconMapPin, 
  IconToolsKitchen2, 
  IconTelescope, 
  IconInfoCircle, 
  IconHome,
  IconBuildingCommunity,
  IconCar,
  IconWifi,
  IconKey,
  IconClock,
  IconDoorEnter
} from '@tabler/icons-react'
import { CONTENT } from './content'

type Language = 'es' | 'en' | 'fr'

export default function LaSerenaGuide() {
  const [language, setLanguage] = useState<Language>('es')
  const t = CONTENT[language]

  return (
    <div className="bg-[#FDFBF7] dark:bg-stone-950 min-h-screen font-sans text-stone-800 dark:text-stone-200 pb-24 selection:bg-amber-200 selection:text-amber-900">
      
      {/* Language Selector - Floating */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed top-6 right-6 z-[60] flex gap-2"
      >
        {(['es', 'en', 'fr'] as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
              language === lang 
                ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900 shadow-lg scale-110' 
                : 'bg-white/50 dark:bg-stone-800/50 text-stone-500 hover:bg-white dark:hover:bg-stone-800 backdrop-blur-sm'
            }`}
          >
            {lang}
          </button>
        ))}
      </motion.div>

      {/* Hero Section - Magazine Style */}
      <header className="relative h-[90vh] w-full overflow-hidden flex flex-col justify-end pb-12 md:pb-24 px-6 md:px-12">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <Image
            src="https://images.unsplash.com/photo-1597262122683-c11d67269c3d?q=80&w=2000&auto=format&fit=crop"
            alt="La Serena Faro"
            fill
            className="object-cover object-center brightness-[0.85]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-stone-900/10" />
        </motion.div>
        
        <div className="relative z-10 max-w-4xl mx-auto w-full text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="inline-flex items-center gap-3 mb-6 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 w-fit mx-auto md:mx-0"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-medium tracking-[0.2em] text-white uppercase">
              {t.hero.badge}
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="font-display text-6xl md:text-8xl lg:text-9xl text-white mb-6 drop-shadow-sm leading-[0.9]"
          >
            {t.hero.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-stone-100 text-lg md:text-2xl max-w-xl font-light leading-relaxed md:leading-relaxed mx-auto md:mx-0"
          >
            {t.hero.subtitle}
          </motion.p>
        </div>
      </header>

      {/* Navigation - Minimalist */}
      <nav className="sticky top-0 z-50 bg-[#FDFBF7]/90 dark:bg-stone-950/90 backdrop-blur-xl border-b border-stone-200/50 dark:border-stone-800/50">
        <div className="max-w-5xl mx-auto overflow-x-auto no-scrollbar">
          <div className="flex justify-start md:justify-center gap-8 md:gap-12 px-6 py-4 min-w-max">
            {t.sections.map((section, i) => (
              <motion.a 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + (i * 0.1) }}
                key={section.id}
                href={`#${section.id}`}
                className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-amber-500 transition-colors" />
                {section.label}
              </motion.a>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 md:px-12">
        
        {/* Intro Quote */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-20 md:py-32 text-center"
        >
          <IconTelescope className="w-8 h-8 mx-auto mb-6 text-amber-500/50" stroke={1} />
          <p className="font-display text-3xl md:text-5xl text-stone-800 dark:text-stone-100 leading-tight max-w-2xl mx-auto">
            {t.intro}
          </p>
        </motion.div>

        {/* Section: Tu Alojamiento (Check-in Style) */}
        <motion.section 
          id="alojamiento" 
          className="py-12 scroll-mt-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row gap-12 items-start">
            
            {/* Left Column: Title & Image */}
            <div className="w-full md:w-1/3 sticky top-24">
              <h2 className="font-display text-4xl md:text-5xl text-stone-900 dark:text-white mb-6 leading-none">
                {t.accommodation.title}
              </h2>
              <div className="relative aspect-[3/4] w-full rounded-t-[10rem] rounded-b-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop"
                  alt="Interior"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Right Column: Details Table */}
            <div className="w-full md:w-2/3 space-y-8">
              
              {/* Location Card */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm border border-stone-100 dark:border-stone-800"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display text-2xl text-stone-900 dark:text-white">{t.accommodation.location.title}</h3>
                  <IconMapPin className="text-stone-400" stroke={1.5} />
                </div>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed whitespace-pre-line mb-6">
                  {t.accommodation.location.address}
                </p>
                <a 
                  href="https://maps.app.goo.gl/SGmCPNPw346SFM5TA" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 hover:underline"
                >
                  {t.accommodation.location.linkText}
                  <IconMapPin size={14} />
                </a>
              </motion.div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Check-in */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800"
                >
                  <div className="flex items-center gap-3 mb-4 text-stone-400">
                    <IconClock size={20} stroke={1.5} />
                    <span className="text-xs font-bold uppercase tracking-wider">Check-in</span>
                  </div>
                  <p className="font-display text-3xl text-stone-900 dark:text-white mb-1">
                    {t.accommodation.checkin.checkinValue}
                  </p>
                  <p className="text-sm text-stone-500">
                    {t.accommodation.checkin.checkinLabel}
                  </p>
                </motion.div>

                {/* Access */}
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-100 dark:border-stone-800"
                >
                  <div className="flex items-center gap-3 mb-4 text-stone-400">
                    <IconDoorEnter size={20} stroke={1.5} />
                    <span className="text-xs font-bold uppercase tracking-wider">Access</span>
                  </div>
                  <p className="font-display text-xl text-stone-900 dark:text-white mb-1 leading-tight">
                    {t.accommodation.checkin.accessValue}
                  </p>
                </motion.div>

                {/* WiFi */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-stone-900 dark:bg-white p-6 rounded-3xl text-white dark:text-stone-900 md:col-span-2"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3 opacity-80">
                      <IconWifi size={20} stroke={1.5} />
                      <span className="text-xs font-bold uppercase tracking-wider">WiFi</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  </div>
                  <div className="flex flex-col md:flex-row gap-8">
                    <div>
                      <p className="text-xs opacity-50 uppercase tracking-wider mb-1">{t.accommodation.wifi.networkLabel}</p>
                      <p className="font-mono text-2xl tracking-wider">Aqua 308-2</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-50 uppercase tracking-wider mb-1">{t.accommodation.wifi.passwordLabel}</p>
                      <p className="font-mono text-2xl tracking-wider">A951096594.</p>
                    </div>
                  </div>
                </motion.div>

                {/* Parking */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-amber-100 dark:bg-amber-900/30 p-6 rounded-3xl border border-amber-200 dark:border-amber-800/50 md:col-span-2 flex items-center gap-6"
                >
                  <div className="bg-white dark:bg-amber-900/50 p-3 rounded-full text-amber-600 dark:text-amber-400">
                    <IconCar size={24} stroke={1.5} />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-white mb-1">{t.accommodation.parking.title}</h4>
                    <p className="text-stone-600 dark:text-stone-300 text-sm">
                      {t.accommodation.parking.text} <span className="font-bold text-stone-900 dark:text-white text-lg ml-1">{t.accommodation.parking.spot}</span>
                    </p>
                  </div>
                </motion.div>

              </div>
            </div>
          </div>
        </motion.section>

        <div className="w-full h-px bg-stone-200 dark:bg-stone-800 my-12" />

        {/* Section: Amenities */}
        <motion.section 
          id="amenities" 
          className="py-12 scroll-mt-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-12 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2 block">
              Resort Life
            </span>
            <h2 className="font-display text-4xl md:text-5xl text-stone-900 dark:text-white">
              {t.amenities.title}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {t.amenities.items.map((item, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx} 
                className="group flex gap-6 items-start p-4 -mx-4 rounded-2xl hover:bg-white hover:shadow-sm dark:hover:bg-stone-900 transition-all"
              >
                <div className="text-stone-300 group-hover:text-amber-500 transition-colors pt-1">
                  <item.icon size={32} stroke={1} />
                </div>
                <div className="flex-1 border-b border-stone-100 dark:border-stone-800 pb-6 group-hover:border-transparent">
                  <h3 className="font-display text-xl text-stone-900 dark:text-white mb-2">{item.name}</h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm text-stone-500 dark:text-stone-400">
                    <div className="col-span-2 md:col-span-1">
                      <span className="block text-[10px] uppercase tracking-wider opacity-60">{t.amenities.labels.schedule}</span>
                      {item.schedule}
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <span className="block text-[10px] uppercase tracking-wider opacity-60">{t.amenities.labels.cost}</span>
                      {item.cost}
                    </div>
                    {item.rules && (
                      <div className="col-span-2 mt-2 text-amber-600/80 dark:text-amber-400/80 text-xs font-medium bg-amber-50 dark:bg-amber-900/10 px-3 py-1.5 rounded-lg w-fit">
                        {item.rules}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Section: Explora (Horizontal Scroll with Cards) */}
        <motion.section 
          id="explora" 
          className="py-12 scroll-mt-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-end justify-between mb-12 px-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-2 block">
                Discover
              </span>
              <h2 className="font-display text-4xl md:text-5xl text-stone-900 dark:text-white">
                {t.explore.title}
              </h2>
            </div>
            <IconMapPin className="text-stone-300 mb-2 hidden md:block" size={32} stroke={1} />
          </div>
          
          <div className="flex overflow-x-auto gap-6 pb-12 -mx-6 px-6 md:mx-0 md:px-0 snap-x snap-mandatory no-scrollbar">
            {t.explore.items.map((place, idx) => (
              <motion.div 
                whileHover={{ scale: 0.98 }}
                key={idx} 
                className="snap-center shrink-0 w-[85vw] md:w-[22rem] group cursor-pointer"
              >
                <div className="relative h-[28rem] w-full rounded-[2rem] overflow-hidden mb-6 shadow-md group-hover:shadow-xl transition-all duration-500">
                  <Image 
                    src={place.image} 
                    alt={place.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-6 right-6 bg-white/90 dark:bg-black/60 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-stone-900 dark:text-white">
                    {place.tag}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-8 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-display text-3xl mb-2">{place.title}</h3>
                    <p className="text-stone-200 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {place.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12">
          
          {/* Section: Sabores */}
          <motion.section 
            id="sabores" 
            className="scroll-mt-24"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <h2 className="font-display text-3xl text-stone-900 dark:text-white mb-2">{t.flavors.title}</h2>
              <div className="h-1 w-12 bg-amber-400 rounded-full" />
            </div>

            <div className="space-y-8">
              {t.flavors.items.map((rest, idx) => (
                <motion.div 
                  whileHover={{ x: 10 }}
                  key={idx} 
                  className="flex gap-6 items-center group"
                >
                  <div className="relative h-24 w-24 shrink-0 rounded-full overflow-hidden bg-stone-200 shadow-inner">
                    <Image 
                      src={rest.image} 
                      alt={rest.name}
                      fill
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-display text-xl text-stone-900 dark:text-white group-hover:text-amber-600 transition-colors">{rest.name}</h3>
                      <span className="text-xs font-medium text-stone-400 border border-stone-200 dark:border-stone-700 px-2 py-0.5 rounded-full">{rest.price}</span>
                    </div>
                    <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
                      {rest.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Section: Vive */}
          <motion.section 
            id="vive" 
            className="scroll-mt-24"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <h2 className="font-display text-3xl text-stone-900 dark:text-white mb-2">{t.live.title}</h2>
              <div className="h-1 w-12 bg-amber-400 rounded-full" />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {t.live.items.map((item, idx) => (
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  key={idx} 
                  className="relative overflow-hidden rounded-3xl bg-stone-100 dark:bg-stone-900 p-8 group hover:bg-amber-50 dark:hover:bg-amber-900/10 transition-colors"
                >
                  <div className="relative z-10">
                    <div className="mb-4 text-stone-400 group-hover:text-amber-500 transition-colors">
                      <item.icon size={32} stroke={1} />
                    </div>
                    <h3 className="font-display text-2xl text-stone-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 text-stone-200 dark:text-stone-800 opacity-20 group-hover:scale-110 transition-transform duration-500">
                    <item.icon size={120} stroke={0.5} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Section: Datos */}
        <motion.section 
          id="datos" 
          className="py-12 scroll-mt-24 mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-stone-900 dark:bg-white rounded-[3rem] p-8 md:p-12 text-white dark:text-stone-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <IconInfoCircle size={200} />
            </div>
            
            <div className="relative z-10">
              <h2 className="font-display text-3xl md:text-4xl mb-12">{t.info.title}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {t.info.items.map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.2 }}
                    key={idx} 
                    className="flex flex-col gap-4"
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      idx === 0 ? 'bg-blue-500/20 text-blue-300 dark:text-blue-600' :
                      idx === 1 ? 'bg-green-500/20 text-green-300 dark:text-green-600' :
                      'bg-purple-500/20 text-purple-300 dark:text-purple-600'
                    }`}>
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1">{item.title}</h4>
                      <p className="text-sm opacity-70 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.footer 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center py-12 border-t border-stone-200 dark:border-stone-800"
        >
          <p className="font-display text-stone-300 text-2xl mb-2">{t.footer.brand}</p>
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400">{t.footer.message}</p>
        </motion.footer>

      </div>
    </div>
  )
}
