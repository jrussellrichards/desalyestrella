import type { FC } from 'react'
import {
  IconWifi,
  IconDeviceTv,
  IconParking,
  IconCooker,
  IconFlame,
  IconPool,
  IconBath,
  IconDog,
  IconCheck,
  IconBeach,
  IconBuildingStore
} from '@tabler/icons-react'

const base = 'h-5 w-5 flex-shrink-0'

function normalizeAmenity(raw: string) {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

type IconMap = Record<string, React.ReactNode>

const icons: IconMap = {
  wifi: <IconWifi className={base} stroke={1.8} />,
  smarttv: <IconDeviceTv className={base} stroke={1.8} />,
  television: <IconDeviceTv className={base} stroke={1.8} />,
  cocinaequipada: <IconCooker className={base} stroke={1.8} />,
  calefaccion: <IconFlame className={base} stroke={1.8} />,
  chimenea: <IconFlame className={base} stroke={1.8} />, // se podría cambiar por custom si hace falta
  piscina: <IconPool className={base} stroke={1.8} />,
  jacuzzi: <IconBath className={base} stroke={1.8} />,
  petfriendly: <IconDog className={base} stroke={1.8} />,
  vistaalmar: <IconBeach className={base} stroke={1.8} />,
  restaurant: <IconBuildingStore className={base} stroke={1.8} />,
  estacionamiento: <IconParking className={base} stroke={1.8} />,
}

const aliases: Record<string, string> = {
  'smart tv': 'smarttv',
  smart: 'smarttv',
  tv: 'smarttv',
  'cocina equipada': 'cocinaequipada',
  cocina: 'cocinaequipada',
  'vista al mar': 'vistaalmar',
  'vista-mar': 'vistaalmar',
  playa: 'vistaalmar',
  restaurant: 'restaurant',
  restaurante: 'restaurant',
  resto: 'restaurant',
  'piscina con olas': 'piscina',
  piscinaconolas: 'piscina',
  'piscina temperada': 'piscina',
  piscinatemperada: 'piscina',
  'estacionamiento privado': 'estacionamiento',
  estacionamientoprivado: 'estacionamiento',
  'parking privado': 'estacionamiento',
  parkingprivado: 'estacionamiento',
  'pasos del mar': 'vistaalmar',
  pasosdelmar: 'vistaalmar',
  'pet friendly': 'petfriendly',
  'pet-friendly': 'petfriendly'
}

const fallback = <IconCheck className={base} stroke={1.8} />

export const AmenityIcon: FC<{ amenity: string }> = ({ amenity }) => {
  const normalized = normalizeAmenity(amenity)
  const keyNoSpaces = normalized.replace(/\s+/g, '')
  const mapped = aliases[normalized] || aliases[keyNoSpaces] || keyNoSpaces
  return icons[mapped] || fallback
}