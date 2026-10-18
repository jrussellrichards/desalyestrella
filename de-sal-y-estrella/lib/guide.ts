// Contenido de la guía del huésped (/huespedes/<slug>), ordenado por momentos del viaje.
// Para cambiar un texto, un horario o una recomendación, edita este archivo.
// Los datos sensibles (clave de la puerta, WiFi) se envían por WhatsApp o se cargan en Sanity, nunca aquí.

export type Place = {
  name: string
  text: string
  // Búsqueda o link corto de Google Maps
  maps: string
  instagram?: string
  // Solo en una época del año (se muestra como aviso)
  season?: string
  // Tiene bonita vista (se marca con un ícono)
  view?: boolean
}

export type PlaceGroup = { id: string; title: string; places: Place[] }

// Aviso de descuentos que se muestra en "Dónde comer" de cada zona
export const DISCOUNTS = {
  url: 'https://buzka.cl',
  label: 'buzka.cl',
  title: '¿Tienes alguna tarjeta o descuento?',
  text: 'Revisa en buzka.cl los descuentos que hay cada día en los restaurantes de la zona con las tarjetas que tienes.',
  perk: 'Por ser visitante, pide tu membresía premium gratis.',
}

export type HowTo = { id: string; title: string; text: string; video?: string }

export type Zone = {
  name: string
  emergency: { label: string; maps: string }[]
  tsunami: string
  groups: PlaceGroup[]
}

export type Stay = {
  kind: 'depto' | 'cabana'
  shortName: string
  address: string
  mapsLink: string
  unit?: string
  tower?: string
  parking?: string
  // Horarios: si quedan vacíos, la guía dice que los confirmamos por WhatsApp
  checkIn?: string
  // Hora límite de llegada y qué hacer si se llega después
  checkInUntil?: string
  lateArrival?: string
  checkOut?: string
  arrival: string[]
  howTo: HowTo[]
  departure: string[]
  localContact?: { name: string; role: string; phone: string }
  zone: 'laserena' | 'pichilemu'
}

const maps = (q: string) => `https://www.google.com/maps/search/${encodeURIComponent(q)}`

// ── Instrucciones compartidas de los departamentos de Aqua Resort ──
const aquaHowTo: HowTo[] = [
  {
    id: 'agua',
    title: 'Agua caliente',
    text: 'Es automática y continua. Gira la llave a la izquierda para caliente y a la derecha para fría.',
  },
  {
    id: 'cocina',
    title: 'Cocina de inducción',
    text: 'Presiona encender y toca el nivel del quemador. Si el panel no responde, mantén la "llave" 5 segundos para desbloquearlo.',
  },
  {
    id: 'cafetera',
    title: 'Cafetera Dolce Gusto',
    text: 'Usa cápsulas Dolce Gusto. El video muestra el paso a paso.',
    video: 'https://www.youtube.com/watch?v=okHniwK4Ie4',
  },
  {
    id: 'tv',
    title: 'TV',
    text: 'Tiene TV digital, Prime Video, YouTube Premium y YouTube Music, con las cuentas ya conectadas. A veces un huésped anterior cambia o cierra una cuenta: si alguna no está conectada, escríbele a Javier por WhatsApp y te ayuda a conectarla.',
  },
  {
    id: 'basura',
    title: 'Basura',
    text: 'El ducto está en tu mismo piso, frente a los ascensores. Bota las bolsas bien cerradas.',
  },
]

const aquaArrival = (tower: string, unit: string, parking: string) => [
  `En auto: entra por Avenida Las Higueras, por el acceso al estacionamiento, y estaciona en el N° ${parking}.`,
  'A pie: entra por Avenida del Mar, directo a conserjería.',
  'Regístrate en conserjería (atiende 24/7). Es obligatorio y te da acceso a las instalaciones.',
  `Sube a la torre ${tower}, departamento ${unit}.`,
  'Toca el panel de la cerradura digital para encenderlo y escribe tu clave. Usa la cerradura de la puerta, no la caja externa.',
]

