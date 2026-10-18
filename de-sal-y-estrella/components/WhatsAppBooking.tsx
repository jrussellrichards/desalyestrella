'use client'

import { useState } from 'react'
import { IconBrandWhatsapp, IconMinus, IconPlus } from '@tabler/icons-react'
import DateRangePicker from '@/components/DateRangePicker'
import { whatsappLink } from '@/lib/site'
import { trackEvent } from '@/lib/analytics'
import { formatCLP } from '@/utils/pricing'
import type { NightlyRates } from '@/lib/beds24'

// "2026-12-24" -> "24 de diciembre"
function formatDate(iso: string) {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })
}

// Consulta por WhatsApp con fechas y huéspedes ya escritos, para responder de una vez
// con disponibilidad y precio. Con Beds24 conectado, las noches ocupadas salen tachadas
// y al elegir fechas se muestra el total, así el mensaje ya es una reserva.
export default function WhatsAppBooking({
  propertyName,
  maxGuests = 4,
  blocked,
  rates,
}: {
  propertyName: string
  maxGuests?: number
  // Noches ocupadas según Beds24 (YYYY-MM-DD)
  blocked?: string[]
  // Precio y estadía mínima por fecha según Beds24
  rates?: NightlyRates | null
}) {
  const [checkin, setCheckin] = useState('')
  const [checkout, setCheckout] = useState('')
  const [guests, setGuests] = useState(2)

  const dates =
    checkin && checkout
      ? `del ${formatDate(checkin)} al ${formatDate(checkout)}`
      : checkin
        ? `desde el ${formatDate(checkin)}`
        : 'en las fechas que te indico'
  const people = `${guests} ${guests === 1 ? 'persona' : 'personas'}`
  const name = propertyName.replace(/\s+/g, ' ')

  // Noches del rango elegido con su precio; sin precio para alguna, no se muestra total
  const nights: string[] = []
  if (checkin && checkout) {
    for (let d = new Date(`${checkin}T12:00:00Z`); d.toISOString().slice(0, 10) < checkout; d.setUTCDate(d.getUTCDate() + 1)) {
      nights.push(d.toISOString().slice(0, 10))
    }
  }
  const priced = rates && nights.length > 0 && nights.every(n => rates.prices[n])
  const nightsTotal = priced ? nights.reduce((sum, n) => sum + rates.prices[n], 0) : 0
  const cleaning = priced ? rates.cleaningFee : 0
  const total = nightsTotal + cleaning
  const sameRate = priced && nights.every(n => rates.prices[n] === rates.prices[nights[0]])
  const minStay = (checkin && rates?.minStay[checkin]) || 1
  const tooShort = nights.length > 0 && nights.length < minStay
  const ready = priced && !tooShort

  const text = ready
    ? `Hola, quiero reservar ${name} ${dates} (${nights.length} ${nights.length === 1 ? 'noche' : 'noches'}), para ${people}. Total en la web: ${formatCLP(total)}.`
    : `Hola, quisiera reservar ${name} ${dates}, para ${people}. ¿Está disponible y cuál sería el precio?`
  const step = 'flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-ink transition hover:border-ink disabled:opacity-30 dark:border-gray-600 dark:text-white'

  return (
    <div>
      <DateRangePicker
        checkin={checkin}
        checkout={checkout}
        blocked={blocked}
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
      {ready && (
        <dl className="mt-4 space-y-1.5 text-sm text-ink dark:text-white">
          <div className="flex justify-between">
            <dt className="text-ink-subtle dark:text-ink-dark-subtle">
              {sameRate ? `${formatCLP(rates.prices[nights[0]])} × ` : ''}
              {nights.length} {nights.length === 1 ? 'noche' : 'noches'}
            </dt>
            <dd>{formatCLP(nightsTotal)}</dd>
          </div>
          {cleaning > 0 && (
            <div className="flex justify-between">
              <dt className="text-ink-subtle dark:text-ink-dark-subtle">Aseo</dt>
              <dd>{formatCLP(cleaning)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-semibold dark:border-gray-700">
            <dt>Total</dt>
            <dd>{formatCLP(total)}</dd>
          </div>
        </dl>
      )}
      {tooShort && (
        <p className="mt-4 text-sm text-ink-subtle dark:text-ink-dark-subtle">
          Para esas fechas la estadía mínima es de {minStay} noches.
        </p>
      )}
      <a
        href={whatsappLink(text)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent('begin_checkout', { item_name: propertyName, adults: guests, ...(ready ? { value: total, currency: 'CLP' } : {}) })}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sea-500 px-5 py-3.5 text-base font-semibold text-white shadow transition hover:bg-sea-600"
      >
        <IconBrandWhatsapp className="h-5 w-5" />
        {ready ? 'Reservar por WhatsApp' : rates ? 'Escríbenos por WhatsApp' : 'Consultar disponibilidad'}
      </a>
    </div>
  )
}
