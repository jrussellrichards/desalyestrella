import { Image, Slug,PortableTextBlock } from "sanity";

// Definimos una "interfaz" para decirle a nuestro código cómo es un objeto Property.
// Esto nos dará autocompletado y nos ayudará a evitar errores.
export interface Property {
  _id: string;
  name: string;
  slug: Slug;
  location: string;
  tagline: string;
  gallery: Image[]; // Podría ser opcional si aún no se cargan imágenes
  description: any[]; // Portable Text blocks
  capacity: number;
  amenities: string[];
  bookingWidgetCode?: string; // Código embebido para el widget de reservas
  // Campos de pricing
  basePrice?: number; // precio base por noche
  seasonalAdjustments?: {
    season: string;
    multiplier?: number;
    start?: string;
    end?: string;
  }[];
  airbnbListingUrl?: string; // nueva
  airbnbProfileUrl?: string; // nueva
}

export interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  location: string;
  rating?: number; // ahora opcional
  property?: {
    name: string
    slug: {
      current: string
    }
  };
}


export interface BlogPost {
  _id: string;
  title: string;
  slug: Slug;
  publishedAt: string;
  excerpt: string;
  body: PortableTextBlock[];
  mainImage: Image;
}