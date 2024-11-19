import { Link, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { ChevronRight } from "lucide-react";

import ErrorLoadingButton from "@/components/ErrorLoadingButton";
import MainLoader from "@/components/MainLoader";
import TabsBar from "@/components/TabsBar";
import { Button } from "@/components/ui/button";
import VenueCardSM from "@/components/VenueCardSM";
import { Route } from "@/routes";
import {
  FOR_TABS_FILTERS,
  ForTabs,
  VALID_FILTERS,
} from "./filterVenuesForTabs";
import { useFilteredVenuesForTabs } from "./useFilteredVenuesForTabs";

export default function PopularByType() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { filter } = Route.useSearch();

  const filterValue = VALID_FILTERS.includes(filter as ForTabs | "all")
    ? (filter as ForTabs | "all")
    : "all";

  const { filteredVenues, isLoading, isError, error, refetch } =
    useFilteredVenuesForTabs(filterValue);

  const handleFilterChange = useCallback(
    (newFilter: FOR_TABS_FILTERS | null) => {
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

  const noVenueMessage =
    filterValue === "all"
      ? "Check back soon for new venues!"
      : "No venues found. Check back soon!";

  const errorMessage = isError
    ? `Error loading venues: ${error?.message}`
    : "An unexpected error occurred while loading the venues.";

  if (isError) {
    return <ErrorLoadingButton errorMessage={errorMessage} onRetry={refetch} />;
  }

  return (
    <div>
      <TabsBar filter={filterValue} handleFilterChange={handleFilterChange} />
      {isLoading && !filteredVenues.length ? (
        <MainLoader className="mt-24" />
      ) : (
        <>
          <VenueCardSM venues={filteredVenues} currentFilter={filterValue} />
          {!filteredVenues.length && (
            <span className="mb-10 mt-4 flex justify-center text-2xl">
              {noVenueMessage}
            </span>
          )}
          <Link
            to={"/all-venues"}
            className="mb-8 mr-2 flex items-center justify-end hover:motion-translate-x-out-[5px]"
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
