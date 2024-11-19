import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { Venue } from "@/lib/types";
import { useScreenSizes } from "@/lib/utils";
import { fetchVenues } from "../queries/fetchVenues";
import {
  filterVenuesForTabs,
  ForTabs,
  VALID_FILTERS,
} from "./filterVenuesForTabs";

type UseFilteredVenuesReturn = {
  filteredVenues: Venue[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useFilteredVenuesForTabs(
  filter: ForTabs | "all",
): UseFilteredVenuesReturn {
  const { isMobile, isMedium, isExtraLarge } = useScreenSizes();
  const sliceCount = isMobile ? 8 : isMedium ? 9 : isExtraLarge ? 12 : 12;

  function isValidFilter(filter: string): filter is ForTabs | "all" {
    return VALID_FILTERS.includes(filter as ForTabs | "all");
  }

  // Validate the filter before proceeding
  const validatedFilter = isValidFilter(filter) ? filter : "all";

  const {
    data: venues = [],
    isError,
    isLoading,
    error,
    refetch,
  } = useQuery<Venue[], Error>({
    queryKey: ["venues", validatedFilter], // Include the filter in the query key
    queryFn: fetchVenues,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const filteredVenues = useMemo(() => {
    return filterVenuesForTabs(venues, validatedFilter)
      .sort((a, b) => {
        if (a.location.city && !b.location.city) return -1;
        if (!a.location.city && b.location.city) return 1;

        return b.created?.localeCompare(a.created || "") || 0;
      })
      .slice(0, sliceCount);
  }, [venues, validatedFilter, sliceCount]);

  return {
    filteredVenues,
    isLoading,
    isError,
    refetch,
    error: isError ? error : null,
  };
}
