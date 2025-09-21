import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Configuración Global',
  type: 'document',
  groups: [
    { name: 'general', title: 'General' },
    { name: 'marketing', title: 'Marketing' },
  ],
  fields: [
    defineField({
      name: 'airbnbProfileUrl',
      title: 'Perfil Airbnb (Superhost)',
      type: 'url',
      validation: (Rule) => Rule.uri({scheme: ['http','https']})
    }),
    defineField({
      name: 'siteLogo',
      title: 'Logo principal',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Texto alternativo',
          validation: (Rule) => Rule.required().warning('Importante para accesibilidad')
        }
      ]
    }),
    defineField({
      name: 'contactEmail',
      title: 'Email de contacto',
      type: 'string',
      validation: Rule => Rule.email().warning('Debe ser un email válido')
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono (visual)',
      type: 'string',
      description: 'Formato legible: +56 9 1234 5678'
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp (solo dígitos con código país)',
      type: 'string',
      description: 'Ej: 56912345678'
    }),
    defineField({
      name: 'instagramUrl',
      title: 'URL Instagram',
      type: 'url'
    }),
    defineField({
      name: 'address',
      title: 'Dirección (texto)',
      type: 'string'
    }),
    defineField({
      name: 'location',
      title: 'Coordenadas',
      type: 'object',
      fields: [
        { name: 'lat', type: 'number', title: 'Latitud' },
        { name: 'lng', type: 'number', title: 'Longitud' }
      ]
    }),
    defineField({
      name: 'businessHours',
      title: 'Horario (array)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Ej: L-V 9:00–18:00'
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero – Título',
      type: 'string',
      group: 'marketing'
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero – Subtítulo',
      type: 'text',
      rows: 3,
      group: 'marketing'
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero – Imagen de fondo',
      type: 'image',
      options: { hotspot: true },
      group: 'marketing'
    }),
    defineField({
      name: 'whyUs',
      title: 'Razones ¿Por qué nosotros?',
      type: 'array',
      group: 'marketing',
      of: [{
        type: 'object',
        fields: [
          { name: 'title', title: 'Título', type: 'string' },
          { name: 'description', title: 'Descripción', type: 'text', rows: 2 }
        ],
        preview: {
          select: { title: 'title', subtitle: 'description' }
        }
      }],
      validation: Rule => Rule.max(12)
    }),
    defineField({
      name: 'destinations',
      title: 'Destinos (Cards Home)',
      description: 'Configura las cards de destinos que aparecen en la home',
      type: 'array',
      group: 'marketing',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Título', type: 'string', validation: Rule => Rule.required() },
            { name: 'slugParam', title: 'Parámetro ?l=', type: 'string', description: 'Ej: Pichilemu / La Serena', validation: Rule => Rule.required() },
            { name: 'description', title: 'Descripción', type: 'text', rows: 2 },
            { name: 'image', title: 'Imagen', type: 'image', options: { hotspot: true }, validation: Rule => Rule.required() }
          ],
          preview: {
            select: { title: 'title', media: 'image' }
          }
        }
      ],
      validation: Rule => Rule.max(8)
    }),
  ]
})