import { Venue } from "@/lib/types";
import { Route } from "@/routes/search";
import { useQuery } from "@tanstack/react-query";
import ErrorLoadingButton from "../ErrorLoadingButton";
import VenueCardSM from "../VenueCardSM";
import { fetchVenues } from "./queries/fetchVenuesForSearch";
import MainLoader from "../MainLoader";

export default function SearchPage() {
  const { q, destination } = Route.useSearch();

  const {
    data: venues = [],
    isError,
    isFetching,
    error,
    refetch,
  } = useQuery<Venue[], Error>({
    queryKey: ["venues", { q, destination }],
    queryFn: () => fetchVenues({ q, destination }),
    retry: 1,
  });

  const errorMessage = isError
    ? `Error loading venues: ${error?.message}`
    : "An unexpected error occurred while loading the venues.";

  if (isError) {
    return <ErrorLoadingButton errorMessage={errorMessage} onRetry={refetch} />;
  }

  if (isFetching) return <MainLoader className="mt-24" />;

  return (
    <div className="mx-auto my-20 max-w-7xl px-4 sm:px-6 lg:px-10 xl:px-4">
      <h1 className="px-4 text-3xl">Search Results</h1>
      {venues.length > 0 ? (
        <VenueCardSM venues={venues} />
      ) : (
        <p>No venues found.</p>
      )}
    </div>
  );
}
