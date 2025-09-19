import property from './property'
import blogPost from './blogPost'
import testimonial from './testimonial' // <-- Importamos el nuevo esquema
import page from './page'
import settings from './settings' // <-- Importamos el esquema de configuración

// Agregamos el nuevo esquema al array para que aparezca en el Studio
export const schemaTypes = [property, testimonial, blogPost, page, settings]