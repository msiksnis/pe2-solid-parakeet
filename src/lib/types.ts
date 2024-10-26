import { FILTER_OPTIONS } from "./filterVenues";

export interface MediaObject {
  url: string;
  alt?: string;
}

export interface MetaData {
  wifi: boolean;
  parking: boolean;
  breakfast: boolean;
  pets: boolean;
}

export interface Location {
  address: string | null;
  city: string | null;
  zip: string | null;
  country: string | null;
  continent: string | null;
  lat: number | null;
  lng: number | null;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  media: MediaObject[];
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: MetaData;
  location: Location;
}

export type FilterOption = (typeof FILTER_OPTIONS)[number];
