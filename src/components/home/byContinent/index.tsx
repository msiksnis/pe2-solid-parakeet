import ErrorLoadingButton from "@/components/ErrorLoadingButton";
import MainLoader from "@/components/MainLoader";
import VenueCardSM from "@/components/VenueCardSM";
import { Route } from "@/routes/by-continent";
import { Continent, CONTINENT_CONFIG } from "./filterVenuesByContinent";
import { useFilteredVenuesContinent } from "./useFilteredVenuesContinent";

const VALID_FILTERS: (Continent | "all")[] = [
  "africa",
  "asia",
  "europe",
  "north-america",
  "south-america",
  "oceania",
  "australia",
  "all",
];

export default function ByContinent() {
  const { filter } = Route.useSearch();
  const filterValue = VALID_FILTERS.includes(filter as Continent | "all")
    ? (filter as Continent | "all")
    : "all";

  const { filteredVenues, isLoading, isError, error, refetch } =
    useFilteredVenuesContinent(filterValue);

  const heading =
    filterValue === "all"
      ? "Explore All Venues"
      : CONTINENT_CONFIG[filterValue]
        ? `Explore Venues in ${CONTINENT_CONFIG[filterValue].displayName}`
        : "Explore Venues";

  const noVenueMessage =
    filterValue === "all"
      ? "Check back soon for new venues!"
      : CONTINENT_CONFIG[filterValue]
        ? `No venues yet for ${CONTINENT_CONFIG[filterValue].displayName}. Check back soon!`
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
        <VenueCardSM venues={filteredVenues} currentFilter={filterValue} />
      )}
    </div>
  );
}
