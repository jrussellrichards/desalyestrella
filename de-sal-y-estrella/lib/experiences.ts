export interface Experience {
  title: string
  description: string
  mapsUrl: string
  instagramUrl?: string
}

export interface Destination {
  slug: 'sal' | 'estrella'
  name: string
  guideTitle: string
  intro: string
  image: string
  refugiosParam: string
  experiences: Experience[]
}

export const DESTINATIONS: Destination[] = [
  {
    slug: 'estrella',
    name: 'La Serena y Valle del Elqui',
    guideTitle: 'Qué hacer en La Serena y el Valle del Elqui',
    intro:
      'Playas amplias en la Avenida del Mar, ballenas en la costa y los cielos más limpios del mundo a una hora de distancia. Estas son las experiencias que recomendamos a nuestros huéspedes.',
    image: '/destinos/la-serena.jpg',
    refugiosParam: 'La Serena',
    experiences: [
      {
        title: 'Avistamiento de ballenas en Chañaral de Aceituno',
        description:
          'Ballenas y delfines en su hábitat natural en Caleta Chañaral de Aceituno, con Maranatha Tour. Un tour imperdible de vida silvestre.',
        mapsUrl: 'https://www.google.com/maps/search/Caleta+Chañaral+de+Aceituno',
        instagramUrl: 'https://www.instagram.com/turismo_maranata/',
      },
      {
        title: 'Observatorio Mamalluca, Valle del Elqui',
        description:
          'Turismo astronómico de primer nivel bajo los cielos más limpios del mundo. Combínalo con un recorrido por los viñedos y pueblos del valle.',
        mapsUrl: 'https://www.google.com/maps?q=-29.9899318,-70.6852942',
        instagramUrl: 'https://www.instagram.com/observatorio_mamalluca/',
      },
      {
        title: 'Clases de surf en la Avenida del Mar',
        description:
          'La Escuela de Surf Poisson está a pasos del Faro: clases con instructores certificados y arriendo de equipos.',
        mapsUrl: 'https://www.google.com/maps/search/Escuela+de+Surf+Poisson+La+Serena',
        instagramUrl: 'https://www.instagram.com/escuelasurfpoisson/',
      },
    ],
  },
  {
    slug: 'sal',
    name: 'Pichilemu',
    guideTitle: 'Qué hacer en Pichilemu',
    intro:
      'La capital del surf chileno: olas para todos los niveles, salinas ancestrales, lagunas tranquilas y patrimonio colonial. Lo que recomendamos a quienes se quedan en nuestra cabaña.',
    image: '/destinos/pichilemu.jpg',
    refugiosParam: 'Pichilemu',
    experiences: [
      {
        title: 'Clases de surf',
        description:
          'Iniciación en La Puntilla o nivel avanzado en Punta de Lobos, una de las olas más famosas de Sudamérica.',
        mapsUrl: 'https://www.google.com/maps/search/Clases+de+Surf+Pichilemu',
      },
      {
        title: 'Ruta de la Sal en Cáhuil',
        description:
          'A 15 km, conoce las pozas artesanales donde se extrae sal de mar como hace siglos y compra directo a los salineros.',
        mapsUrl: 'https://www.google.com/maps/search/Ruta+de+la+Sal+Cahuil',
      },
      {
        title: 'Stand up paddle y paseos en bote en la Laguna de Cáhuil',
        description: 'Aguas tranquilas, sin olas fuertes, ideales para remar o pasear en bote.',
        mapsUrl: 'https://www.google.com/maps/search/Deportes+Acuaticos+Laguna+Cahuil',
      },
      {
        title: 'Parque Agustín Ross',
        description:
          'Monumento Nacional con palmeras centenarias, jardines y la fachada del antiguo casino frente al mar.',
        mapsUrl: 'https://www.google.com/maps/search/Parque+Agustin+Ross+Pichilemu',
      },
      {
        title: 'Artesanía en greda de Pañul',
        description: 'Talleres de artesanos que trabajan la tradicional greda blanca de la zona.',
        mapsUrl: 'https://www.google.com/maps/search/Artesania+Pa%C3%B1ul+Pichilemu',
      },
      {
        title: 'Iglesia San Andrés de Ciruelos',
        description: 'Iglesia colonial de 1778 en el valle interior, un viaje al patrimonio de la zona.',
        mapsUrl: 'https://www.google.com/maps/search/Iglesia+San+Andres+Ciruelos+Pichilemu',
      },
    ],
  },
]

export function getDestination(slug: Destination['slug']) {
  return DESTINATIONS.find(d => d.slug === slug)!
}