const aquaDeparture = [
  'Deja la basura en el ducto del piso.',
  'Apaga luces, TV y cocina, y cierra las ventanas y la terraza.',
  'Cierra la puerta: la cerradura se bloquea sola.',
]

export const STAYS: Record<string, Stay> = {
  'aqua-403': {
    kind: 'depto',
    shortName: 'Aqua Resort · Depto 403',
    address: 'Avenida Las Higueras 671, Avenida del Mar, La Serena',
    mapsLink: 'https://maps.app.goo.gl/SGmCPNPw346SFM5TA',
    unit: '403',
    tower: '3',
    parking: '227',
    checkIn: '15:00',
    checkOut: '11:00',
    arrival: aquaArrival('3', '403', '227'),
    howTo: aquaHowTo,
    departure: aquaDeparture,
    zone: 'laserena',
  },
  'aqua-308': {
    kind: 'depto',
    shortName: 'Aqua Resort · Depto 308',
    address: 'Avenida Las Higueras 671, Avenida del Mar, La Serena',
    mapsLink: 'https://maps.app.goo.gl/SGmCPNPw346SFM5TA',
    unit: '308',
    tower: '2',
    parking: '401',
    checkIn: '15:00',
    checkOut: '11:00',
    arrival: aquaArrival('2', '308', '401'),
    howTo: aquaHowTo,
    departure: aquaDeparture,
    zone: 'laserena',
  },
  'pichilemu-capital-del-surf': {
    kind: 'cabana',
    shortName: 'Cabaña Pichilemu',
    address: "José Miguel Camilo 442, Pichilemu, O'Higgins",
    mapsLink: 'https://maps.app.goo.gl/SoXTBvNNBYsfckck8',
    checkIn: '15:00',
    checkInUntil: '18:00',
    lateArrival: 'Si vas a llegar más tarde, consúltalo antes con don Sergio.',
    checkOut: '11:00',
    arrival: [
      'Antes de llegar, escríbele a don Sergio por WhatsApp para coordinar la hora.',
      'Don Sergio te recibe en la cabaña y te ayuda con la llegada.',
    ],
    howTo: [
      {
        id: 'chimenea',
        title: 'Chimenea',
        text: 'El tiraje se abre girándolo a la derecha para prender y se cierra a la izquierda para apagar. Prende primero astillas chicas y después agrega leña seca. No uses líquidos inflamables.',
      },
      {
        id: 'agua',
        title: 'Agua caliente',
        text: 'El calefont se enciende solo. Ajusta la temperatura en su panel digital: recomendamos entre 38 y 40 grados.',
      },
      {
        id: 'basura',
        title: 'Basura',
        text: 'Déjala en los contenedores de afuera, en bolsas cerradas.',
      },
    ],
    departure: [
      'Deja la basura en los contenedores de afuera.',
      'Revisa que la chimenea quede sin fuego (tiraje a la izquierda) y apaga las luces.',
      'Cierra ventanas y puerta, y avísale a don Sergio que te vas.',
    ],
    localContact: { name: 'Don Sergio', role: 'te ayuda en lo que necesites durante la estadía', phone: '56956605983' },
    zone: 'pichilemu',
  },
}

// Instalaciones del condominio Aqua (se reservan en conserjería)
export const AQUA_AMENITIES: { name: string; price: string; hours: string }[] = [
  { name: 'Piscina temperada', price: '$3.000 por persona', hours: 'Bloques de 1 h, 08:00 a 22:00' },
  { name: 'Gimnasio', price: '$1.000 por persona', hours: 'Todos los días, 05:00 a 21:00' },
  { name: 'Sauna', price: '$5.000', hours: 'Bloques de 30 min, 09:00 a 21:30' },
  { name: 'Jacuzzi', price: '$20.000', hours: 'Bloques de 1 h, 10:00 a 21:00' },
  { name: 'Quinchos', price: '$15.000 (incluye piscina)', hours: 'L a J 12–17 h y 18–23 h · V y S 18–00 h' },
  { name: 'Sala de juegos', price: 'Sin costo', hours: 'Bloques de 3 h: 9–12, 13–16, 17–22 h' },
  { name: 'Sala de cine', price: 'Sin costo', hours: 'Bloques de 3 h · V y S hasta 1:30' },
  { name: 'Sala multiuso', price: 'Sin costo', hours: 'L a J hasta 22 h · V y S hasta 00 h · 25 personas' },
  { name: 'Piscinas exteriores', price: 'Sin costo', hours: '10:00 a 20:00, solo en temporada alta' },
]

