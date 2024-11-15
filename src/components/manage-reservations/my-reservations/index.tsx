import ErrorLoadingButton from "@/components/ErrorLoadingButton";
import { useQuery } from "@tanstack/react-query";
import MainLoader from "@/components/MainLoader";
import { fetchReservationsByProfile } from "../queries/fetchReservationsByProfile";
import { Reservation } from "../types";
import ReservationCard from "../components/ReservationCard";

export default function MyReservations() {
  const {
    data: reservations = [],
    error,
    isError,
    refetch,
    isFetching,
  } = useQuery<Reservation[]>({
    queryKey: ["reservationsByUser"],
    queryFn: () => fetchReservationsByProfile(),
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });

  const errorMessage = isError
    ? `Error loading reservations: ${error.message}`
    : "An unexpected error occurred while loading the reservations.";

  if (isError) {
    return <ErrorLoadingButton errorMessage={errorMessage} onRetry={refetch} />;
  }

  return (
    <div className="mx-auto my-20 max-w-7xl px-4 sm:px-6 lg:px-10 xl:px-4">
      <h1 className="px-4 text-3xl">My all reservations</h1>

      {isFetching ? (
        <MainLoader className="mt-24" />
      ) : (
        <div className="">
          <ReservationCard reservations={reservations} />
        </div>
      )}
    </div>
  );
}
