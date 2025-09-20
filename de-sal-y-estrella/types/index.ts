import { Image, Slug, PortableTextBlock } from "sanity";

// Definimos una "interfaz" para decirle a nuestro código cómo es un objeto Property.
// Esto nos dará autocompletado y nos ayudará a evitar errores.
export type Amenity =
  | 'Calefacción'
  | 'Chimenea'
  | 'WiFi'
  | 'Smart TV'
  | 'Cocina equipada'
  | 'Vista al mar'
  | 'Piscina'
  | 'Jacuzzi'
  | 'Pet Friendly'
  | 'Estacionamiento'

export interface Property {
  _id: string;
  name: string;
  slug: Slug;
  location: string;
  tagline: string;
  gallery?: (import('sanity').Image & { alt?: string; _key?: string })[]; // tipado estricto
  description: PortableTextBlock[];
  capacity: number;
  amenities?: Amenity[]
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
  bedrooms?: number;         // nueva
  bathrooms?: number;        // nueva
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

export interface GlobalSettings {
  airbnbProfileUrl?: string;
  siteLogo?: {
    asset: { _ref: string; _type: string };
    alt?: string;
  };
  contactEmail?: string;
  phone?: string;
  whatsappNumber?: string;
  instagramUrl?: string;
  address?: string;
  location?: { lat?: number; lng?: number };
  businessHours?: string[];
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: {
    asset?: { _ref: string; _type: string };
    alt?: string;
  };
  whyUs?: {
    title?: string;
    description?: string;
    _key?: string;
  }[];
}