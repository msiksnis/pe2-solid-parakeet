import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { Venue } from "@/lib/types";
import { fetchVenues } from "./queries/fetchVenues";
import { Continent, filterVenuesByContinent } from "./filterVenuesByContinent";

type UseFilteredVenuesReturn = {
  filteredVenues: Venue[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useFilteredVenuesContinent(
  filter: Continent | "all",
): UseFilteredVenuesReturn {
  const {
    data: venues = [],
    isError,
    isLoading,
    error,
    refetch,
  } = useQuery<Venue[], Error>({
    queryKey: ["venues"],
    queryFn: fetchVenues,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  console.log(venues);

  const filteredVenues = useMemo(() => {
    return filterVenuesByContinent(venues, filter);
  }, [venues, filter]);

  return {
    filteredVenues,
    isLoading,
    isError,
    refetch,
    error: isError ? error : null,
  };
}
