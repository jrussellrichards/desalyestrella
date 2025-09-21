'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/image'
import { hasAssetRef } from '@/utils/hasAssetRef'
import type { Image as SanityImage } from 'sanity'

type GalleryImage = SanityImage & { alt?: string; _key?: string }
interface Props {
  images: GalleryImage[]
  propertyName: string
  max?: number
}

export default function LightboxGallery({ images, propertyName, max = 5 }: Props) {
  const validImages: (GalleryImage & { asset: { _ref: string } })[] = images.filter(hasAssetRef)
  const shown = validImages.slice(0, max)

  // Hooks SIEMPRE (no condicionales)
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchDelta, setTouchDelta] = useState(0)
  const thumbsRef = useRef<HTMLDivElement | null>(null)

  const openAt = useCallback((i: number) => {
    setIndex(i)
    setOpen(true)
  }, [])

  const close = useCallback(() => setOpen(false), [])
  const prev = useCallback(
    () => setIndex(i => (i - 1 + validImages.length) % validImages.length),
    [validImages.length]
  )
  const next = useCallback(
    () => setIndex(i => (i + 1) % validImages.length),
    [validImages.length]
  )

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close, next, prev])

  useEffect(() => {
    if (!open) return
    const c = thumbsRef.current
    if (!c) return
    const active = c.querySelector<HTMLButtonElement>('[data-active="true"]')
    if (active) {
      const offset = active.offsetLeft - (c.clientWidth - active.clientWidth) / 2
      c.scrollTo({ left: offset, behavior: 'smooth' })
    }
  }, [index, open])

  if (!validImages.length) return null

  return (
    <>
      {/* GRID PREVIEW */}
      <div className="grid grid-cols-4 gap-2 px-4 pt-6 sm:px-6 lg:px-8">
        {shown.map((img, i) => {
          const url = urlFor(img)
            .width(i === 0 ? 1600 : 800)
            .height(i === 0 ? 900 : 600)
            .quality(80)
            .fit('crop')
            .url()
          const isHero = i === 0
          return (
            <button
              key={img._key || i}
              onClick={() => openAt(i)}
              className={`group relative overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                isHero
                  ? 'col-span-4 row-span-2 aspect-[16/9] md:col-span-2'
                  : 'aspect-video'
              }`}
              aria-label={`Ver imagen ${i + 1} ampliada`}
            >
              <Image
                src={url}
                alt={img.alt || `${propertyName} – vista ${i + 1}`}
                fill
                sizes={
                  isHero
                    ? '(max-width:768px) 100vw, 50vw'
                    : '(max-width:768px) 50vw, 25vw'
                }
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={i === 0}
              />
              {i === max - 1 && validImages.length > max && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white backdrop-blur-sm">
                  +{validImages.length - max} fotos
                </span>
              )}
            </button>
          )
        })}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[90] flex flex-col bg-black/90 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={close}
            aria-label="Cerrar"
            className="absolute right-4 top-4 rounded-md bg-black/60 p-2 text-white hover:bg-black/80 focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <svg width="20" height="20" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="relative mx-auto mt-12 aspect-[16/10] w-full max-w-6xl overflow-hidden rounded-lg bg-black px-4 md:mt-16"
            onTouchStart={e => {
              if (e.touches.length === 1) {
                setTouchStartX(e.touches[0].clientX)
                setTouchDelta(0)
              }
            }}
            onTouchMove={e => {
              if (touchStartX !== null) {
                setTouchDelta(e.touches[0].clientX - touchStartX)
              }
            }}
            onTouchEnd={() => {
              if (Math.abs(touchDelta) > 50) {
                if (touchDelta < 0) {
                  next()
                } else {
                  prev()
                }
              }
              setTouchStartX(null)
              setTouchDelta(0)
            }}
          >
            {validImages.map((img, i) => {
              if (i !== index) return null
              const big = urlFor(img)
                .width(1800)
                .height(1200)
                .quality(85)
                .fit('crop')
                .url()
              return (
                <Image
                  key={img._key || i}
                  src={big}
                  alt={img.alt || `${propertyName} – imagen ${i + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain transition-transform duration-300"
                  style={{
                    transform:
                      touchStartX !== null
                        ? `translateX(${touchDelta}px)`
                        : 'translateX(0)'
                  }}
                  priority
                />
              )
            })}

            <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
              {index + 1} / {validImages.length}
            </div>

            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <svg width="22" height="22" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <svg width="22" height="22" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="mx-auto mt-4 w-full max-w-5xl px-4 pb-6">
            <div
              ref={thumbsRef}
              className="flex gap-2 overflow-x-auto overflow-y-hidden py-1 pr-1 scroll-px-4 scroll-smooth"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {validImages.map((img, i) => {
                const thumb = urlFor(img).width(160).height(120).fit('crop').quality(60).url()
                return (
                  <button
                    key={img._key || i}
                    onClick={() => setIndex(i)}
                    data-active={i === index || undefined}
                    className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md ring-2 transition ${
                      i === index
                        ? 'ring-amber-500'
                        : 'ring-transparent hover:ring-amber-300'
                    }`}
                    aria-label={`Ir a imagen ${i + 1}`}
                  >
                    <Image
                      src={thumb}
                      alt={img.alt || ''}
                      fill
                      sizes="96px"
                      className="object-cover"
                      draggable={false}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          <div
            onClick={close}
            className="absolute inset-0 -z-10 cursor-zoom-out"
            aria-hidden="true"
          />
        </div>
      )}
    </>
  )
}