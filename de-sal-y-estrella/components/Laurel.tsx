// Rama de laurel propia (no es el logo de Airbnb); la derecha es la misma, reflejada.
export function Laurel({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 12 30" fill="currentColor" aria-hidden="true" className={`${className} ${flip ? '-scale-x-100' : ''}`}>
      <path d="M9 28 Q1 15 9 2" fill="none" stroke="currentColor" strokeWidth="0.6"/>
      <ellipse cx="7.4" cy="25.0" rx="1.5" ry="3.2" transform="rotate(-72 7.4 25.0)"/>
      <ellipse cx="4.8" cy="21.0" rx="1.5" ry="3.2" transform="rotate(-64 4.8 21.0)"/>
      <ellipse cx="3.2" cy="17.0" rx="1.5" ry="3.2" transform="rotate(-46 3.2 17.0)"/>
      <ellipse cx="3.2" cy="13.0" rx="1.5" ry="3.2" transform="rotate(-24 3.2 13.0)"/>
      <ellipse cx="4.8" cy="9.0" rx="1.5" ry="3.2" transform="rotate(-6 4.8 9.0)"/>
      <ellipse cx="7.4" cy="5.0" rx="1.5" ry="3.2" transform="rotate(2 7.4 5.0)"/>
    </svg>
  )
}

