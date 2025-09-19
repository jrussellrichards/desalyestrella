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
    // agrega otros campos globales aquí (logo, social, etc.)
  ]
})