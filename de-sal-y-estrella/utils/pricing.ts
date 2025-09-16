// Utilidades de pricing para propiedades
// Calcula un precio de muestra (desde) aplicando multiplicadores estacionales simples.
import { Property } from '@/types'

interface DisplayPriceInfo {
  raw?: number
  display: string
  seasonNote?: string
}

// Formateo simple CLP (puedes reemplazar por Intl.NumberFormat si necesitas locales múltiples)
const formatCLP = (value: number) => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(
    value
  )
}

export function computeDisplayPrice(property: Property): DisplayPriceInfo | null {
  if (!property.basePrice) return null
  const base = property.basePrice
  // Seleccionamos multiplicador si hoy cae dentro de un rango definido (start/end) o el primer registro "default"
  const today = new Date()
  let applied = 1
  let seasonNote: string | undefined

  if (Array.isArray(property.seasonalAdjustments)) {
    for (const adj of property.seasonalAdjustments) {
      if (!adj) continue
      const mult = adj.multiplier ?? 1
      if (adj.start && adj.end) {
        const start = new Date(adj.start)
        const end = new Date(adj.end)
        if (today >= start && today <= end) {
          applied = mult
          seasonNote = adj.season
          break
        }
      } else if (!seasonNote) {
        // fallback para un ajuste "default" sin fechas
        applied = mult
        seasonNote = adj.season
      }
    }
  }

  const raw = Math.round(base * applied)
  return {
    raw,
    display: formatCLP(raw),
    seasonNote: seasonNote ? `(${seasonNote})` : undefined
  }
}
