import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { fetchVenues } from "../queries/fetchVenues";
import { Venue } from "@/lib/types.ts";
import VenueCardSM from "@/components/VenueCardSM";
import { Route } from "@/routes";
import { FilterOption } from "../../../lib/types";
import { filterVenuesByType } from "@/lib/filterVenues";
import TabsBar from "@/components/TabsBar";
import CardMD from "./CardMD";
import { useScreenSizes } from "@/lib/utils";
import Loader from "@/components/loader";

export default function PopularByType() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { filter } = Route.useSearch();
  const filterValue = filter ?? null;

  const { isMobile, isMedium, isExtraLarge } = useScreenSizes();
  const sliceCount = isMobile ? 4 : isMedium ? 6 : isExtraLarge ? 8 : 12;

  // Handles filter change, uses null for "All Venues"
  const handleFilterChange = useCallback(
    (newFilter: FilterOption | null) => {
      navigate({
        search: (prev) => {
          const updatedSearch = { ...prev };

          if (newFilter) {
            updatedSearch.filter = newFilter;
          } else {
            delete updatedSearch.filter;
          }

          return updatedSearch;
        },
      });
    },
    [navigate],
  );

  const {
    data: venues = [],
    isError,
    isFetching,
  } = useQuery<Venue[]>({
    queryKey: ["venues"],
    queryFn: () => fetchVenues(),
    staleTime: 1000 * 60 * 5,
  });

  if (isError) return <p>Something went wrong...</p>;

  const filteredVenues = filterVenuesByType(filterValue, venues);

  const sortedVenues = [...filteredVenues]
    .filter((venue) => venue.rating >= 2)
    .sort((a, b) => {
      if (a.location.city && !b.location.city) return -1;
      if (!a.location.city && b.location.city) return 1;

      return a.name?.localeCompare(b.name || "") || 0;
    })
    .slice(0, sliceCount);

  return (
    <>
      <TabsBar
        filter={filter || null}
        handleFilterChange={handleFilterChange}
      />
      {isFetching ? (
        <Loader className="mt-24" />
      ) : (
        <>
          <VenueCardSM
            key={filter || "all"}
            venues={sortedVenues}
            currentFilter={filter || "all"}
          />
          <CardMD />
        </>
      )}
    </>
  );
}
