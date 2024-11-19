import { Venue } from "@/lib/types";

export const FOR_TABS_FILTERS = [
  "cabins",
  "sunny-beaches",
  "mountain-views",
] as const;

export const VALID_FILTERS: (ForTabs | "all")[] = [
  "all",
  "cabins",
  "sunny-beaches",
  "mountain-views",
];

export type ForTabs = "cabins" | "sunny-beaches" | "mountain-views";

interface ForTabsConfig {
  displayName: string;
  keyword: string[];
}

export const FOR_TABS_CONFIG: Record<ForTabs, ForTabsConfig> = {
  cabins: {
    displayName: "Cabins",
    keyword: ["cabin", "hytte", "cottage", "hut", "chalet"],
  },
  "sunny-beaches": {
    displayName: "Sunny Beaches",
    keyword: [
      "beach",
      "sand",
      "sea",
      "ocean",
      "water",
      "boat",
      "fish",
      "coastal",
    ],
  },
  "mountain-views": {
    displayName: "Mountain Views",
    keyword: ["mountain", "woods", "alpine", "hill", "peak"],
  },
};

export function filterVenuesForTabs(
  venues: Venue[],
  filter: ForTabs | "all",
): Venue[] {
  if (filter === "all") {
    return venues;
  }

  const config = FOR_TABS_CONFIG[filter];
  if (!config) {
    return venues;
  }

  return venues.filter((venue) => {
    if (!venue.name || !venue.description) return false;
    return config.keyword.some((keyword) => {
      const name = venue.name.toLowerCase();
      const description = venue.description.toLowerCase();
      return name.includes(keyword) || description.includes(keyword);
    });
  });
}

export type FOR_TABS_FILTERS = (typeof FOR_TABS_FILTERS)[number];
