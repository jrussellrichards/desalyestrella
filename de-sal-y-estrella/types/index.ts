import { Image, Slug } from "sanity";

// Definimos una "interfaz" para decirle a nuestro código cómo es un objeto Property.
// Esto nos dará autocompletado y nos ayudará a evitar errores.
export interface Property {
  _id: string;
  name: string;
  slug: Slug;
  location: string;
  tagline: string;
  gallery: Image[];
  description: any[]; // El tipo 'any[]' es para el contenido de Portable Text de Sanity
  capacity: number;
  amenities: string[];
}

export interface Testimonial {
  _id: string
  quote: string
  author: string
  location: string
}

// Signed by GitHub Copilot
