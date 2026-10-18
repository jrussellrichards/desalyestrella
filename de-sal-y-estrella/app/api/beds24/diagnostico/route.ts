import { NextResponse } from 'next/server'
import { getOffers, listProperties } from '@/lib/beds24'

// Muestra si la llave de Beds24 funciona y los IDs de propiedades y habitaciones,
// para copiarlos a cada refugio en Sanity. No muestra la llave ni datos de huéspedes.
export const dynamic = 'force-dynamic'

// Con ?habitacion=730272&llegada=2026-10-18&salida=2026-10-21 agrega la cotización de Beds24 para esa estadía
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams
  const headers = { 'X-Robots-Tag': 'noindex' }
  if (!process.env.BEDS24_REFRESH_TOKEN) {
    return NextResponse.json({ llaveConfigurada: false }, { headers })
  }
  try {
    const propiedades = await listProperties()
    const habitacion = Number(q.get('habitacion'))
    const llegada = q.get('llegada') || ''
    const salida = q.get('salida') || ''
    const fecha = /^\d{4}-\d{2}-\d{2}$/
    const cotizacion =
      habitacion && fecha.test(llegada) && fecha.test(salida)
        ? await getOffers(habitacion, llegada, salida, Number(q.get('personas')) || 2)
        : undefined
    return NextResponse.json({ llaveConfigurada: true, conexion: 'ok', propiedades, cotizacion }, { headers })
  } catch (err) {
    return NextResponse.json(
      { llaveConfigurada: true, conexion: 'error', detalle: err instanceof Error ? err.message : String(err) },
      { headers }
    )
  }
}
