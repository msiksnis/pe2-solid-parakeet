import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScrollContainer from "../InfiniteScrollContainer";
import VenueCardSM from "../VenueCardSM";
import { fetchAllVenues } from "./queries/fetchAllVenues";
import MainLoader from "../MainLoader";
import { AllVenuesProps } from "@/lib/types";

export default function AllVenues() {
  const limit = 50;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery<AllVenuesProps, Error>({
    queryKey: ["allProducts"],
    queryFn: ({ pageParam = 0 }) => fetchAllVenues(pageParam as number, limit),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
  });

  const allVenues = data?.pages.flatMap((page) => page.data) || [];

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error: {error instanceof Error ? error.message : "An error occurred"}
      </div>
    );
  }

  return (
    <InfiniteScrollContainer
      className="venues-container"
      onBottomReached={() => {
        if (hasNextPage && !isFetching) {
          fetchNextPage();
        }
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-10 xl:px-6">
        <h1 className="mt-6 text-3xl font-semibold">All Venues</h1>
        <VenueCardSM venues={allVenues} currentFilter={"all"} />
        {isFetchingNextPage && <MainLoader className="my-24" />}
      </div>
    </InfiniteScrollContainer>
  );
}
