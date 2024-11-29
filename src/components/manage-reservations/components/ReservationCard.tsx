import { format } from "date-fns";

import BlurFade from "@/components/ui/blur-fade";
import { Reservation, Venue } from "../types";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchReservationsByProfile } from "../queries/fetchReservationsByProfile";
import ErrorLoadingButton from "@/components/ErrorLoadingButton";
import MainLoader from "@/components/MainLoader";

export default function ReservationCard() {
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

  const preparedReservations = reservations.map((reservation) => ({
    ...reservation,
    venue: reservation.venue as Venue,
  }));

  return (
    <>
      {isFetching ? (
        <MainLoader className="mt-24" />
      ) : (
        <div className="grid gap-4 pb-8 pt-8 md:grid-cols-3 lg:gap-y-0 xl:grid-cols-4">
          {preparedReservations.map((reservation, idx) => (
            <BlurFade
              key={reservation.id}
              delay={0.15 + idx * 0.05}
              inView
              inViewMargin="150px"
            >
              <Link
                to={`/manage-reservations/${reservation.venue.id}`}
                search={{
                  reservationId: reservation.id,
                  guests: reservation.guests,
                  start_date: format(reservation.dateFrom, "yyyy-MM-dd"),
                  end_date: format(reservation.dateTo, "yyyy-MM-dd"),
                }}
                className="group/card mb-4 flex flex-col rounded-2xl border-primary/0 transition-all duration-200 hover:border-primary/100 sm:p-2 md:border"
              >
                {reservation.venue.media.length > 0 ? (
                  <img
                    src={reservation.venue.media[0].url}
                    alt={reservation.venue.media[0].alt}
                    className="aspect-square h-60 w-full rounded-2xl object-cover"
                  />
                ) : (
                  <img
                    src="/default-image.jpg"
                    alt="Venue image"
                    className="aspect-square h-60 w-full rounded-2xl object-cover"
                  />
                )}

                <div className="my-4 flex flex-col justify-between">
                  <h1 className="line-clamp-2 text-lg font-medium capitalize leading-6">
                    {reservation.venue.name}
                  </h1>
                  <div className="flex items-center pt-1 text-paragraph">
                    <span className="">
                      {format(reservation.dateFrom, "dd MMM yyyy")}
                    </span>
                    <span className="mx-1">-</span>
                    <span className="">
                      {format(reservation.dateTo, "dd MMM yyyy")}
                    </span>
                  </div>
                  <span className="text-paragraph">
                    Guests: {reservation.guests}
                  </span>
                </div>
              </Link>
            </BlurFade>
          ))}
        </div>
      )}
    </>
  );
}
