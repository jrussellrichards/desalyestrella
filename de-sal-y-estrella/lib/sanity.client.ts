import {createClient} from 'next-sanity'

// --- Configuración de Conexión ---
// Estas variables identifican tu proyecto de Sanity.
// Las obtienes desde manage.sanity.io
export const projectId = 'lkqqun1x'
export const dataset = 'production'
const apiVersion = '2023-05-03' // Usa una fecha reciente

// --- Cliente de Sanity ---
// Este es el objeto que usaremos para hacer peticiones de datos a Sanity.
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // `false` si quieres datos siempre frescos, `true` para mejor rendimiento
})

