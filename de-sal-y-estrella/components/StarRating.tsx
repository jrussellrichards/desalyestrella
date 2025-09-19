interface StarRatingProps {
  rating: number // 0–5 (puede ser decimal)
  max?: number
  sizeClass?: string
}

// Este componente toma una calificación y renderiza las estrellas correspondientes.
export default function StarRating({ rating, max = 5, sizeClass = 'h-5 w-5' }: StarRatingProps) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5
  return (
    <div className="flex items-center" aria-label={`${rating} de ${max} estrellas`}>
      {Array.from({ length: max }).map((_, i) => {
        const starIndex = i + 1
        const isFull = starIndex <= full
        const isHalf = !isFull && hasHalf && starIndex === full + 1
        return (
            <span key={starIndex} className="relative inline-block">
              {/* Fondo (estrella vacía) */}
              <svg
                className={`${sizeClass} text-gray-300 dark:text-gray-600`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 
                1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 
                1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 
                3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 
                1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 
                1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 
                1 0 0 0 .951-.69l1.07-3.292Z" />
              </svg>

              {/* Relleno (entera o media) */}
              {(isFull || isHalf) && (
                <svg
                  className={`${sizeClass} absolute inset-0 text-amber-400`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  style={isHalf ? { clipPath: 'inset(0 50% 0 0)' } : undefined}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 
                  1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 
                  1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 
                  3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 
                  1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 
                  1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 
                  1 0 0 0 .951-.69l1.07-3.292Z" />
                </svg>
              )}
            </span>
        )
      })}
      <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">
        {rating.toFixed(1)}
      </span>
    </div>
  )
}

