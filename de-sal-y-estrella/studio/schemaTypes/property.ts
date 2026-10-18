import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'property',
  title: 'Propiedad',
  type: 'document',
  groups: [
    { name: 'content', title: 'Contenido Principal', default: true },
    { name: 'seo', title: 'SEO' },
    { name: 'distribution', title: 'Canales / Externo' }, // nuevo grupo
  ],
  fields: [
    // --- Campos de Contenido Principal ---
    defineField({
      name: 'name',
      title: 'Nombre de la Propiedad',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'beds24PropId',
      title: 'Beds24: ID de propiedad',
      type: 'number',
      group: 'distribution',
      description: 'En Beds24: Configuración > Propiedades. Con él, el calendario de la ficha tacha las noches ocupadas y muestra el precio desde Beds24.',
    }),
    defineField({
      name: 'beds24RoomId',
      title: 'Beds24: ID de habitación (opcional)',
      type: 'number',
      group: 'distribution',
      description: 'Si la propiedad de Beds24 tiene varias habitaciones, usa el ID de esta unidad.',
    }),
    defineField({
      name: 'idHostaway',
      title: 'Id hostaway (ya no se usa)',
      type: 'number',
      group: 'distribution',
      hidden: true,
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'content',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Ubicación',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'address',
      title: 'Dirección Exacta',
      type: 'string',
      group: 'content',
      description: 'Dirección completa, e.g., Avenida Las Higueras 671...',
    }),
    defineField({
      name: 'wifiName',
      title: 'Nombre de red WiFi',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'wifiPassword',
      title: 'Clave de WiFi',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'tower',
      title: 'Torre o Edificio',
      type: 'string',
      group: 'content',
      description: 'Solo si aplica, e.g., 2',
    }),
    defineField({
      name: 'parkingInfo',
      title: 'Estacionamiento',
      type: 'string',
      group: 'content',
      description: 'Número de estacionamiento, e.g., 401',
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline (Frase Corta)',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'gallery',
      title: 'Galería de Imágenes',
      type: 'array',
      group: 'content',
      of: [{ type: 'image', options: { hotspot: true, metadata: ['source'] } }],
    }),
    defineField({
      name: 'description',
      title: 'Descripción Detallada',
      type: 'array',
      group: 'content',
      of: [{ type: 'block' }, { type: 'image' }],
    }),
    defineField({
      name: 'capacity',
      title: 'Capacidad',
      type: 'number',
      group: 'content',
    }),
    defineField({
      name: 'amenities',
      title: 'Servicios',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      options: {
        // layout 'list' crea lista cerrada (no permite texto libre)
        layout: 'list',
        list: [
          { title: 'Calefacción', value: 'Calefacción' },
          { title: 'Chimenea', value: 'Chimenea' },
          { title: 'WiFi', value: 'WiFi' },
          { title: 'Smart TV', value: 'Smart TV' },
          { title: 'Cocina equipada', value: 'Cocina equipada' },
          { title: 'Vista al mar', value: 'Vista al mar' },
          { title: 'Piscina', value: 'Piscina' },
          { title: 'Jacuzzi', value: 'Jacuzzi' },
          { title: 'Pet Friendly', value: 'Pet Friendly' },
          { title: 'Estacionamiento', value: 'Estacionamiento' },
        ]
      },
      validation: Rule => Rule.unique()
    }),
    defineField({
      name: 'bookingWidgetCode',
      title: 'Booking Widget Code',
      type: 'text',
      group: 'content',
      rows: 5,
    }),
    defineField({
      name: 'bedrooms',
      title: 'Dormitorios',
      type: 'number',
      group: 'content',
      description: 'Cantidad de piezas/dormitorios',
      validation: (Rule) => Rule.min(0).max(20),
    }),
    defineField({
      name: 'bathrooms',
      title: 'Baños',
      type: 'number',
      group: 'content',
      description: 'Cantidad de baños',
      validation: (Rule) => Rule.min(0).max(20),
    }),

    defineField({
      name: 'basePrice',
      title: 'Precio desde (CLP por noche)',
      type: 'number',
      group: 'content',
      description: 'Se muestra como "Desde $X/noche" en la ficha. Déjalo vacío para no mostrar precio.',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'seasonalAdjustments',
      title: 'Ajustes por temporada',
      type: 'array',
      group: 'content',
      description: 'Multiplica el precio desde en ciertas fechas (ej: 1.3 en verano).',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'season', title: 'Temporada', type: 'string' },
            { name: 'multiplier', title: 'Multiplicador', type: 'number' },
            { name: 'start', title: 'Desde', type: 'date' },
            { name: 'end', title: 'Hasta', type: 'date' },
          ],
        },
      ],
    }),
    defineField({
      name: 'rating',
      title: 'Calificación en Airbnb',
      type: 'number',
      group: 'distribution',
      description: 'Ej: 4.93. Se muestra en la tarjeta y la ficha.',
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: 'reviewCount',
      title: 'Número de reseñas en Airbnb',
      type: 'number',
      group: 'distribution',
      validation: (Rule) => Rule.min(0),
    }),

    // --- Campos de SEO ---
    defineField({
      name: 'metaTitle',
      title: 'Meta Título (SEO)',
      description:
        'Título para buscadores (Google) y redes sociales. Idealmente 50-60 caracteres. Si se deja en blanco, se usará el nombre de la propiedad.',
      type: 'string',
      group: 'seo',
      validation: (Rule) => Rule.max(60),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Descripción (SEO)',
      description:
        'Descripción para buscadores. Idealmente 150-160 caracteres. Si se deja en blanco, se usará el tagline.',
      type: 'text',
      group: 'seo',
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    // mover enlaces a nuevo grupo
    defineField({
      name: 'airbnbListingUrl',
      title: 'URL en Airbnb (anuncio)',
      type: 'url',
      group: 'distribution',
    }),
    defineField({
      name: 'airbnbProfileUrl',
      title: 'Perfil Superhost (opcional)',
      type: 'url',
      group: 'distribution',
    }),
  ],
})

