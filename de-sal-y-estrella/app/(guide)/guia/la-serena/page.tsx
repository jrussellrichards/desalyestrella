import { Metadata } from 'next'
import LaSerenaGuide from './LaSerenaGuide'

export const metadata: Metadata = {
  title: 'Guía de Huéspedes | La Serena | De Sal y Estrella',
  description: 'Tu guía digital para una estadía perfecta en La Serena. Wifi, amenities, recomendaciones y más.',
}

export default function Page() {
  return <LaSerenaGuide />
}

