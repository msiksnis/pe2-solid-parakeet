import { Venue } from "@/lib/types";

export const CONTINENT_FILTERS = [
  "africa",
  "asia",
  "europe",
  "north-america",
  "oceania",
  "south-america",
] as const;

export type Continent =
  | "africa"
  | "asia"
  | "europe"
  | "north-america"
  | "south-america"
  | "oceania";

interface ContinentConfig {
  displayName: string;
  continents: string[];
}

export const CONTINENT_CONFIG: Record<Continent, ContinentConfig> = {
  africa: {
    displayName: "Africa",
    continents: ["Africa"],
  },
  asia: {
    displayName: "Asia",
    continents: ["Asia"],
  },
  europe: {
    displayName: "Europe",
    continents: ["Europe"],
  },
  "north-america": {
    displayName: "North America",
    continents: ["North America"],
  },
  "south-america": {
    displayName: "South America",
    continents: ["South America"],
  },
  oceania: {
    displayName: "Oceania",
    continents: ["Oceania", "Australia"],
  },
};

export function filterVenuesByContinent(
  venues: Venue[],
  filter: Continent | "all",
): Venue[] {
  if (filter === "all") {
    return venues;
  }

  const config = CONTINENT_CONFIG[filter];
  if (!config) {
    return venues;
  }

  return venues.filter((venue) => {
    if (!venue.location.continent) return false;
    return config.continents.includes(venue.location.continent);
  });
}
