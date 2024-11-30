import { useQueries } from "@tanstack/react-query";

import VenueCardSM from "@/components/VenueCardSM";
import { useAuthStore } from "@/hooks/useAuthStore";
import { fetchFavoriteById } from "./queries/fetchFavoriteVenues";
import { Venue } from "@/lib/types";
import MainLoader from "../MainLoader";
import ErrorLoadingButton from "../ErrorLoadingButton";

export default function FavoritesPage() {
  const { favorites } = useAuthStore();

  const favoriteQueries = useQueries({
    queries: favorites.map((venueId) => ({
      queryKey: ["venue", venueId],
      queryFn: () => fetchFavoriteById(venueId),
    })),
  });

  const isLoading = favoriteQueries.some((query) => query.isLoading);
  const isError = favoriteQueries.some((query) => query.isError);
  const error = favoriteQueries.find((query) => query.isError)?.error;
  const favoriteVenues = favoriteQueries
    .map((query) => query.data)
    .filter(Boolean);
  const refetchAll = () => {
    favoriteQueries.forEach((query) => query.refetch());
  };

  if (isLoading) {
    return <MainLoader className="my-20" />;
  }

  const errorMessage = isError
    ? `Error loading venues: ${error?.message}`
    : "An unexpected error occurred while loading the venues.";

  if (isError) {
    return (
      <ErrorLoadingButton errorMessage={errorMessage} onRetry={refetchAll} />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-10 xl:px-6">
      <h1 className="mt-6 text-3xl font-semibold">
        {favoriteQueries.length > 0
          ? "Your Favorite Venues"
          : "No favorite venues found."}
      </h1>
      <VenueCardSM venues={favoriteVenues as Venue[]} />
    </div>
  );
}
