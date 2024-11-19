import { Venue } from "./types";

export const FILTER_OPTIONS = [
  "cabins",
  "sunny-beaches",
  "mountain-views",
  "summer-escape",
  "explore-mountains",
] as const;

export const CONTINENT_FILTERS = [
  "africa",
  "asia",
  "europe",
  "north-america",
  "oceania",
  "south-america",
] as const;

type ContinentFilter =
  | "africa"
  | "asia"
  | "europe"
  | "north-america"
  | "oceania"
  | "south-america";

const CONTINENT_MAP: Record<ContinentFilter, string[]> = {
  africa: ["Africa"],
  asia: ["Asia"],
  europe: ["Europe"],
  "north-america": ["North America"],
  oceania: ["Oceania", "Australia"],
  "south-america": ["South America"],
};

export function filterAllVenues(venues: Venue[]): Venue[] {
  return venues;
}

export function filterCabins(venues: Venue[]): Venue[] {
  const keywords = ["cabin", "hytte", "cottage", "hut", "chalet"];
  return venues.filter((venue) => {
    if (!venue.name) return false;
    const name = venue.name.toLowerCase();
    const description = venue.description?.toLowerCase() || "";
    return keywords.some(
      (keyword) => name.includes(keyword) || description.includes(keyword),
    );
  });
}

export function filterSunnyBeaches(venues: Venue[]): Venue[] {
  const keywords = [
    "beach",
    "sand",
    "sea",
    "ocean",
    "water",
    "boat",
    "fish",
    "coastal",
  ];
  return venues.filter((venue) => {
    if (!venue.name) return false;
    const name = venue.name.toLowerCase();
    const description = venue.description?.toLowerCase() || "";
    return keywords.some(
      (keyword) => name.includes(keyword) || description.includes(keyword),
    );
  });
}

export function filterMountainViews(venues: Venue[]): Venue[] {
  const keywords = ["mountain", "woods", "alpine", "hill", "peak"];
  return venues.filter((venue) => {
    if (!venue.name) return false;
    const name = venue.name.toLowerCase();
    const description = venue.description?.toLowerCase() || "";
    return keywords.some(
      (keyword) => name.includes(keyword) || description.includes(keyword),
    );
  });
}

export function filterSummerVenues(venues: Venue[]): Venue[] {
  const keywords = ["summer", "sun", "warm", "hot", "pool", "swim", "bbq"];
  return venues.filter((venue) => {
    if (!venue.name) return false;
    const name = venue.name.toLowerCase();
    const description = venue.description?.toLowerCase() || "";
    return keywords.some(
      (keyword) => name.includes(keyword) || description.includes(keyword),
    );
  });
}

export function filterMountainVenues(venues: Venue[]): Venue[] {
  const keywords = ["mountain", "woods", "alpine", "hill", "peak"];
  return venues.filter((venue) => {
    if (!venue.name) return false;
    const name = venue.name.toLowerCase();
    const description = venue.description?.toLowerCase() || "";
    return keywords.some(
      (keyword) => name.includes(keyword) || description.includes(keyword),
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

export function filterByContinent(venues: Venue[], filter: string): Venue[] {
  const normalizedFilter = filter.toLowerCase() as ContinentFilter;
  const continents = CONTINENT_MAP[normalizedFilter];

  if (!continents) {
    return venues;
  }

  return venues.filter((venue) => {
    if (!venue.location.continent) return false;
    return continents.includes(venue.location.continent);
  });
}
