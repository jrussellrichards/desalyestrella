// Lectura de disponibilidad y precios desde la API v2 de Beds24 (solo en el servidor).
// La llave va en la variable de entorno BEDS24_REFRESH_TOKEN; si falta o la API falla,
// todo devuelve vacío y la ficha sigue funcionando sin fechas ocupadas.

const API = 'https://api.beds24.com/v2'
const DAYS_AHEAD = 365

type Ids = { propId?: number; roomId?: number }

async function getToken(): Promise<string | null> {
  const refreshToken = process.env.BEDS24_REFRESH_TOKEN
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

// Precio por noche más bajo de los próximos 90 días entre las noches libres
export async function getMinPrice(ids: Ids): Promise<number | null> {
  if (!ids.propId && !ids.roomId) return null
  try {
    const { startDate } = range()
    const end = new Date()
    end.setDate(end.getDate() + 90)
    const rooms = await beds24Get<{ calendar?: { numAvail?: number; price1?: number }[] }[]>('/inventory/rooms/calendar', {
      ...target(ids),
      startDate,
      endDate: isoDate(end),
      includePrices: true,
      includeNumAvail: true,
    })
    const prices = (rooms || [])
      .flatMap(r => r.calendar || [])
      .filter(c => (c.numAvail ?? 1) > 0 && typeof c.price1 === 'number' && c.price1 > 0)
      .map(c => c.price1 as number)
    return prices.length ? Math.min(...prices) : null
  } catch (err) {
    console.error(err)
    return null
  }
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
