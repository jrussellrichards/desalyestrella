import type { Metadata } from 'next'
import ExperienceGuide from '@/components/ExperienceGuide'
import { getDestination } from '@/lib/experiences'

const destination = getDestination('sal')

export const metadata: Metadata = {
  title: destination.guideTitle,
  description: destination.intro.slice(0, 158),
  alternates: { canonical: '/experiencias/sal' },
}

export default function Page() {
  return <ExperienceGuide destination={destination} />
}
