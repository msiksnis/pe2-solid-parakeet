import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Venue } from "@/lib/types";
import { axiosInstance } from "@/lib/axiosInstance";
import { Continent, filterVenuesByContinent } from "./filterVenuesByContinent";

type UseFilteredVenuesReturn = {
  filteredVenues: Venue[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
};

export function useFilteredVenues(
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
    queryFn: () => axiosInstance.get("/venues").then((res) => res.data.data),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

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
