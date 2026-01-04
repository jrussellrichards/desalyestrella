import { 
  IconMapPin, 
  IconToolsKitchen2, 
  IconTelescope, 
  IconInfoCircle, 
  IconHome,
  IconBuildingCommunity,
  IconPool,
  IconMovie,
  IconDeviceGamepad,
  IconFlame,
  IconBarbell,
  IconBath,
  IconSunset2,
  IconFirstAidKit,
  IconBuildingBank,
  IconCar
} from '@tabler/icons-react'

export const CONTENT = {
  es: {
    hero: {
      badge: 'Guía de Huéspedes',
      title: 'La Serena',
      subtitle: 'Donde el desierto florece junto al mar. Descubre la magia del norte chico.'
    },
    intro: '"Aquí el sol brilla todo el año y las estrellas cuentan historias antiguas."',
    sections: [
      { id: 'alojamiento', label: 'Tu Depto', icon: IconHome },
      { id: 'amenities', label: 'Amenities', icon: IconBuildingCommunity },
      { id: 'explora', label: 'Explora', icon: IconMapPin },
      { id: 'sabores', label: 'Sabores', icon: IconToolsKitchen2 },
      { id: 'vive', label: 'Vive', icon: IconTelescope },
      { id: 'datos', label: 'Datos', icon: IconInfoCircle },
    ],
    accommodation: {
      title: 'Tu Alojamiento',
      location: {
        title: 'Ubicación',
        address: 'Avenida Las Higueras 671, Avenida del Mar.\nDepto 308, Torre 2.\nLa Serena, Coquimbo.',
        linkText: 'Ver en Google Maps'
      },
      checkin: {
        title: 'Llegada y Acceso',
        checkinLabel: 'Check-in:',
        checkinValue: 'A partir de las 15:00 hrs.',
        accessLabel: 'Acceso:',
        accessValue: 'Cerradura digital con código único (se envía antes de tu llegada).'
      },
      wifi: {
        title: 'WiFi',
        networkLabel: 'Red',
        passwordLabel: 'Contraseña'
      },
      parking: {
        title: 'Estacionamiento',
        text: 'Espacio asignado número',
        spot: '401'
      }
    },
    amenities: {
      title: 'Amenities',
      labels: {
        capacity: 'Capacidad:',
        schedule: 'Horario:',
        cost: 'Costo:'
      },
      items: [
        {
          name: 'Piscinas Externas',
          icon: IconPool,
          capacity: '100 personas',
          schedule: '10:00 a 20:00 hrs (Temporada Alta)',
          cost: 'Sin costo',
          rules: 'Prohibido consumo de alcohol y alimentos.'
        },
        {
          name: 'Piscina Temperada',
          icon: IconPool,
          capacity: '12 personas',
          schedule: 'Lunes a Domingo (bloques de 1 hr)',
          cost: '$3.000 por persona (Visitas/Arrendatarios)',
          rules: 'Prohibido fumar, alcohol y alimentos.'
        },
        {
          name: 'Quinchos',
          icon: IconFlame,
          capacity: '8 personas',
          schedule: 'Turnos de 5-6 hrs (ver conserjería)',
          cost: '$15.000',
          rules: 'Aseo obligatorio antes de entregar.'
        },
        {
          name: 'Jacuzzi',
          icon: IconBath,
          capacity: '4 personas',
          schedule: 'Bloques de 1 hr (10:00 - 21:00)',
          cost: '$20.000',
          rules: 'Prohibido fumar, alcohol y alimentos.'
        },
        {
          name: 'Sauna',
          icon: IconBath,
          capacity: '3 por cabina',
          schedule: 'Bloques de 30 min (09:00 - 21:30)',
          cost: '$5.000 x cabina',
          rules: 'Prohibido fumar, alcohol y alimentos.'
        },
        {
          name: 'Gimnasios',
          icon: IconBarbell,
          capacity: '5-7 personas',
          schedule: '05:00/06:00 a 21:00 hrs',
          cost: '$1.000 (Solo arrendatarios temporales)',
          rules: 'Uso exclusivo residentes/arrendatarios.'
        },
        {
          name: 'Sala de Cine',
          icon: IconMovie,
          capacity: '6 personas',
          schedule: 'Bloques de 3 hrs',
          cost: 'Sin costo',
          rules: 'Solo snacks permitidos.'
        },
        {
          name: 'Sala de Juegos',
          icon: IconDeviceGamepad,
          capacity: '10 personas',
          schedule: 'Bloques de 3 hrs (09:00 - 22:00)',
          cost: 'Sin costo',
          rules: 'Música moderada. No alcohol.'
        },
        {
          name: 'Sala Multiuso',
          icon: IconBuildingCommunity,
          capacity: '20-25 personas',
          schedule: 'Bloques de 4-6 hrs',
          cost: 'Sin costo',
          rules: 'Música moderada. No fumar.'
        }
      ]
    },
    explore: {
      title: 'Explora',
      items: [
        {
          title: 'El Faro Monumental',
          desc: 'Ícono indiscutible de La Serena. Perfecto para caminatas al atardecer y fotografías memorables.',
          image: 'https://images.unsplash.com/photo-1597262122683-c11d67269c3d?q=80&w=800&auto=format&fit=crop',
          tag: 'Imperdible'
        },
        {
          title: 'Valle de Elqui',
          desc: 'Tierra de pisco y estrellas. Un viaje místico entre viñedos y montañas a pocos minutos de la ciudad.',
          image: 'https://images.unsplash.com/photo-1534234828563-025c93f32d22?q=80&w=800&auto=format&fit=crop',
          tag: 'Naturaleza'
        },
        {
          title: 'Avenida del Mar',
          desc: 'Kilómetros de playa, ciclovías y gastronomía. El corazón vibrante del verano serenense.',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
          tag: 'Playa'
        }
      ]
    },
    flavors: {
      title: 'Sabores',
      items: [
        {
          name: 'Bakul',
          desc: 'Sabores del mundo con vista al mar. Una experiencia gastronómica sofisticada y relajada.',
          price: '$$$',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop'
        },
        {
          name: 'Huentelauquén',
          desc: 'Tradición obligada. Sus empanadas de queso son leyenda en la región.',
          price: '$$',
          image: 'https://images.unsplash.com/photo-1626804475297-411d863b67ab?q=80&w=800&auto=format&fit=crop'
        },
        {
          name: 'Ayawasi',
          desc: 'Cocina con identidad local y productos del valle. Un rincón acogedor y auténtico.',
          price: '$$',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop'
        }
      ]
    },
    live: {
      title: 'Vive',
      items: [
        {
          title: 'Tour Astronómico',
          desc: 'Descubre los secretos del universo en el cielo más limpio.',
          icon: IconTelescope
        },
        {
          title: 'Día de Playa',
          desc: 'Relájate en las cálidas arenas de la Avenida del Mar.',
          icon: IconSunset2
        }
      ]
    },
    info: {
      title: 'Datos Útiles',
      items: [
        {
          title: 'Hospital de La Serena',
          desc: 'Av. Balmaceda 916 • Urgencias 24/7',
          icon: IconFirstAidKit,
          colorClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        },
        {
          title: 'Mall Plaza La Serena',
          desc: 'Bancos y Cajeros • Av. Alberto Solari 1400',
          icon: IconBuildingBank,
          colorClass: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
        },
        {
          title: 'Radio Taxis',
          desc: '+56 51 222 2222 (Radio Taxi El Faro)',
          icon: IconCar,
          colorClass: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
        }
      ]
    },
    footer: {
      brand: 'De Sal y Estrella',
      message: 'Disfruta tu estadía'
    }
  },
  en: {
    hero: {
      badge: 'Guest Guide',
      title: 'La Serena',
      subtitle: 'Where the desert blooms by the sea. Discover the magic of the north.'
    },
    intro: '"Here the sun shines all year round and the stars tell ancient stories."',
    sections: [
      { id: 'alojamiento', label: 'Your Apt', icon: IconHome },
      { id: 'amenities', label: 'Amenities', icon: IconBuildingCommunity },
      { id: 'explora', label: 'Explore', icon: IconMapPin },
      { id: 'sabores', label: 'Flavors', icon: IconToolsKitchen2 },
      { id: 'vive', label: 'Live', icon: IconTelescope },
      { id: 'datos', label: 'Info', icon: IconInfoCircle },
    ],
    accommodation: {
      title: 'Your Accommodation',
      location: {
        title: 'Location',
        address: 'Avenida Las Higueras 671, Avenida del Mar.\nApt 308, Tower 2.\nLa Serena, Coquimbo.',
        linkText: 'View on Google Maps'
      },
      checkin: {
        title: 'Arrival & Access',
        checkinLabel: 'Check-in:',
        checkinValue: 'From 3:00 PM.',
        accessLabel: 'Access:',
        accessValue: 'Digital lock with unique code (sent before your arrival).'
      },
      wifi: {
        title: 'WiFi',
        networkLabel: 'Network',
        passwordLabel: 'Password'
      },
      parking: {
        title: 'Parking',
        text: 'Assigned spot number',
        spot: '401'
      }
    },
    amenities: {
      title: 'Amenities',
      labels: {
        capacity: 'Capacity:',
        schedule: 'Schedule:',
        cost: 'Cost:'
      },
      items: [
        {
          name: 'Outdoor Pools',
          icon: IconPool,
          capacity: '100 people',
          schedule: '10:00 AM to 8:00 PM (High Season)',
          cost: 'Free',
          rules: 'No alcohol or food allowed.'
        },
        {
          name: 'Heated Pool',
          icon: IconPool,
          capacity: '12 people',
          schedule: 'Monday to Sunday (1 hr blocks)',
          cost: '$3,000 CLP per person (Guests/Tenants)',
          rules: 'No smoking, alcohol, or food.'
        },
        {
          name: 'BBQ Area (Quinchos)',
          icon: IconFlame,
          capacity: '8 people',
          schedule: '5-6 hr shifts (check concierge)',
          cost: '$15,000 CLP',
          rules: 'Cleaning mandatory before leaving.'
        },
        {
          name: 'Jacuzzi',
          icon: IconBath,
          capacity: '4 people',
          schedule: '1 hr blocks (10:00 AM - 9:00 PM)',
          cost: '$20,000 CLP',
          rules: 'No smoking, alcohol, or food.'
        },
        {
          name: 'Sauna',
          icon: IconBath,
          capacity: '3 per cabin',
          schedule: '30 min blocks (9:00 AM - 9:30 PM)',
          cost: '$5,000 CLP per cabin',
          rules: 'No smoking, alcohol, or food.'
        },
        {
          name: 'Gyms',
          icon: IconBarbell,
          capacity: '5-7 people',
          schedule: '5:00/6:00 AM to 9:00 PM',
          cost: '$1,000 CLP (Temporary tenants only)',
          rules: 'Exclusive use for residents/tenants.'
        },
        {
          name: 'Cinema Room',
          icon: IconMovie,
          capacity: '6 people',
          schedule: '3 hr blocks',
          cost: 'Free',
          rules: 'Snacks only.'
        },
        {
          name: 'Game Room',
          icon: IconDeviceGamepad,
          capacity: '10 people',
          schedule: '3 hr blocks (9:00 AM - 10:00 PM)',
          cost: 'Free',
          rules: 'Moderate music. No alcohol.'
        },
        {
          name: 'Multipurpose Room',
          icon: IconBuildingCommunity,
          capacity: '20-25 people',
          schedule: '4-6 hr blocks',
          cost: 'Free',
          rules: 'Moderate music. No smoking.'
        }
      ]
    },
    explore: {
      title: 'Explore',
      items: [
        {
          title: 'Monumental Lighthouse',
          desc: 'Undisputed icon of La Serena. Perfect for sunset walks and memorable photos.',
          image: 'https://images.unsplash.com/photo-1597262122683-c11d67269c3d?q=80&w=800&auto=format&fit=crop',
          tag: 'Must See'
        },
        {
          title: 'Elqui Valley',
          desc: 'Land of pisco and stars. A mystical journey between vineyards and mountains just minutes from the city.',
          image: 'https://images.unsplash.com/photo-1534234828563-025c93f32d22?q=80&w=800&auto=format&fit=crop',
          tag: 'Nature'
        },
        {
          title: 'Avenida del Mar',
          desc: 'Kilometers of beach, bike paths, and gastronomy. The vibrant heart of La Serena summer.',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
          tag: 'Beach'
        }
      ]
    },
    flavors: {
      title: 'Flavors',
      items: [
        {
          name: 'Bakul',
          desc: 'World flavors with ocean view. A sophisticated and relaxed dining experience.',
          price: '$$$',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop'
        },
        {
          name: 'Huentelauquén',
          desc: 'A must-try tradition. Their cheese empanadas are legendary in the region.',
          price: '$$',
          image: 'https://images.unsplash.com/photo-1626804475297-411d863b67ab?q=80&w=800&auto=format&fit=crop'
        },
        {
          name: 'Ayawasi',
          desc: 'Cuisine with local identity and valley products. A cozy and authentic corner.',
          price: '$$',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop'
        }
      ]
    },
    live: {
      title: 'Live',
      items: [
        {
          title: 'Astronomy Tour',
          desc: 'Discover the secrets of the universe in the clearest skies.',
          icon: IconTelescope
        },
        {
          title: 'Beach Day',
          desc: 'Relax on the warm sands of Avenida del Mar.',
          icon: IconSunset2
        }
      ]
    },
    info: {
      title: 'Useful Info',
      items: [
        {
          title: 'La Serena Hospital',
          desc: 'Av. Balmaceda 916 • 24/7 Emergency',
          icon: IconFirstAidKit,
          colorClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        },
        {
          title: 'Mall Plaza La Serena',
          desc: 'Banks and ATMs • Av. Alberto Solari 1400',
          icon: IconBuildingBank,
          colorClass: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
        },
        {
          title: 'Radio Taxis',
          desc: '+56 51 222 2222 (Radio Taxi El Faro)',
          icon: IconCar,
          colorClass: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
        }
      ]
    },
    footer: {
      brand: 'De Sal y Estrella',
      message: 'Enjoy your stay'
    }
  },
  fr: {
    hero: {
      badge: 'Guide des Invités',
      title: 'La Serena',
      subtitle: 'Où le désert fleurit au bord de la mer. Découvrez la magie du nord.'
    },
    intro: '"Ici le soleil brille toute l\'année et les étoiles racontent des histoires anciennes."',
    sections: [
      { id: 'alojamiento', label: 'Votre Apt', icon: IconHome },
      { id: 'amenities', label: 'Commodités', icon: IconBuildingCommunity },
      { id: 'explora', label: 'Explorer', icon: IconMapPin },
      { id: 'sabores', label: 'Saveurs', icon: IconToolsKitchen2 },
      { id: 'vive', label: 'Vivre', icon: IconTelescope },
      { id: 'datos', label: 'Infos', icon: IconInfoCircle },
    ],
    accommodation: {
      title: 'Votre Hébergement',
      location: {
        title: 'Emplacement',
        address: 'Avenida Las Higueras 671, Avenida del Mar.\nApt 308, Tour 2.\nLa Serena, Coquimbo.',
        linkText: 'Voir sur Google Maps'
      },
      checkin: {
        title: 'Arrivée et Accès',
        checkinLabel: 'Check-in:',
        checkinValue: 'À partir de 15h00.',
        accessLabel: 'Accès:',
        accessValue: 'Serrure numérique avec code unique (envoyé avant votre arrivée).'
      },
      wifi: {
        title: 'WiFi',
        networkLabel: 'Réseau',
        passwordLabel: 'Mot de passe'
      },
      parking: {
        title: 'Parking',
        text: 'Place attribuée numéro',
        spot: '401'
      }
    },
    amenities: {
      title: 'Commodités',
      labels: {
        capacity: 'Capacité:',
        schedule: 'Horaire:',
        cost: 'Coût:'
      },
      items: [
        {
          name: 'Piscines Extérieures',
          icon: IconPool,
          capacity: '100 personnes',
          schedule: '10h00 à 20h00 (Haute Saison)',
          cost: 'Gratuit',
          rules: 'Alcool et nourriture interdits.'
        },
        {
          name: 'Piscine Chauffée',
          icon: IconPool,
          capacity: '12 personnes',
          schedule: 'Lundi à Dimanche (blocs de 1h)',
          cost: '3 000 CLP par personne (Invités/Locataires)',
          rules: 'Interdit de fumer, alcool et nourriture.'
        },
        {
          name: 'Espace Barbecue (Quinchos)',
          icon: IconFlame,
          capacity: '8 personnes',
          schedule: 'Tours de 5-6h (voir conciergerie)',
          cost: '15 000 CLP',
          rules: 'Nettoyage obligatoire avant de partir.'
        },
        {
          name: 'Jacuzzi',
          icon: IconBath,
          capacity: '4 personnes',
          schedule: 'Blocs de 1h (10h00 - 21h00)',
          cost: '20 000 CLP',
          rules: 'Interdit de fumer, alcool et nourriture.'
        },
        {
          name: 'Sauna',
          icon: IconBath,
          capacity: '3 par cabine',
          schedule: 'Blocs de 30 min (09h00 - 21h30)',
          cost: '5 000 CLP par cabine',
          rules: 'Interdit de fumer, alcool et nourriture.'
        },
        {
          name: 'Salles de Sport',
          icon: IconBarbell,
          capacity: '5-7 personnes',
          schedule: '05h00/06h00 à 21h00',
          cost: '1 000 CLP (Locataires temporaires seulement)',
          rules: 'Usage exclusif résidents/locataires.'
        },
        {
          name: 'Salle de Cinéma',
          icon: IconMovie,
          capacity: '6 personnes',
          schedule: 'Blocs de 3h',
          cost: 'Gratuit',
          rules: 'Snacks seulement.'
        },
        {
          name: 'Salle de Jeux',
          icon: IconDeviceGamepad,
          capacity: '10 personnes',
          schedule: 'Blocs de 3h (09h00 - 22h00)',
          cost: 'Gratuit',
          rules: 'Musique modérée. Pas d\'alcool.'
        },
        {
          name: 'Salle Polyvalente',
          icon: IconBuildingCommunity,
          capacity: '20-25 personnes',
          schedule: 'Blocs de 4-6h',
          cost: 'Gratuit',
          rules: 'Musique modérée. Interdit de fumer.'
        }
      ]
    },
    explore: {
      title: 'Explorer',
      items: [
        {
          title: 'Phare Monumental',
          desc: 'Icône incontestée de La Serena. Parfait pour les promenades au coucher du soleil et les photos mémorables.',
          image: 'https://images.unsplash.com/photo-1597262122683-c11d67269c3d?q=80&w=800&auto=format&fit=crop',
          tag: 'Incontournable'
        },
        {
          title: 'Vallée de l\'Elqui',
          desc: 'Terre de pisco et d\'étoiles. Un voyage mystique entre vignobles et montagnes à quelques minutes de la ville.',
          image: 'https://images.unsplash.com/photo-1534234828563-025c93f32d22?q=80&w=800&auto=format&fit=crop',
          tag: 'Nature'
        },
        {
          title: 'Avenida del Mar',
          desc: 'Kilomètres de plage, pistes cyclables et gastronomie. Le cœur vibrant de l\'été à La Serena.',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop',
          tag: 'Plage'
        }
      ]
    },
    flavors: {
      title: 'Saveurs',
      items: [
        {
          name: 'Bakul',
          desc: 'Saveurs du monde avec vue sur la mer. Une expérience gastronomique sophistiquée et détendue.',
          price: '$$$',
          image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop'
        },
        {
          name: 'Huentelauquén',
          desc: 'Une tradition incontournable. Leurs empanadas au fromage sont légendaires dans la région.',
          price: '$$',
          image: 'https://images.unsplash.com/photo-1626804475297-411d863b67ab?q=80&w=800&auto=format&fit=crop'
        },
        {
          name: 'Ayawasi',
          desc: 'Cuisine avec identité locale et produits de la vallée. Un coin chaleureux et authentique.',
          price: '$$',
          image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop'
        }
      ]
    },
    live: {
      title: 'Vivre',
      items: [
        {
          title: 'Tour Astronomique',
          desc: 'Découvrez les secrets de l\'univers dans le ciel le plus pur.',
          icon: IconTelescope
        },
        {
          title: 'Journée à la Plage',
          desc: 'Détendez-vous sur le sable chaud de l\'Avenida del Mar.',
          icon: IconSunset2
        }
      ]
    },
    info: {
      title: 'Infos Utiles',
      items: [
        {
          title: 'Hôpital de La Serena',
          desc: 'Av. Balmaceda 916 • Urgences 24/7',
          icon: IconFirstAidKit,
          colorClass: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        },
        {
          title: 'Mall Plaza La Serena',
          desc: 'Banques et Distributeurs • Av. Alberto Solari 1400',
          icon: IconBuildingBank,
          colorClass: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
        },
        {
          title: 'Radio Taxis',
          desc: '+56 51 222 2222 (Radio Taxi El Faro)',
          icon: IconCar,
          colorClass: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
        }
      ]
    },
    footer: {
      brand: 'De Sal y Estrella',
      message: 'Profitez de votre séjour'
    }
  }
}
