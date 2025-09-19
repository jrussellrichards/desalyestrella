import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonio',
  type: 'document',
  fields: [
    defineField({
      name: 'author',
      title: 'Autor',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Ubicación / Descripción del Huésped',
      description: 'Ej: "Huésped en Pichilemu"',
      type: 'string',
    }),
    // --- CAMPO AÑADIDO ---
    defineField({
      name: 'rating',
      title: 'Calificación (de 1 a 5)',
      type: 'number',
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    // --- CAMPO AÑADIDO ---
    defineField({
      name: 'property',
      title: 'Propiedad Asociada',
      description: 'Vincula este testimonio a una de tus propiedades.',
      type: 'reference',
      to: [{type: 'property'}],
    }),
    defineField({
      name: 'quote',
      title: 'Cita (El testimonio)',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'author',
      subtitle: 'quote',
    },
  },
})

