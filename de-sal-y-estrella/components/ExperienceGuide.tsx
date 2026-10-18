import Image from 'next/image'
import Link from 'next/link'
import { IconMapPin, IconBrandInstagram } from '@tabler/icons-react'
import type { Destination } from '@/lib/experiences'
import { whatsappLink } from '@/lib/site'

export default function ExperienceGuide({ destination }: { destination: Destination }) {
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="relative h-[42vh] min-h-[280px] w-full overflow-hidden">
        <Image src={destination.image} alt={destination.name} fill priority sizes="100vw" className="object-cover object-[50%_75%]" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl px-4 pb-10 sm:px-6 lg:px-8">
          <h1 className="font-display text-h2 font-semibold text-white">{destination.guideTitle}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <p className="max-w-3xl text-copy-lg text-ink-subtle dark:text-ink-dark-subtle">{destination.intro}</p>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          {destination.experiences.map(exp => (
            <li key={exp.title} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <h2 className="font-display text-lg font-semibold text-ink dark:text-white">{exp.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-subtle dark:text-ink-dark-subtle">{exp.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium">
                <a href={exp.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gold-700 hover:text-navy-900 dark:text-gold-400">
                  <IconMapPin className="h-4 w-4" /> Ver en el mapa
                </a>
                {exp.instagramUrl && (
                  <a href={exp.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gold-700 hover:text-navy-900 dark:text-gold-400">
                    <IconBrandInstagram className="h-4 w-4" /> Instagram
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col items-start gap-4 rounded-2xl bg-navy-900 p-8 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-xl font-semibold">¿Dónde quedarte en {destination.name.split(' y ')[0]}?</p>
            <p className="mt-1 text-sm text-white/80">Reserva directo con nosotros y ahórrate la comisión de las plataformas.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={`/refugios?l=${encodeURIComponent(destination.refugiosParam)}`} className="rounded-md bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 hover:bg-gold-400">
              Ver refugios
            </Link>
            <a href={whatsappLink(`Hola, quisiera consultar fechas en ${destination.refugiosParam}`)} target="_blank" rel="noopener noreferrer" className="rounded-md border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10">
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
