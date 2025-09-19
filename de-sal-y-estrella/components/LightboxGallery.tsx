'use client'
import { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import { urlFor } from '@/lib/image'
import type { Image as SanityImage } from 'sanity'

interface Props {
  images: SanityImage[]
  propertyName: string
  max?: number // cuántas mostrar en el grid antes del modal
}

export default function LightboxGallery({ images, propertyName, max = 5 }: Props) {
  const shown = images.slice(0, max)
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const openAt = useCallback((i: number) => {
    setIndex(i)
    setOpen(true)
  }, [])

  const close = useCallback(() => setOpen(false), [])
  const prev = useCallback(() => setIndex(i => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex(i => (i + 1) % images.length), [images.length])

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

  if (!images.length) return null

  return (
    <>
      <div className="grid grid-cols-4 gap-2 px-4 pt-6 sm:px-6 lg:px-8">
        {shown.map((img, i) => {
          const builder = urlFor(img)
          if (!builder) return null
            // tamaños distintos para el primero
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
                alt={(img as any).alt || `${propertyName} – vista ${i + 1}`}
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
            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-2 hidden rounded-full bg-black/50 p-3 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-amber-500 md:inline-flex"
            >
              <svg width="22" height="22" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>

            <div className="relative mx-auto aspect-[16/10] w-full overflow-hidden rounded-lg bg-black">
              {images.map((img, i) => {
                if (i !== index) return null
                const big = urlFor(img)?.width(1800).height(1200).quality(85).fit('crop').url()
                if (!big) return null
                return (
                  <Image
                    key={img._key || i}
                    src={big}
                    alt={(img as any).alt || `${propertyName} – imagen ${i + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                )
              })}
            </div>

            <button
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-2 hidden rounded-full bg-black/50 p-3 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-amber-500 md:inline-flex"
            >
              <svg width="22" height="22" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <div className="mx-auto mt-4 flex max-w-5xl gap-2 overflow-x-auto px-4 pb-6">
            {images.map((img, i) => {
              const thumb = urlFor(img)?.width(160).height(120).fit('crop').quality(60).url()
              if (!thumb) return null
              return (
                <button
                  key={img._key || i}
                  onClick={() => setIndex(i)}
                  className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md ring-2 transition ${
                    i === index ? 'ring-amber-500' : 'ring-transparent hover:ring-amber-300'
                  }`}
                  aria-label={`Ir a imagen ${i + 1}`}
                >
                  <Image
                    src={thumb}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </button>
              )
            })}
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