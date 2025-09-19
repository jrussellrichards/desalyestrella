import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Configuración Global',
  type: 'document',
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
  ]
})