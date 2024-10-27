import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useMediaQuery } from "react-responsive";

import axiosInstance from "@/lib/axiosInstance.ts";
import { Venue } from "@/lib/types.ts";
import VenueCardSM from "@/components/VenueCardSM";
import { Route } from "@/routes";
import { FilterOption } from "../../../lib/types";
import {
  filterAllVenues,
  filterCabins,
  filterMountainViews,
  filterSunnyBeaches,
} from "@/lib/filterVenues";
import TabsBar from "@/components/TabsBar";

const fetchVenues = async (): Promise<Venue[]> => {
  try {
    const { data } = await axiosInstance.get("/venues");
    return data.data;
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out");
    } else {
      console.error("An error occurred", error);
    }
    throw error;
  }
};

export default function PopularByType() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { filter } = Route.useSearch();

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isMedium = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1279px)",
  });
  const isExtraLarge = useMediaQuery({
    query: "(min-width: 1280px) ",
  });

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

  console.log("all venues:", venues);

  if (isFetching) return <p>Loading...</p>;

  if (isError) return <p>Something went wrong...</p>;

  const filteredVenues = (() => {
    switch (filter) {
      case "cabins":
        return filterCabins(venues);
      case "sunny-beaches":
        return filterSunnyBeaches(venues);
      case "mountain-views":
        return filterMountainViews(venues);
      default:
        return filterAllVenues(venues);
    }
  })();

  const sortedVenues = [...filteredVenues]
    .filter((venue) => venue.rating >= 2)
    .sort((a, b) => {
      if (a.location.city && !b.location.city) return -1;
      if (!a.location.city && b.location.city) return 1;

      return a.name?.localeCompare(b.name || "") || 0;
    })
    .slice(0, sliceCount); // Slice based on screen size

  return (
    <>
      <TabsBar
        filter={filter || null}
        handleFilterChange={handleFilterChange}
      />
      <VenueCardSM
        key={filter || "all"}
        venues={sortedVenues}
        currentFilter={filter || "all"}
      />
    </>
  );
}
