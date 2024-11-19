import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

import { fetchVenues } from "../queries/fetchVenues";
import { Venue } from "@/lib/types.ts";
import VenueCardSM from "@/components/VenueCardSM";
import { Route } from "@/routes";
import { FilterOption } from "../../../lib/types";
import { filterVenuesByType } from "@/lib/filterVenues";
import TabsBar from "@/components/TabsBar";
import { useScreenSizes } from "@/lib/utils";
import MainLoader from "@/components/MainLoader";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function PopularByType() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { filter } = Route.useSearch();
  const filterValue = filter ?? null;

  const { isMobile, isMedium, isExtraLarge } = useScreenSizes();
  const sliceCount = isMobile ? 8 : isMedium ? 9 : isExtraLarge ? 12 : 12;

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
        resetScroll: false,
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
    .filter((venue) => venue.rating >= 0)
    .sort((a, b) => {
      if (a.location.city && !b.location.city) return -1;
      if (!a.location.city && b.location.city) return 1;

      return b.created?.localeCompare(a.created || "") || 0;
    })
    .slice(0, sliceCount);

  return (
    <div>
      <TabsBar
        filter={filter || null}
        handleFilterChange={handleFilterChange}
      />
      {isFetching ? (
        <MainLoader className="mt-24" />
      ) : (
        <>
          <VenueCardSM
            key={filter || "all"}
            venues={sortedVenues}
            currentFilter={filter || "all"}
          />
          <Link
            to={"/all-venues"}
            className="mr-2 mt-4 flex items-center justify-end hover:motion-translate-x-out-[5px]"
          >
            <Button
              variant={"linkHover1"}
              className="px-0 text-base after:w-full"
            >
              See all Venues
            </Button>
            <ChevronRight className="ml-1 size-5" />
          </Link>
        </>
      )}
    </div>
  );
}
