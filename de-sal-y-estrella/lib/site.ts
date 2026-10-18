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

export function whatsappLink(text?: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ''}`
}
