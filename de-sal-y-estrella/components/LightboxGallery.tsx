'use client'
import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/image'
import { hasAssetRef } from '@/utils/hasAssetRef'
import type { Image as SanityImage } from 'sanity'

type GalleryImage = SanityImage & { alt?: string; _key?: string }

type Props = {
  images: GalleryImage[]
  propertyName: string
  max?: number
}

export default function LightboxGallery({ images, propertyName, max = 5 }: Props) {
  const validImages: (GalleryImage & { asset: { _ref: string } })[] = images.filter(hasAssetRef)
  const shown = validImages.slice(0, max)
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchDelta, setTouchDelta] = useState(0)
  const thumbsRef = useRef<HTMLDivElement | null>(null)
  const isDraggingRef = useRef(false)
  const dragStartXRef = useRef(0)
  const scrollStartRef = useRef(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const openAt = useCallback((i: number) => {
    setIndex(i)
    setOpen(true)
  }, [])

  const close = useCallback(() => setOpen(false), [])
  const prev = useCallback(() => setIndex(i => (i - 1 + validImages.length) % validImages.length), [validImages.length])
  const next = useCallback(() => setIndex(i => (i + 1) % validImages.length), [validImages.length])

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

  // Auto scroll thumbnail activa al cambiar index
  useEffect(() => {
    if (!open) return
    const container = thumbsRef.current
    if (!container) return
    const active = container.querySelector<HTMLButtonElement>('[data-active="true"]')
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [index, open])

  // Handlers drag horizontal en miniaturas
  const onThumbsPointerDown = (e: React.PointerEvent) => {
    const container = thumbsRef.current
    if (!container) return
    isDraggingRef.current = true
    dragStartXRef.current = e.clientX
    scrollStartRef.current = container.scrollLeft
    container.setPointerCapture(e.pointerId)
  }

  const onThumbsPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    const container = thumbsRef.current
    if (!container) return
    const dx = e.clientX - dragStartXRef.current
    container.scrollLeft = scrollStartRef.current - dx
  }

  const endDrag = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    const container = thumbsRef.current
    if (container) container.releasePointerCapture(e.pointerId)
  }

  useEffect(() => {
    if (open) {
      // Mostrar hint breve al abrir en mobile
      setShowHint(true)
      const t = setTimeout(() => setShowHint(false), 3000)
      return () => clearTimeout(t)
    } else {
      setShowHint(false)
    }
  }, [open])

  const updateThumbScrollState = () => {
    const el = thumbsRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 5)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5)
  }

  useEffect(() => {
    updateThumbScrollState()
  }, [open, validImages.length])

  if (!validImages.length) return null

  return (
    <>
      <div className="grid grid-cols-4 gap-2 px-4 pt-6 sm:px-6 lg:px-8">
        {shown.map((img, i) => {
          const builder = urlFor(img)
          if (!builder) return null
          const url = builder
            .width(i === 0 ? 1600 : 800)
            .height(i === 0 ? 900 : 600)
            .quality(80)
            .fit('crop')
            .url()

          return (
            <button
              key={img._key || i}
              onClick={() => openAt(i)}
              className={`
                group relative overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500
                ${i === 0 ? 'col-span-4 md:col-span-2 row-span-2 aspect-[16/9]' : 'aspect-video'}
              `}
              aria-label={`Ver imagen ${i + 1} ampliada`}
            >
              <Image
                src={url}
                alt={img.alt || `${propertyName} – vista ${i + 1}`}
                fill
                sizes={i === 0 ? '(max-width:768px) 100vw, 50vw' : '(max-width:768px) 50vw, 25vw'}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority={i === 0}
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjZWVlIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+"
              />
              {i === 0 && <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/0" />}
              {i === max - 1 && images.length > max && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white backdrop-blur-sm">
                  +{images.length - max} fotos
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <div className="relative mx-auto flex h-full w-full max-w-6xl items-center px-4">
            <div
              className="relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-lg bg-black"
              onTouchStart={(e) => {
                if (e.touches.length === 1) {
                  setTouchStartX(e.touches[0].clientX)
                  setTouchDelta(0)
                }
              }}
              onTouchMove={(e) => {
                if (touchStartX !== null) {
                  setTouchDelta(e.touches[0].clientX - touchStartX)
                }
              }}
              onTouchEnd={() => {
                if (Math.abs(touchDelta) > 50) {
                  if (touchDelta < 0) next()
                  else prev()
                }
                setTouchStartX(null)
                setTouchDelta(0)
              }}
            >
              {validImages.map((img, i) => {
                if (i !== index) return null
                const big = urlFor(img)?.width(1800).height(1200).quality(85).fit('crop').url()
                if (!big) return null
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

              {/* Indicador de posición / total */}
              <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
                {index + 1} / {validImages.length}
              </div>
            </div>

            {/* Botón anterior (mostramos también en mobile) */}
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-2 inline-flex rounded-full bg-black/50 p-3 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <svg width="22" height="22" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            {/* Botón siguiente (mostramos también en mobile) */}
            <button
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-2 inline-flex rounded-full bg-black/50 p-3 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <svg width="22" height="22" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <div className="mx-auto mt-4 flex max-w-5xl items-center gap-2 px-4 pb-6">
            <button
              type="button"
              onClick={() => {
                const el = thumbsRef.current
                if (el) { el.scrollBy({ left: -el.clientWidth * 0.6, behavior: 'smooth' }); updateThumbScrollState() }
              }}
              aria-label="Miniaturas anteriores"
              className={`hidden rounded-md bg-black/40 p-2 text-white transition focus:outline-none focus:ring-2 focus:ring-amber-500 md:inline-flex ${!canScrollLeft ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <div
              ref={thumbsRef}
              className="relative flex flex-1 gap-2 overflow-x-auto scroll-smooth rounded-md py-1 pr-2 pl-2 [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30 touch-pan-x select-none"
              onPointerDown={onThumbsPointerDown}
              onPointerMove={onThumbsPointerMove}
              onPointerUp={endDrag}
              onPointerLeave={endDrag}
              onScroll={updateThumbScrollState}
            >
              {/* Overlays gradiente para sugerir scroll */}
              {canScrollLeft && (
                <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-black/50 to-transparent" />
              )}
              {canScrollRight && (
                <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-black/50 to-transparent" />
              )}
              {validImages.map((img, i) => {
                const thumb = urlFor(img)?.width(160).height(120).fit('crop').quality(60).url()
                if (!thumb) return null
                return (
                  <button
                    key={img._key || i}
                    onClick={() => { setIndex(i); setShowHint(false) }}
                    data-active={i === index || undefined}
                    className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md ring-2 transition ${
                      i === index ? 'ring-amber-500' : 'ring-transparent hover:ring-amber-300'
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
                )}
              )}
              {showHint && (
                <div className="pointer-events-none absolute inset-x-0 bottom-full mb-1 flex justify-center">
                  <span className="animate-fade-in rounded-full bg-black/70 px-3 py-1 text-[10px] font-medium text-white">
                    Desliza para ver más
                  </span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                const el = thumbsRef.current
                if (el) { el.scrollBy({ left: el.clientWidth * 0.6, behavior: 'smooth' }); updateThumbScrollState() }
              }}
              aria-label="Miniaturas siguientes"
              className={`hidden rounded-md bg-black/40 p-2 text-white transition focus:outline-none focus:ring-2 focus:ring-amber-500 md:inline-flex ${!canScrollRight ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
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