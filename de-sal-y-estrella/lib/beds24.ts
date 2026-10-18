// Lectura de disponibilidad y precios desde la API v2 de Beds24 (solo en el servidor).
// La llave va en la variable de entorno BEDS24_REFRESH_TOKEN; si falta o la API falla,
// todo devuelve vacío y la ficha sigue funcionando sin fechas ocupadas.

const API = 'https://api.beds24.com/v2'
const DAYS_AHEAD = 365

type Ids = { propId?: number; roomId?: number }

async function getToken(): Promise<string | null> {
  // Tolera comillas o espacios pegados por error al copiar la llave
  const refreshToken = process.env.BEDS24_REFRESH_TOKEN?.trim().replace(/^"|"$/g, '')
  if (!refreshToken) return null
  // El token dura poco (expiresIn); se reutiliza media hora desde la caché de datos de Next
  const res = await fetch(`${API}/authentication/token`, {
    headers: { refreshToken },
    next: { revalidate: 1800, tags: ['beds24-token'] },
  })
  if (!res.ok) throw new Error(`Beds24 token: HTTP ${res.status}`)
  const json = await res.json()
  if (!json.token) throw new Error('Beds24 token: respuesta sin token')
  return json.token as string
}

async function beds24Get<T>(path: string, params: Record<string, string | number | boolean | undefined>, revalidate = 600) {
  const token = await getToken()
  if (!token) return null
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) if (v !== undefined) qs.set(k, String(v))
  const res = await fetch(`${API}${path}?${qs}`, { headers: { token }, next: { revalidate } })
  if (!res.ok) throw new Error(`Beds24 ${path}: HTTP ${res.status}`)
  const json = await res.json()
  if (json.success === false) throw new Error(`Beds24 ${path}: ${json.error || 'error'}`)
  return json.data as T
}

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10)
}

function range() {
  const start = new Date()
  const end = new Date()
  end.setDate(end.getDate() + DAYS_AHEAD)
  return { startDate: isoDate(start), endDate: isoDate(end) }
}

function target({ propId, roomId }: Ids) {
  return roomId ? { roomId } : { propertyId: propId }
}

// Noches ocupadas (YYYY-MM-DD): las que ninguna habitación de la propiedad tiene libre
export async function getBlockedDates(ids: Ids): Promise<string[]> {
  if (!ids.propId && !ids.roomId) return []
  try {
    const rooms = await beds24Get<{ availability?: Record<string, boolean> }[]>('/inventory/rooms/availability', {
      ...target(ids),
      ...range(),
    })
    if (!rooms?.length) return []
    const dates = new Set<string>()
    for (const r of rooms) for (const d of Object.keys(r.availability || {})) dates.add(d)
    return [...dates].filter(d => rooms.every(r => r.availability?.[d] === false)).sort()
  } catch (err) {
    console.error(err)
    return []
  }
}

export type NightlyRates = { prices: Record<string, number>; minStay: Record<string, number> }

// Precio por noche y estadía mínima de cada fecha del próximo año (YYYY-MM-DD -> valor)
export async function getNightlyPrices(ids: Ids): Promise<NightlyRates> {
  const rates: NightlyRates = { prices: {}, minStay: {} }
  if (!ids.propId && !ids.roomId) return rates
  try {
    const rooms = await beds24Get<{ calendar?: { from: string; to: string; price1?: number; minStay?: number }[] }[]>(
      '/inventory/rooms/calendar',
      { ...target(ids), ...range(), includePrices: true, includeMinStay: true }
    )
    // Beds24 agrupa días seguidos con el mismo precio en rangos (from y to incluidos)
    for (const c of rooms?.[0]?.calendar || []) {
      for (let d = new Date(`${c.from}T12:00:00Z`); isoDate(d) <= c.to; d.setUTCDate(d.getUTCDate() + 1)) {
        if (typeof c.price1 === 'number' && c.price1 > 0) rates.prices[isoDate(d)] = c.price1
        if (c.minStay && c.minStay > 1) rates.minStay[isoDate(d)] = c.minStay
      }
    }
    return rates
  } catch (err) {
    console.error(err)
    return rates
  }
}

// Precio por noche más bajo de los próximos 90 días entre las noches libres
export function minPrice(prices: Record<string, number>, blocked: string[]) {
  const limit = new Date()
  limit.setDate(limit.getDate() + 90)
  const until = isoDate(limit)
  const taken = new Set(blocked)
  const values = Object.entries(prices)
    .filter(([d]) => d <= until && !taken.has(d))
    .map(([, p]) => p)
  return values.length ? Math.min(...values) : null
}

// Para el diagnóstico: propiedades y habitaciones con sus IDs
export async function listProperties() {
  const props = await beds24Get<{ id: number; name: string; roomTypes?: { id: number; name: string }[] }[]>(
    '/properties',
    { includeAllRooms: true },
    0
  )
  return (props || []).map(p => ({
    id: p.id,
    name: p.name,
    rooms: (p.roomTypes || []).map(r => ({ id: r.id, name: r.name })),
  }))
}
