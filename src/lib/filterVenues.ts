import { Venue } from "./types";

export const FILTER_OPTIONS = [
  "cabins",
  "sunny-beaches",
  "mountain-views",
  "summer-escape",
  "explore-mountains",
] as const;

export function filterAllVenues(venues: Venue[]): Venue[] {
  // Simply return all venues
  return venues;
}

export function filterCabins(venues: Venue[]): Venue[] {
  const keywords = ["cabin", "hytte", "cottage", "hut", "chalet"];
  return venues.filter((venue) => {
    if (!venue.name) return false;
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
    "see",
    "ocean",
    "water",
    "boat",
    "fish",
    "coastal",
  ];
  return venues.filter((venue) => {
    if (!venue.name) return false;
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
    if (!venue.name) return false;
    return keywords.some(
      (keyword) =>
        venue.name?.toLowerCase().includes(keyword) ||
        venue.description?.toLowerCase().includes(keyword),
    );
  });
}

// New function for filtering summer venues for large groups
export function filterSummerVenues(venues: Venue[]): Venue[] {
  const keywords = ["summer", "sun", "warm", "hot", "pool", "swim", "bbq"];
  return venues.filter((venue) => {
    if (!venue.name) return false;
    return keywords.some(
      (keyword) =>
        venue.name?.toLowerCase().includes(keyword) ||
        venue.description?.toLowerCase().includes(keyword),
    );
  });
}

// New function for filtering mountain venues for large groups
export function filterMountainVenues(venues: Venue[]): Venue[] {
  const keywords = ["mountain", "woods", "alpine", "hill", "peak"];
  return venues.filter((venue) => {
    if (!venue.name) return false;
    return keywords.some(
      (keyword) =>
        venue.name?.toLowerCase().includes(keyword) ||
        venue.description?.toLowerCase().includes(keyword),
    );
  });
}

export function filterVenuesByType(
  filter: string | null,
  venues: Venue[],
): Venue[] {
  switch (filter) {
    case "cabins":
      return filterCabins(venues);
    case "sunny-beaches":
      return filterSunnyBeaches(venues);
    case "mountain-views":
      return filterMountainViews(venues);
    case "summer-escape":
      return filterSummerVenues(venues);
    case "explore-mountains":
      return filterMountainVenues(venues);
    default:
      return venues;
  }
}
