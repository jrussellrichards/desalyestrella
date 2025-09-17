import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Título del Artículo',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagen Principal',
      type: 'image',
      options: {
        hotspot: true, // Permite seleccionar un punto de enfoque en la imagen
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de Publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Extracto (Resumen Corto)',
      description:
        'Un resumen de 1-2 frases para la vista previa del artículo.',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(200).required(),
    }),
    defineField({
      name: 'body',
      title: 'Cuerpo del Artículo',
      type: 'array', // Usamos 'array' para el editor de texto enriquecido (Portable Text)
      of: [
        {
          type: 'block', // Párrafos de texto, títulos, etc.
        },
        {
          type: 'image', // Permite insertar imágenes dentro del artículo
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
    },
  },
})

