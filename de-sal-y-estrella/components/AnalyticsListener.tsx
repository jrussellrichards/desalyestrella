'use client'

import { useEffect } from 'react'
import { trackEvent } from '@/lib/analytics'

// Registra en Google Analytics los clics que importan para medir reservas directas:
// WhatsApp, motor de reservas, Airbnb e Instagram. Elementos con data-track usan ese nombre.
export default function AnalyticsListener() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest('a, button') as HTMLElement | null
      if (!el) return
      const href = el.getAttribute('href') || ''
      const page = window.location.pathname
      const custom = el.dataset.track
      if (custom) return trackEvent(custom, { page, label: el.textContent?.trim().slice(0, 80) })
      if (href.includes('wa.me')) return trackEvent('click_whatsapp', { page })
      if (href.includes('holidayfuture.com') || href.includes('beds24.com')) return trackEvent('click_reservar', { page })
      if (href.includes('airbnb.')) return trackEvent('click_airbnb', { page })
      if (href.includes('instagram.com')) return trackEvent('click_instagram', { page })
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])
  return null
}
