// /lib/filterVenues.ts

import { Venue } from "./types";

export const FILTER_OPTIONS = [
  "cabins",
  "sunny-beaches",
  "mountain-views",
] as const;

export function filterAllVenues(venues: Venue[]): Venue[] {
  // Simply return all venues
  return venues;
}

export function filterCabins(venues: Venue[]): Venue[] {
  const keywords = ["cabin", "hytte", "cottage", "hut", "chalet"];
  return venues.filter((venue) => {
    if (!venue.name && !venue.description) return false;
    return keywords.some(
      (keyword) =>
        venue.name?.toLowerCase().includes(keyword) ||
        venue.description?.toLowerCase().includes(keyword),
    );
  });
}

export function filterSunnyBeaches(venues: Venue[]): Venue[] {
  const keywords = [
    "beach",
    "sand",
    "sunny",
    "see",
    "ocean",
    "water",
    "boat",
    "fish",
    "coastal",
  ];
  return venues.filter((venue) => {
    if (!venue.name && !venue.description) return false;
    return keywords.some(
      (keyword) =>
        venue.name?.toLowerCase().includes(keyword) ||
        venue.description?.toLowerCase().includes(keyword),
    );
  });
}

export function filterMountainViews(venues: Venue[]): Venue[] {
  const keywords = ["mountain", "woods", "alpine", "hill", "peak"];
  return venues.filter((venue) => {
    if (!venue.name && !venue.description) return false;
    return keywords.some(
      (keyword) =>
        venue.name?.toLowerCase().includes(keyword) ||
        venue.description?.toLowerCase().includes(keyword),
    );
  });
}
