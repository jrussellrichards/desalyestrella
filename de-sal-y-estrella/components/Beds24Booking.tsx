'use client'

import { useState } from 'react'
import { trackEvent } from '@/lib/analytics'

// Motor de reservas de Beds24. Abre la página de reserva en una pestaña nueva
// (Beds24 lo recomienda sobre el iframe) con fechas y huéspedes ya elegidos.
// Usa el ID de habitación si existe; si no, el de la propiedad.
export function beds24Url({
  propId,
  roomId,
  checkin,
  nights,
  adults,
}: {
  propId?: number
  roomId?: number
  checkin?: string
  nights?: number
  adults?: number
}) {
  const params = new URLSearchParams()
  if (roomId) params.set('roomid', String(roomId))
  else if (propId) params.set('propid', String(propId))
  if (checkin) params.set('checkin', checkin)
  if (nights) params.set('numnight', String(nights))
  if (adults) params.set('numadult', String(adults))
  params.set('referer', 'desalyestrella.cl')
  return `https://beds24.com/booking2.php?${params.toString()}`
}

function todayPlus(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export default function Beds24Booking({
  propId,
  roomId,
  maxGuests = 4,
  propertyName,
}: {
  propId?: number
  roomId?: number
  maxGuests?: number
  propertyName: string
}) {
  const [checkin, setCheckin] = useState('')
  const [nights, setNights] = useState(2)
  const [adults, setAdults] = useState(2)

  const href = beds24Url({ propId, roomId, checkin: checkin || undefined, nights, adults })
  const field = 'mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/30 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100'

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Llegada
          <input type="date" min={todayPlus(0)} value={checkin} onChange={e => setCheckin(e.target.value)} className={field} />
        </label>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Noches
          <select value={nights} onChange={e => setNights(Number(e.target.value))} className={field}>
            {Array.from({ length: 14 }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'noche' : 'noches'}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Huéspedes
          <select value={adults} onChange={e => setAdults(Number(e.target.value))} className={field}>
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'huésped' : 'huéspedes'}</option>
            ))}
          </select>
        </label>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('begin_checkout', { item_name: propertyName, nights, adults })}
        className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-navy-900 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-navy-800"
      >
        Ver precio y reservar
      </a>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Pago seguro en nuestro sistema de reservas (Beds24). Verás la disponibilidad y el precio final antes de pagar.
      </p>
    </div>
  )
}
