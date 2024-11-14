import { useQuery } from "@tanstack/react-query";
import { Venue } from "@/lib/types";
import { filterVenuesByType } from "@/lib/filterVenues";
import VenueCardSM from "@/components/VenueCardSM";
import { fetchVenues } from "../queries/fetchVenues";
import { useSearch } from "@tanstack/react-router";
import MainLoader from "@/components/MainLoader";

export default function ForGroups() {
  const { filter } = useSearch({ from: "/for-groups" });
  const filterValue = filter ?? null;

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

  const filteredVenues = filterVenuesByType(filterValue, venues).filter(
    (venue) => venue.maxGuests >= 6,
  );

  // Dynamic heading based on filter value
  const getHeading = (filter: string | null) => {
    switch (filter) {
      case "summer-escape":
        return "Summer Escape Venues for Groups";
      case "explore-mountains":
        return "Mountain Venues for Groups";
      default:
        return "Venues for Groups";
    }
  };

  const heading = getHeading(filterValue);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-10 xl:px-6">
      <h1 className="mt-6 text-center text-3xl font-semibold">{heading}</h1>
      {isFetching ? (
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
