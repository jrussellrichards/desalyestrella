import { NextResponse } from 'next/server'
import { listProperties } from '@/lib/beds24'

// Muestra si la llave de Beds24 funciona y los IDs de propiedades y habitaciones,
// para copiarlos a cada refugio en Sanity. No muestra la llave ni datos de huéspedes.
export const dynamic = 'force-dynamic'

export async function GET() {
  const headers = { 'X-Robots-Tag': 'noindex' }
  if (!process.env.BEDS24_REFRESH_TOKEN) {
    return NextResponse.json({ llaveConfigurada: false }, { headers })
  }
  try {
    const propiedades = await listProperties()
    return NextResponse.json({ llaveConfigurada: true, conexion: 'ok', propiedades }, { headers })
  } catch (err) {
    return NextResponse.json(
      { llaveConfigurada: true, conexion: 'error', detalle: err instanceof Error ? err.message : String(err) },
      { headers }
    )
  }
}
