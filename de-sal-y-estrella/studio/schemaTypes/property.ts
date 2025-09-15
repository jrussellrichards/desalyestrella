import {defineField, defineType} from 'sanity'
import {LinkIcon} from '@sanity/icons'

export default defineType({
  name: 'property',
  title: 'Property',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'A short, catchy phrase for the property (e.g., "Tu refugio de surf en Pichilemu")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
            // Esta es la nueva configuración. Añade la opción de pegar una URL.
            sources: [
              {
                name: 'url',
                title: 'Pegar URL de la imagen',
                icon: LinkIcon,
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'capacity',
      title: 'Capacity',
      type: 'number',
    }),
    defineField({
      name: 'amenities',
      title: 'Amenities',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'bookingWidgetCode',
      title: 'Booking Widget Code',
      type: 'text',
      description: 'Paste the full widget code from Hostaway here.',
    }),
  ],
})

