import { Venue } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { fetchVenues } from "../queries/fetchVenues";
import { filterVenuesForGroups, ForGroups } from "./filterVenuesForGroups";

type UseFilteredVenuesReturn = {
  filteredVenues: Venue[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useFilteredVenuesGroups(
  filter: ForGroups | "all",
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

  const filteredVenues = useMemo(() => {
    return filterVenuesForGroups(venues, filter).filter(
      (venue) => venue.maxGuests >= 6,
    );
  }, [venues, filter]);

  return {
    filteredVenues,
    isLoading,
    isError,
    refetch,
    error: isError ? error : null,
  };
}
