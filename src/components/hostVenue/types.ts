export interface Media {
  url: string;
  alt: string;
}

export interface Meta {
  wifi?: boolean;
  parking?: boolean;
  breakfast?: boolean;
  pets?: boolean;
}

export interface Location {
  address?: string | null;
  city?: string | null;
  zip?: string | null;
  country?: string | null;
  continent?: string | null;
  lat?: number;
  lng?: number;
}

export interface Venue {
  name: string;
  description: string;
  media?: Media[];
  price: number;
  maxGuests: number;
  rating?: number;
  meta?: Meta;
  location?: Location;
}
