'use client'

import { PortableText, PortableTextComponents } from '@portabletext/react'
import Image from 'next/image'
import { urlFor } from '@/lib/image'

// Definimos los componentes personalizados que se usarán para renderizar cada tipo de bloque.
const components: PortableTextComponents = {
  block: {
    // Párrafo normal: le aplicamos un margen inferior para crear el espaciado.
    normal: ({ children }) => <p className="mb-6 leading-7">{children}</p>,

    // Subtítulo H2: lo estilizamos como el párrafo principal que diseñamos.
    h2: ({ children }) => (
      <h2 className="mb-6 text-xl leading-8 text-gray-600 dark:text-gray-300">
        {children}
      </h2>
    ),
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

// Este es el componente que usarás en tus páginas.
export function StyledPortableText({ value }: { value: any[] }) {
  return <PortableText value={value} components={components} />
}
