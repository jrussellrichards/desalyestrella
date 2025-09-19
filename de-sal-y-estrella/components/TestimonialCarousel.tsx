"use client"
import { useRef, useState, useEffect, useCallback } from 'react'
import type { Testimonial } from '@/types'

interface Props {
  testimonials: Testimonial[]
  autoAdvanceMs?: number
}

// Carrusel accesible con scroll snap horizontal y fallback simple.
export default function TestimonialCarousel({ testimonials, autoAdvanceMs = 6000 }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [index, setIndex] = useState(0)
  const count = testimonials.length

  const normalizeHeights = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const children = Array.from(el.children) as HTMLElement[]
    // reset to natural height first
    children.forEach(c => (c.style.height = 'auto'))
    const max = Math.max(...children.map(c => c.offsetHeight))
    children.forEach(c => (c.style.height = max + 'px'))
  }, [])

  const goTo = useCallback((i: number) => {
    if (!trackRef.current) return
    const clamped = (i + count) % count
    const child = trackRef.current.children[clamped] as HTMLElement | undefined
    if (child) {
      const container = trackRef.current
      const targetLeft = child.offsetLeft - (container.clientWidth - child.clientWidth) / 2
      container.scrollTo({ left: targetLeft, behavior: 'smooth' })
      setIndex(clamped)
    }
  }, [count])

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    if (count <= 1) return
    const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const id = setInterval(next, autoAdvanceMs)
    return () => clearInterval(id)
  }, [next, autoAdvanceMs, count])

  // Sync index on manual scroll (aproximado)
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const handler = () => {
      const children = Array.from(el.children) as HTMLElement[]
      const center = el.scrollLeft + el.clientWidth / 2
      let closest = 0
      let closestDist = Infinity
      children.forEach((c, i) => {
        const dist = Math.abs(c.offsetLeft + c.clientWidth / 2 - center)
        if (dist < closestDist) {
          closestDist = dist
          closest = i
        }
      })
      setIndex(closest)
    }
    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    normalizeHeights()
    const r = () => normalizeHeights()
    window.addEventListener('resize', r)
    // re-run after fonts/layout settle
    const id = requestAnimationFrame(() => normalizeHeights())
    return () => {
      window.removeEventListener('resize', r)
      cancelAnimationFrame(id)
    }
  }, [normalizeHeights, testimonials])

  if (!count) return null

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
          aria-label="Testimonios de huéspedes"
        >
          {testimonials.map((t) => (
            <figure
              key={t._id}
              className="group relative w-[280px] flex-shrink-0 snap-center rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900 sm:w-[340px] flex flex-col"
            >
              <blockquote className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 flex-1">
                “{t.quote}”
              </blockquote>
              {/* Rating de estrellas */}
              {typeof t.rating === 'number' && (
                <div className="mt-4 flex items-center" aria-label={`${t.rating} de 5 estrellas`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(t.rating!) ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600'}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.291c.3.922-.755 1.688-1.539 1.118l-2.8-2.033a1 1 0 00-1.175 0l-2.8 2.033c-.783.57-1.838-.196-1.539-1.118l1.07-3.291a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-xs font-medium text-gray-500 dark:text-gray-400">{t.rating!.toFixed(1)}</span>
                </div>
              )}
              <figcaption className="mt-3 text-xs font-medium text-gray-900 dark:text-gray-200">
                {t.author}
                {t.location && (
                  <span className="ml-1 text-gray-500 dark:text-gray-400">· {t.location}</span>
                )}
              </figcaption>
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent group-hover:ring-amber-500/40" />
            </figure>
          ))}
        </div>
      </div>

      {/* Controles */}
      {count > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              className="rounded-full border border-gray-200 bg-white p-2 text-gray-700 transition hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Siguiente"
              className="rounded-full border border-gray-200 bg-white p-2 text-gray-700 transition hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </div>
          <div className="flex items-center gap-1">
            {testimonials.map((t, i) => (
              <button
                key={t._id}
                aria-label={`Ir al testimonio ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === index ? 'bg-amber-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
