import { FILTER_OPTIONS } from "./filterVenues";

export interface MediaObject {
  url: string;
  alt: string;
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

export interface Owner {
  name: string;
  email: string;
  bio: string;
  avatar: {
    url: string;
    alt: string;
  };
  banner: {
    url: string;
    alt: string;
  };
}

export interface Booking {
  id: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
  customer: Owner;
}

export interface Venue {
  id: string;
  name: string;
  description: string;
  media: MediaObject[];
  location: Location;
  price: number;
  maxGuests: number;
  rating: number;
  created: string;
  updated: string;
  meta: MetaData;
  owner?: Owner;
  bookings?: Booking[];
  _count: {
    bookings: number;
  };
}

export interface ApiMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}

export interface VenuesApiResponse {
  data: Venue[];
  meta: ApiMeta;
}

export interface AllVenuesProps {
  data: Venue[];
  nextPage?: number | null;
}

export type FilterOption = (typeof FILTER_OPTIONS)[number];
