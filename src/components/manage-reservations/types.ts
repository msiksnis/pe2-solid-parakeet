export interface Media {
  url: string;
  alt: string;
}

export interface Location {
  address: string;
  city: string;
  continent: string | null;
  country: string;
  lat: number | null;
  lng: number | null;
  zip: string;
}

export interface Meta {
  breakfast: boolean;
  parking: boolean;
  pets: boolean;
  wifi: boolean;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  maxGuests: number;
  media: Media[];
  location: Location;
  meta: Meta;
  created: string;
  updated: string;
}

export interface Reservation {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  venue: Venue | string;
}
