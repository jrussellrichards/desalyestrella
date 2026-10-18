'use client'

import { useState } from 'react'
import { IconBrandWhatsapp, IconMinus, IconPlus } from '@tabler/icons-react'
import DateRangePicker from '@/components/DateRangePicker'
import { whatsappLink } from '@/lib/site'
import { trackEvent } from '@/lib/analytics'

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
  const step = 'flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-ink transition hover:border-ink disabled:opacity-30 dark:border-gray-600 dark:text-white'

  return (
    <div>
      <DateRangePicker
        checkin={checkin}
        checkout={checkout}
        onChange={(a, b) => {
          setCheckin(a)
          setCheckout(b)
        }}
      />
      <div className="mt-3 flex items-center justify-between rounded-xl border border-gray-300 px-3 py-2.5 dark:border-gray-600">
        <span>
          <span className="block text-[10px] font-bold uppercase tracking-wider text-ink dark:text-white">Personas</span>
          <span className="block text-sm text-ink dark:text-white">
            {guests} {guests === 1 ? 'persona' : 'personas'}
          </span>
        </span>
        <span className="flex items-center gap-3">
          <button type="button" className={step} onClick={() => setGuests(g => g - 1)} disabled={guests <= 1} aria-label="Una persona menos">
            <IconMinus className="h-4 w-4" />
          </button>
          <button type="button" className={step} onClick={() => setGuests(g => g + 1)} disabled={guests >= maxGuests} aria-label="Una persona más">
            <IconPlus className="h-4 w-4" />
          </button>
        </span>
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
