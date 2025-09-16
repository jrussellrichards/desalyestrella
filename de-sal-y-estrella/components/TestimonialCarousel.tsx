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

  const goTo = useCallback((i: number) => {
    if (!trackRef.current) return
    const clamped = (i + count) % count
    const child = trackRef.current.children[clamped] as HTMLElement | undefined
    if (child) {
      // Desplazamiento horizontal manual para evitar scroll vertical del documento
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
              className="group relative w-[280px] flex-shrink-0 snap-center rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-700 dark:bg-gray-900 sm:w-[340px]"
            >
              <blockquote className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-xs font-medium text-gray-900 dark:text-gray-200">
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
