import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'property',
  title: 'Propiedad',
  type: 'document',
  groups: [
    {name: 'content', title: 'Contenido Principal', default: true},
    {name: 'seo', title: 'SEO'},
    {name: 'distribution', title: 'Canales / Externo'}, // nuevo grupo
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
      of: [{type: 'image', options: {hotspot: true, metadata: ['source']}}],
    }),
    defineField({
      name: 'description',
      title: 'Descripción Detallada',
      type: 'array',
      group: 'content',
      of: [{type: 'block'}, {type: 'image'}],
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
      of: [{type: 'string'}],
      options: {layout: 'tags'},
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