export const AQUA_PAYMENT = {
  holder: 'Condominio Aqua La Serena',
  rut: '53.323.974-9',
  bank: 'Banco Santander · Cuenta corriente 7843849',
  email: 'conserje@aquaserena.cl',
}

export const EMERGENCY_NUMBERS = [
  { label: 'Ambulancia', number: '131' },
  { label: 'Bomberos', number: '132' },
  { label: 'Carabineros', number: '133' },
]

export const ZONES: Record<Stay['zone'], Zone> = {
  laserena: {
    name: 'La Serena',
    emergency: [
      { label: 'Hospital San Juan de Dios de La Serena', maps: maps('Hospital San Juan de Dios La Serena') },
      { label: 'Farmacias cercanas', maps: maps('farmacia Avenida del Mar La Serena') },
    ],
    tsunami:
      'Si un sismo es tan fuerte que cuesta mantenerse en pie, evacúa de inmediato sin esperar la alarma. Aléjate del mar hacia el oriente siguiendo las señales azules de ruta de evacuación, hasta una zona alta.',
    groups: [
      {
        id: 'comer',
        title: 'Dónde comer',
        places: [
          { name: 'Mare by Bombo', text: 'Cocina de autor del mar: ceviches, parrilla y arrisotado de mariscos.', maps: maps('Mare by Bombo La Serena') },
          { name: 'Bakulic', text: 'Clásico de la Av. del Mar para pescados y mariscos, con vista al Faro.', maps: maps('Bakulic La Serena') },
          { name: 'Taikin Sushi Bar', text: 'Sushi con toques sudamericanos en plena Av. del Mar.', maps: maps('Taikin Sushi Bar La Serena') },
          { name: 'Bendito Completo / Entre Tacos', text: 'Completos y tacos para un almuerzo rápido.', maps: maps('Bendito Completo La Serena') },
          { name: 'Cafetería La Trinidad', text: 'Desayunos y onces cerca de la playa.', maps: maps('Cafeteria La Trinidad La Serena') },
        ],
      },
      {
        id: 'playas',
        title: 'Playas',
        places: [
          { name: 'Cuatro Esquinas', text: 'La playa de la Av. del Mar, con restaurantes y paseo.', maps: maps('Playa Cuatro Esquinas La Serena') },
          { name: 'Guanaqueros', text: 'Bahía de aguas tranquilas para bañarse y comer pescado fresco.', maps: maps('Playa Guanaqueros') },
          { name: 'Totoralillo', text: 'Agua turquesa y arena blanca, ideal para un día completo.', maps: maps('Playa Totoralillo Coquimbo') },
        ],
      },
      {
        id: 'paseos',
        title: 'Paseos y tours',
        places: [
          { name: 'Reserva Pingüino de Humboldt', text: 'Excursión en bote desde Punta de Choros a isla Damas: pingüinos, lobos marinos y delfines. Día completo.', maps: maps('Punta de Choros') },
          { name: 'Valle del Elqui y Observatorio Mamalluca', text: 'Pisqueras, Vicuña y cielos limpísimos para mirar estrellas.', maps: 'https://www.google.com/maps?q=-29.9899318,-70.6852942', instagram: 'https://www.instagram.com/observatorio_mamalluca/' },
          { name: 'Ballenas en Chañaral de Aceituno', text: 'Tour para ver ballenas y delfines con Maranatha.', maps: maps('Caleta Chañaral de Aceituno'), instagram: 'https://www.instagram.com/turismo_maranata/', season: 'Mejor temporada: diciembre a marzo' },
          { name: 'Coquimbo', text: 'Barrio Inglés, la Cruz del Tercer Milenio y el mercado de la caleta.', maps: maps('Barrio Inglés Coquimbo') },
          { name: 'Clases de surf (Escuela Poisson)', text: 'A pasos del Faro, con arriendo de tablas y trajes.', maps: maps('Escuela de Surf Poisson La Serena'), instagram: 'https://www.instagram.com/escuelasurfpoisson/' },
        ],
      },
      {
        id: 'compras',
        title: 'Compras y recuerdos',
        places: [
          { name: 'Supermercado Jumbo', text: 'El más completo, junto al Mall Plaza.', maps: maps('Jumbo La Serena') },
          { name: 'Mall Plaza La Serena', text: 'Tiendas, cine y patio de comidas.', maps: maps('Mall Plaza La Serena') },
          { name: 'La Recova', text: 'Mercado tradicional del centro: papayas, pisco, dulces y artesanía.', maps: maps('La Recova La Serena') },
          { name: 'Pueblito Peñuelas', text: 'Artesanía, emprendedores y food trucks al aire libre.', maps: maps('Pueblito Peñuelas La Serena') },
        ],
      },
      {
        id: 'noche',
        title: 'De noche',
        places: [
          { name: 'Huentelauquen', text: 'Restobar rústico con tragos de autor y música en vivo.', maps: maps('Huentelauquen La Serena') },
          { name: 'El Muelle', text: 'Pub frente al mar, famoso por sus poncheras.', maps: maps('El Muelle La Serena') },
          { name: 'New City', text: 'Bar y discoteca de dos pisos en el sector El Santo.', maps: maps('New City La Serena') },
          { name: 'OVO Nightclub', text: 'La discoteca de Enjoy Coquimbo.', maps: maps('OVO Nightclub Coquimbo') },
        ],
      },
    ],
  },
  pichilemu: {
    name: 'Pichilemu',
    emergency: [
      { label: 'Hospital de Pichilemu', maps: maps('Hospital de Pichilemu') },
      { label: 'Farmacias en el centro', maps: maps('farmacia Pichilemu') },
    ],
    tsunami:
      'Si un sismo es tan fuerte que cuesta mantenerse en pie, evacúa de inmediato sin esperar la alarma. Aléjate del mar siguiendo las señales azules de ruta de evacuación, hasta una zona alta.',
    groups: [
      {
        id: 'comer',
        title: 'Dónde comer',
        places: [
          { name: 'La Sal', text: 'Cocina de autor de pescados y mariscos en Punta de Lobos.', maps: maps('Restaurante La Sal Pichilemu'), view: true },
          { name: 'Costa María', text: 'Reineta, pastel de jaiba y empanadas con vista al mar.', maps: maps('Restaurante Costa Maria Pichilemu'), view: true },
          { name: 'Kampai', text: 'Sushi y cocina japonesa con vista al mar.', maps: maps('Kampai Pichilemu'), view: true },
          { name: 'Bocas del Mar', text: 'Cocina peruana: ceviches, causas y pescados.', maps: maps('Bocas del Mar Pichilemu') },
          { name: 'Los Piures Club Social', text: 'Comida chilena frente a la laguna de Cáhuil.', maps: maps('Los Piures Club Social Cahuil') },
          { name: 'Cardumen Café', text: 'Café de especialidad, pastelería y brunch.', maps: maps('Cardumen Cafe Pichilemu') },
          { name: 'Cúrcuma', text: 'Opciones vegetarianas y veganas en el centro.', maps: maps('Curcuma Pichilemu') },
          { name: 'Sushi Tsumare', text: 'Sushi fresco y bien hecho.', maps: maps('Sushi Tsumare Pichilemu') },
          { name: 'Empanadas El Diablito', text: 'Empanadas fritas de pino y mariscos, en Playa Hermosa.', maps: 'https://maps.app.goo.gl/J8CXywh7ncku9Kzy6' },
          { name: 'La Casa Verde', text: 'Sándwiches contundentes, también veganos. Ideal después del surf.', maps: maps('Sangucheria La Casa Verde Pichilemu') },
          { name: 'Mi Tercer Tiempo', text: 'Sándwiches rápidos y sabrosos, hasta tarde.', maps: maps('Sandwicheria Mi Tercer Tiempo Pichilemu') },
        ],
      },
      {
        id: 'playas',
        title: 'Playas',
        places: [
          { name: 'La Puntilla', text: 'La playa principal: buena para familias y para empezar en el surf.', maps: maps('La Puntilla Pichilemu') },
          { name: 'Playa Hermosa', text: 'Larga y tranquila, para caminar y ver el atardecer.', maps: maps('Playa Hermosa Pichilemu') },
          { name: 'Punta de Lobos', text: 'Santuario de la naturaleza y ola de clase mundial.', maps: maps('Punta de Lobos Pichilemu') },
        ],
      },
      {
        id: 'paseos',
        title: 'Paseos',
        places: [
          { name: 'Clases de surf', text: 'Para empezar, en La Puntilla. Avanzado, en Punta de Lobos.', maps: maps('Clases de Surf Pichilemu') },
          { name: 'Salinas de Cáhuil', text: 'A 15 km: pozas de sal artesanal donde puedes comprar directo.', maps: maps('Salinas de Cahuil') },
          { name: 'Laguna de Cáhuil', text: 'Stand up paddle o paseo en bote, sin olas.', maps: maps('Laguna de Cahuil') },
          { name: 'Valle de Colchagua', text: 'Viñas y la plaza de Santa Cruz, para un día de paseo hacia el interior.', maps: maps('Santa Cruz Colchagua') },
          { name: 'Parque Agustín Ross', text: 'Palmeras centenarias y el antiguo casino, en el centro.', maps: maps('Parque Agustin Ross Pichilemu') },
          { name: 'Artesanía de Pañul', text: 'Talleres de greda blanca camino al sur.', maps: maps('Artesania Pañul Pichilemu') },
          { name: 'Iglesia San Andrés de Ciruelos', text: 'Iglesia colonial de 1778 en el valle.', maps: maps('Iglesia San Andres Ciruelos') },
        ],
      },
      {
        id: 'compras',
        title: 'Compras',
        places: [
          { name: 'Supermercados', text: 'Los principales están en el centro de Pichilemu.', maps: maps('supermercado Pichilemu') },
          { name: 'Leña', text: 'Si necesitas más leña, escríbenos y te decimos dónde comprar.', maps: maps('venta de leña Pichilemu') },
        ],
      },
      {
        id: 'noche',
        title: 'De noche',
        places: [
          { name: 'Bar La Virgen', text: 'Coctelería de autor con vista al mar.', maps: maps('Bar La Virgen Pichilemu'), view: true },
          { name: 'Nativo Restobar', text: 'Coctelería y buen ambiente en la Av. Ortúzar.', maps: maps('Nativo Restobar Pichilemu') },
          { name: 'Osaka', text: 'Cocina nikkei y mixología frente a la playa.', maps: maps('Osaka Pichilemu') },
          { name: 'Waitara Club', text: 'La discoteca de La Puntilla.', maps: maps('Waitara Club Pichilemu') },
        ],
      },
    ],
  },
}

// Si en Sanity cambia el slug, se busca por el nombre
export function getStay(slug: string, name = ''): Stay | null {
  if (STAYS[slug]) return STAYS[slug]
  if (/403/.test(slug + name)) return STAYS['aqua-403']
  if (/308/.test(slug + name)) return STAYS['aqua-308']
  if (/pichilemu/i.test(slug + name)) return STAYS['pichilemu-capital-del-surf']
  return null
}
