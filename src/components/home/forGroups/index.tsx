import ErrorLoadingButton from "@/components/ErrorLoadingButton";
import MainLoader from "@/components/MainLoader";
import VenueCardSM from "@/components/VenueCardSM";
import { useSearch } from "@tanstack/react-router";
import { ForGroups } from "./filterVenuesForGroups";
import { useFilteredVenuesGroups } from "./useFilteredVenuesGroups";

const VALID_FILTERS: (ForGroups | "all")[] = [
  "summer-escape",
  "explore-mountains",
  "all",
];

export default function ForGroupsPage() {
  const { filter } = useSearch({ from: "/for-groups" });
  const filterValue = VALID_FILTERS.includes(filter as ForGroups | "all")
    ? (filter as ForGroups | "all")
    : "all";

  const { filteredVenues, isLoading, isError, error, refetch } =
    useFilteredVenuesGroups(filterValue);

  const heading =
    filterValue === "all"
      ? "Explore All Venues"
      : filterValue === "summer-escape"
        ? "Summer Escape Venues for Groups"
        : filterValue === "explore-mountains"
          ? "Explore Mountains Venues for Groups"
          : "Explore Venues";

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
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-10 xl:px-6">
      <h1
        className="mt-6 text-center text-3xl font-semibold"
        role="heading"
        aria-level={1}
      >
        {isLoading && !filteredVenues.length
          ? "Loading venues..."
          : filteredVenues.length > 0
            ? heading
            : noVenueMessage}
      </h1>
      {isLoading && !filteredVenues.length ? (
        <MainLoader className="my-20" />
      ) : (
        <VenueCardSM
          venues={filteredVenues}
          currentFilter={filterValue || "all"}
        />
      )}
    </div>
  );
}
