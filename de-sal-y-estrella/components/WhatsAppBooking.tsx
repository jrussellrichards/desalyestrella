'use client'

import { useState } from 'react'
import { IconBrandWhatsapp } from '@tabler/icons-react'
import { whatsappLink } from '@/lib/site'
import { trackEvent } from '@/lib/analytics'

function todayPlus(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

// "2026-12-24" -> "24 de diciembre"
function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })
}

// Consulta por WhatsApp con fechas y huéspedes ya escritos, para responder de una vez
// con disponibilidad y precio. Se usa mientras no haya motor de reservas.
export default function WhatsAppBooking({ propertyName, maxGuests = 4 }: { propertyName: string; maxGuests?: number }) {
  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')
  const [guests, setGuests] = useState(2)

  const dates =
    checkin && checkout
      ? `del ${formatDate(checkin)} al ${formatDate(checkout)}`
      : checkin
        ? `desde el ${formatDate(checkin)}`
        : 'en las fechas que te indico'
  const text = `Hola, quisiera reservar ${propertyName.replace(/\s+/g, ' ')} ${dates}, para ${guests} ${guests === 1 ? 'persona' : 'personas'}. ¿Está disponible y cuál sería el precio?`
  const field =
    'mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-sea-500 focus:outline-none focus:ring-2 focus:ring-sea-500/30 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100'

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Llegada
          <input
            type="date"
            min={todayPlus(0)}
            value={checkin}
            onChange={e => {
              setCheckin(e.target.value)
              if (checkout && checkout <= e.target.value) setCheckout('')
            }}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Salida
          <input
            type="date"
            min={checkin || todayPlus(1)}
            value={checkout}
            onChange={e => setCheckout(e.target.value)}
            className={field}
          />
        </label>
        <label className="col-span-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Personas
          <select value={guests} onChange={e => setGuests(Number(e.target.value))} className={field}>
            {Array.from({ length: maxGuests }, (_, i) => i + 1).map(n => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'persona' : 'personas'}
              </option>
            ))}
          </select>
        </label>
      </div>
      <a
        href={whatsappLink(text)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('begin_checkout', { item_name: propertyName, adults: guests })}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sea-500 px-5 py-3.5 text-base font-semibold text-white shadow transition hover:bg-sea-600"
      >
        <IconBrandWhatsapp className="h-5 w-5" />
        Consultar disponibilidad
      </a>
    </div>
  )
}
