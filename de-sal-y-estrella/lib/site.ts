// Datos fijos del negocio, usados en todo el sitio.
// Actualiza las calificaciones aquí (o en Sanity, campo "rating" de cada propiedad) cuando cambien en Airbnb.

export const SITE_URL = 'https://desalyestrella.cl'
export const SITE_NAME = 'De Sal y Estrella'
export const SITE_DESCRIPTION =
  'Departamentos frente al mar en Aqua Resort La Serena y cabaña en Pichilemu. Superanfitriones en Airbnb.'

export const WHATSAPP_NUMBER = '56990736569'
export const INSTAGRAM_URL = 'https://www.instagram.com/de_sal_y_estrella/'
export const AIRBNB_PROFILE_URL = 'https://www.airbnb.cl/users/profile/1469564861055215917'

// Calificaciones reales en Airbnb (octubre 2026)
export const AIRBNB_STATS = {
  totalReviews: 231,
  averageRating: 4.89,
}

type RatingInfo = { rating: number; reviewCount: number }

// Respaldo por nombre de propiedad, si en Sanity no se cargó rating/reviewCount
const RATING_BY_NAME: { match: RegExp; info: RatingInfo }[] = [
  { match: /403/, info: { rating: 4.93, reviewCount: 56 } },
  { match: /308/, info: { rating: 4.86, reviewCount: 59 } },
  { match: /pichilemu/i, info: { rating: 4.88, reviewCount: 116 } },
]

export function getRating(p: { name?: string; location?: string; rating?: number; reviewCount?: number }): RatingInfo | null {
  if (typeof p.rating === 'number' && typeof p.reviewCount === 'number') {
    return { rating: p.rating, reviewCount: p.reviewCount }
  }
  const haystack = `${p.name || ''} ${p.location || ''}`
  return RATING_BY_NAME.find(r => r.match.test(haystack))?.info ?? null
}

// Asistente 24/7 por WhatsApp (recomendaciones, llegada, salida, la zona).
// Si el asistente usa otro número, cámbialo aquí; los QR impresos apuntan a este mismo número.
export const ASSISTANT_WHATSAPP_NUMBER = WHATSAPP_NUMBER

export function whatsappLink(text?: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

export function assistantLink(text?: string) {
  return `https://wa.me/${ASSISTANT_WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}

// Beneficio de la casa para quien reserva en la página (se muestra junto al botón de reservar).
export const DIRECT_BOOKING_PERK = 'Late check-out sin costo, según disponibilidad'

// Ubicación de cada refugio: dirección para el mapa y tiempos aproximados.
type LocationInfo = { mapQuery: string; area: string; nearby: { place: string; time: string }[] }

const LOCATION_BY_NAME: { match: RegExp; info: LocationInfo }[] = [
  {
    match: /403|308|serena/i,
    info: {
      mapQuery: 'Aqua Resort, Avenida Las Higueras 671, La Serena, Chile',
      area: 'Avenida del Mar, La Serena',
      nearby: [
        { place: 'Playa', time: 'cruzando la Avenida del Mar' },
        { place: 'Centro de La Serena', time: '15 min en auto' },
        { place: 'Aeropuerto La Florida', time: '20 min en auto' },
        { place: 'Valle del Elqui (Vicuña)', time: '1 h en auto' },
      ],
    },
  },
  {
    match: /pichilemu/i,
    info: {
      mapQuery: 'José Miguel Camilo 442, Pichilemu, Chile',
      area: 'Pichilemu',
      nearby: [
        { place: 'Playa', time: 'a pasos' },
        { place: 'Punta de Lobos', time: '10 min en auto' },
        { place: 'Cáhuil y sus salinas', time: '25 min en auto' },
      ],
    },
  },
]

export function getLocationInfo(p: { name?: string; location?: string }): LocationInfo | null {
  const haystack = `${p.name || ''} ${p.location || ''}`
  return LOCATION_BY_NAME.find(l => l.match.test(haystack))?.info ?? null
}
