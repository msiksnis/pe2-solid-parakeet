import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import ErrorLoadingButton from "@/components/ErrorLoadingButton";
import { Venue } from "@/lib/types";
import { fetchVenuesByUser } from "./queries/fetchVenuesByUser";
import MainLoader from "@/components/MainLoader";
import OwnersVenues from "./components/OwnersVenues";
import { useAuthStatus } from "@/hooks/useAuthStatus";

export default function MyVenues() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStatus();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate({ to: "/" });
    }
  }, [isLoggedIn]);

  const {
    data: venues = [],
    error,
    isError,
    refetch,
    isFetching,
  } = useQuery<Venue[]>({
    queryKey: ["venuesByUser"],
    queryFn: () => fetchVenuesByUser(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const errorMessage = isError
    ? `Error loading venues: ${error.message}`
    : "An unexpected error occurred while loading the venues.";

  if (isError) {
    return <ErrorLoadingButton errorMessage={errorMessage} onRetry={refetch} />;
  }

  return (
    <div className="mx-auto my-20 max-w-7xl px-4 sm:px-6 lg:px-10 xl:px-4">
      <h1 className="px-4 text-3xl">My all Venues</h1>
      {isFetching ? (
        <MainLoader className="mt-24" />
      ) : (
        <OwnersVenues venues={venues} />
      )}
    </div>
  );
}
