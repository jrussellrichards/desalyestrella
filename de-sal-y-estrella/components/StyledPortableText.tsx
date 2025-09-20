'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/image'
import { PortableTextBlock } from 'sanity'

// Definimos los componentes personalizados que se usarán para renderizar cada tipo de bloque.
const components: PortableTextComponents = {
  block: {
    // Párrafo normal: le aplicamos un margen inferior para crear el espaciado.
    normal: ({ children }) => (
      <p className="mb-6 max-w-prose text-[0.97rem] leading-[1.55] text-ink-subtle dark:text-ink-dark-subtle">
        {children}
      </p>
    ),

    // Subtítulo H2: lo estilizamos como el párrafo principal que diseñamos.
    h2: ({ children }) => (
      <h2 className="mt-10 mb-4 font-display text-h3 font-semibold text-ink dark:text-white">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 font-display text-[1.1rem] font-semibold text-ink dark:text-white">
        {children}
      </h3>
    )
  },
  // Añadimos un componente para renderizar imágenes insertadas en el texto.
  types: {
    image: ({ value }) => (
      <div className="relative my-8 aspect-video w-full overflow-hidden rounded-lg shadow-md">
        <Image
          src={urlFor(value).url()}
          alt={value.alt || 'Imagen del artículo'}
          fill
          className="object-cover"
        />
      </div>
    ),
  },
}

// --- CORRECCIÓN ---
// Cambiamos la exportación nombrada por una exportación por defecto.
export default function StyledPortableText({
  value,
}: {
  value: PortableTextBlock[]
}) {
  return <PortableText value={value} components={components} />
}

