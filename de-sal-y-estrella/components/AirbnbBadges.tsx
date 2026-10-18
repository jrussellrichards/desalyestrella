import { IconAwardFilled, IconStarFilled } from '@tabler/icons-react'

// Rama de laurel propia (no es el logo de Airbnb); la derecha es la misma, reflejada.
function Laurel({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 12 30" fill="currentColor" aria-hidden="true" className={`${className} ${flip ? '-scale-x-100' : ''}`}>
      <path d="M9 28 Q1 15 9 2" fill="none" stroke="currentColor" stroke-width="0.6"/>
      <ellipse cx="7.4" cy="25.0" rx="1.5" ry="3.2" transform="rotate(-72 7.4 25.0)"/>
      <ellipse cx="4.8" cy="21.0" rx="1.5" ry="3.2" transform="rotate(-64 4.8 21.0)"/>
      <ellipse cx="3.2" cy="17.0" rx="1.5" ry="3.2" transform="rotate(-46 3.2 17.0)"/>
      <ellipse cx="3.2" cy="13.0" rx="1.5" ry="3.2" transform="rotate(-24 3.2 13.0)"/>
      <ellipse cx="4.8" cy="9.0" rx="1.5" ry="3.2" transform="rotate(-6 4.8 9.0)"/>
      <ellipse cx="7.4" cy="5.0" rx="1.5" ry="3.2" transform="rotate(2 7.4 5.0)"/>
    </svg>
  )
}

// Insignias de reputación en Airbnb: calificación con laurel ("Favorito de los huéspedes", top 10%)
// y Superanfitrión. tone="light" para fondos oscuros (hero), "dark" para fondos claros.
export default function AirbnbBadges({
  rating,
  reviews,
  href,
  tone = 'dark',
}: {
  rating: string
  reviews: number
  href: string
  tone?: 'light' | 'dark'
}) {
  const text = tone === 'light' ? 'text-white' : 'text-ink'
  const sub = tone === 'light' ? 'text-white/80' : 'text-ink-subtle'
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex flex-wrap items-center gap-x-6 gap-y-3 ${text}`}>
      <span className="flex items-center gap-2">
        <span className="flex items-center">
          <Laurel className="h-10 w-4" />
          <span className="flex items-center gap-1 px-1 font-display text-2xl font-bold leading-none">
            <IconStarFilled className="h-5 w-5 text-gold-400" />
            {rating}
          </span>
          <Laurel className="h-10 w-4" flip />
        </span>
        <span className="text-sm leading-tight">
          <strong className="block font-semibold">Favorito de los huéspedes</strong>
          <span className={`flex items-center gap-1 ${sub}`}>
            Top 10% mejor evaluados · {reviews} reseñas
          </span>
        </span>
      </span>
      <span className="flex items-center gap-2 text-sm leading-tight">
        <IconAwardFilled className="h-8 w-8 text-[#FF385C]" />
        <span>
          <strong className="block font-semibold">Superanfitriones</strong>
          <span className={sub}>Reconocidos por Airbnb</span>
        </span>
      </span>
    </a>
  )
}
