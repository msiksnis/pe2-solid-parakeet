import { Venue } from "@/lib/types";

export type ForGroups = "summer-escape" | "explore-mountains";

interface ForGroupsConfig {
  displayName: string;
  keyword: string[];
}

export const FOR_GROUPS_CONFIG: Record<ForGroups, ForGroupsConfig> = {
  "summer-escape": {
    displayName: "Summer Escape",
    keyword: ["summer", "sun", "warm", "hot", "pool", "swim", "bbq"],
  },
  "explore-mountains": {
    displayName: "Explore Mountains",
    keyword: ["mountain", "woods", "alpine", "hill", "peak"],
  },
};

export function filterVenuesForGroups(
  venues: Venue[],
  filter: ForGroups | "all",
): Venue[] {
  if (filter === "all") {
    return venues;
  }

  const config = FOR_GROUPS_CONFIG[filter];
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
