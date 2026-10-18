'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

// Calendario de llegada y salida al estilo de las apps de arriendo: un mes en el celular,
// dos en pantallas grandes, rango marcado al pasar el dedo o el mouse.
// `blocked` recibe fechas ocupadas (YYYY-MM-DD) para cuando se conecte la disponibilidad.

const WEEKDAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

export function toISO(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function fromISO(iso: string) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}

function monthDays(month: Date) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const offset = (first.getDay() + 6) % 7 // semana parte el lunes
  const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells: (string | null)[] = Array(offset).fill(null)
  for (let i = 1; i <= total; i++) cells.push(toISO(new Date(month.getFullYear(), month.getMonth(), i)))
  return cells
}

function Month({
  month,
  checkin,
  checkout,
  hover,
  today,
  blocked,
  onPick,
  onHover,
}: {
  month: Date
  checkin: string
  checkout: string
  hover: string
  today: string
  blocked: Set<string>
  onPick: (iso: string) => void
  onHover: (iso: string) => void
}) {
  const end = checkout || (checkin && hover > checkin ? hover : '')
  const label = `${month.toLocaleDateString('es-CL', { month: 'long' })} ${month.getFullYear()}`
  return (
    <div className="w-full">
      <p className="mb-3 text-center text-sm font-semibold capitalize text-ink dark:text-white">{label}</p>
      <div className="grid grid-cols-7 text-center text-[11px] font-medium text-ink-faint dark:text-ink-dark-faint">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="pb-2">{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {monthDays(month).map((iso, i) => {
          if (!iso) return <span key={i} />
          const disabled = iso < today || blocked.has(iso)
          const isStart = iso === checkin
          const isEnd = iso === end
          const inRange = checkin && end && iso > checkin && iso < end
          return (
            <div
              key={iso}
              className={`relative flex h-10 items-center justify-center ${
                inRange ? 'bg-sea-50 dark:bg-sea-500/15' : ''
              } ${isStart && end ? 'rounded-l-full bg-sea-50 dark:bg-sea-500/15' : ''} ${
                isEnd && checkin ? 'rounded-r-full bg-sea-50 dark:bg-sea-500/15' : ''
              }`}
            >
              <button
                type="button"
                disabled={disabled}
                onClick={() => onPick(iso)}
                onMouseEnter={() => onHover(iso)}
                className={`h-10 w-10 rounded-full text-sm transition-all duration-150 ${
                  isStart || isEnd
                    ? 'scale-105 bg-sea-500 font-semibold text-white shadow-md'
                    : disabled
                      ? `cursor-not-allowed text-gray-300 dark:text-gray-600 ${blocked.has(iso) ? 'line-through' : ''}`
                      : 'text-ink hover:ring-2 hover:ring-sea-400 dark:text-white'
                }`}
                aria-label={fromISO(iso).toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
                aria-pressed={isStart || isEnd}
              >
                {Number(iso.slice(8))}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function DateRangePicker({
  checkin,
  checkout,
  onChange,
  blocked = [],
}: {
  checkin: string
  checkout: string
  onChange: (checkin: string, checkout: string) => void
  blocked?: string[]
}) {
  const today = toISO(new Date())
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(() => (checkin ? fromISO(checkin) : new Date()))
  const [hover, setHover] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const blockedSet = useMemo(() => new Set(blocked), [blocked])
  const firstMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const canGoBack = addMonths(month, 0) > firstMonth

  // Cierra al tocar fuera o con Escape
  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function pick(iso: string) {
    if (!checkin || checkout || iso <= checkin) {
      onChange(iso, '')
      return
    }
    // No permitir un rango que cruce una fecha ocupada
    for (let d = fromISO(checkin); toISO(d) < iso; d.setDate(d.getDate() + 1)) {
      if (blockedSet.has(toISO(d))) {
        onChange(iso, '')
        return
      }
    }
    onChange(checkin, iso)
    setTimeout(() => setOpen(false), 250)
  }

  const fmt = (iso: string) =>
    iso ? fromISO(iso).toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) : 'Agregar fecha'
  const nights = checkin && checkout ? Math.round((+fromISO(checkout) - +fromISO(checkin)) / 86400000) : 0

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="grid w-full grid-cols-2 overflow-hidden rounded-xl border border-gray-300 text-left transition hover:border-sea-400 dark:border-gray-600"
        aria-expanded={open}
      >
        <span className="border-r border-gray-300 px-3 py-2.5 dark:border-gray-600">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-ink dark:text-white">Llegada</span>
          <span className={`block text-sm ${checkin ? 'text-ink dark:text-white' : 'text-ink-faint dark:text-ink-dark-faint'}`}>{fmt(checkin)}</span>
        </span>
        <span className="px-3 py-2.5">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-ink dark:text-white">Salida</span>
          <span className={`block text-sm ${checkout ? 'text-ink dark:text-white' : 'text-ink-faint dark:text-ink-dark-faint'}`}>{fmt(checkout)}</span>
        </span>
      </button>

      <div
        className={`absolute left-1/2 z-30 mt-2 w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 origin-top rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl transition-all duration-200 ease-out dark:border-gray-700 dark:bg-gray-900 lg:w-[40rem] lg:left-auto lg:right-0 lg:translate-x-0 ${
          open ? 'visible scale-100 opacity-100' : 'invisible scale-95 opacity-0'
        }`}
        onMouseLeave={() => setHover('')}
      >
        <div className="mb-2 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setMonth(m => addMonths(m, -1))}
            disabled={!canGoBack}
            className="rounded-full p-2 text-ink transition hover:bg-sea-50 disabled:opacity-30 dark:text-white dark:hover:bg-white/10"
            aria-label="Mes anterior"
          >
            <IconChevronLeft className="h-4 w-4" />
          </button>
          <p className="text-xs text-ink-subtle dark:text-ink-dark-subtle">
            {nights > 0 ? `${nights} ${nights === 1 ? 'noche' : 'noches'}` : checkin ? 'Elige la salida' : 'Elige la llegada'}
          </p>
          <button
            type="button"
            onClick={() => setMonth(m => addMonths(m, 1))}
            className="rounded-full p-2 text-ink transition hover:bg-sea-50 dark:text-white dark:hover:bg-white/10"
            aria-label="Mes siguiente"
          >
            <IconChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div key={toISO(month)} className="grid animate-[fadeIn_200ms_ease-out] gap-6 lg:grid-cols-2">
          {[0, 1].map(n => (
            <div key={n} className={n === 1 ? 'hidden lg:block' : ''}>
              <Month
                month={addMonths(month, n)}
                checkin={checkin}
                checkout={checkout}
                hover={hover}
                today={today}
                blocked={blockedSet}
                onPick={pick}
                onHover={setHover}
              />
            </div>
          ))}
        </div>
        {(checkin || checkout) && (
          <div className="mt-3 flex justify-between">
            <button type="button" onClick={() => onChange('', '')} className="text-sm font-medium text-ink underline underline-offset-2 dark:text-white">
              Borrar fechas
            </button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg bg-navy-900 px-4 py-1.5 text-sm font-semibold text-white dark:bg-white dark:text-navy-900">
              Listo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
