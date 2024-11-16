import ErrorLoadingButton from "@/components/ErrorLoadingButton";
import MainLoader from "@/components/MainLoader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Venue } from "@/lib/types";
import { calculateSingleDayGaps, cn, useScreenSizes } from "@/lib/utils";
import { Route } from "@/routes/manage-reservations/$id";
import { useQuery } from "@tanstack/react-query";
import {
  // useNavigate,
  useParams,
} from "@tanstack/react-router";
import {
  addDays,
  areIntervalsOverlapping,
  endOfDay,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
} from "date-fns";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
// import { useUpdateReservationMutation } from "../mutations/useUpdateReservationMutation";
import { fetchVenueById } from "../queries/fetchVenueById";
// import { Reservation } from "../types";

interface Range {
  from: Date | undefined;
  to: Date | undefined;
}

export default function UpdateReservation() {
  const { id } = useParams({ from: "/manage-reservations/$id" }) as {
    id: string | undefined;
  };
  const { guests, start_date, end_date, reservationId } = Route.useSearch();
  //   const navigate = useNavigate();

  console.log(guests, start_date, end_date, reservationId);

  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);
  const [range, setRange] = useState<Range>({
    from: start_date ? parseISO(start_date) : undefined,
    to: end_date ? parseISO(end_date) : undefined,
  });

  console.log(setRange);

  //   const updateReservationMutation = useUpdateReservationMutation();
  const { isMobile } = useScreenSizes();

  const {
    data: venue,
    isLoading,
    error,
    refetch,
  } = useQuery<Venue>({
    queryKey: ["venueById", id],
    queryFn: () => fetchVenueById(id as string),
    enabled: !!id,
    retry: 2,
  });

  //   console.log("Venue", venue);

  if (isLoading) return <MainLoader className="mt-60" />;

  const errorMessage =
    error instanceof Error
      ? `Error loading reservation details: ${error.message}`
      : "An unexpected error occurred while loading reservation details.";

  if (error) {
    return <ErrorLoadingButton errorMessage={errorMessage} onRetry={refetch} />;
  }

  if (!venue) return <p className="my-20">Reservation not found.</p>;

  function isDateRangeOverlapping(
    startDate: Date,
    endDate: Date,
    bookedRanges: { from: Date; to: Date }[],
  ): boolean {
    return bookedRanges.some((bookedRange) =>
      areIntervalsOverlapping(
        { start: startDate, end: endDate },
        { start: bookedRange.from, end: bookedRange.to },
        { inclusive: true },
      ),
    );
  }

  const bookedDateRanges = (venue.bookings ?? [])
    .map((booking) => ({
      from: startOfDay(parseISO(booking.dateFrom)),
      to: endOfDay(parseISO(booking.dateTo)),
    }))
    .sort((a, b) => a.from.getTime() - b.from.getTime());

  //   const { handleDateSelect } = useDateRangeSelection(
  //     bookedDateRanges,
  //     navigate,
  //     range,
  //     setRange,
  //     isSelectingStartDate,
  //     setIsSelectingStartDate,
  //   );

  const disabledDates = [
    ...bookedDateRanges,
    ...calculateSingleDayGaps(bookedDateRanges),
    (date: Date) => {
      const today = startOfDay(new Date());
      if (date < today) {
        return true; // Disable past dates
      }
      if (isSelectingStartDate) {
        // Disable dates that cannot be used as start dates
        // Check if there is at least one day available after the selected date
        const nextDay = addDays(date, 1);
        const isNextDayBooked = bookedDateRanges.some((range) =>
          isWithinInterval(nextDay, { start: range.from, end: range.to }),
        );
        if (isNextDayBooked) {
          return true; // Cannot book at least one night
        }
        return false;
      } else {
        if (range.from) {
          if (date < range.from) {
            return true; // Disable dates before the selected start date
          }
          // Remove the equality check to keep the start date enabled
          // Disable dates that would result in a range overlapping booked dates
          const startDate = startOfDay(range.from);
          const endDate = endOfDay(date);
          return isDateRangeOverlapping(startDate, endDate, bookedDateRanges);
        }
        return true; // Disable all dates if start date is not selected
      }
    },
  ];

  //   const handleUpdate = (data: Reservation) => {
  //     updateReservationMutation.mutate(
  //       {
  //         bookingId: id as string,
  //         data,
  //       },
  //       {
  //         onSuccess: () => {
  //           navigate({ to: "/manage-reservations" });
  //         },
  //       },
  //     );
  //   };

  return (
    <div className="mx-auto my-20 max-w-4xl px-4 sm:px-6 lg:px-10 xl:px-4">
      <h1 className="text-2xl">Your reservation for: {venue.name}</h1>
      <img
        src={venue.media[0].url}
        alt={venue.media[0].alt}
        className="mt-8 h-60 w-full rounded-2xl object-cover md:h-80"
      />
      <div className="mt-8 flex justify-center gap-4">
        <Calendar
          mode="range"
          numberOfMonths={isMobile ? 1 : 2}
          weekStartsOn={1}
          selected={range}
          //   onDayClick={handleDateSelect}
          disabled={disabledDates}
        />
        <div className="mt-2 flex w-full max-w-40 flex-col items-center gap-4">
          <Button
            className={cn(
              "grid h-fit w-full grid-cols-3 rounded-xl border border-gray-500 bg-card px-0 py-1 text-primary outline-none ring-offset-background transition-all duration-300 hover:bg-card",
              {
                "ring-2 ring-primary ring-offset-2": isSelectingStartDate,
              },
            )}
            onClick={() => {
              setIsSelectingStartDate(true);
            }}
          >
            <span className="col-span-1 m-auto">
              <CalendarDays />
            </span>
            <div className="col-span-2 flex flex-col items-start">
              <span className="whitespace-nowrap text-sm">Start date</span>
              <span className={cn("whitespace-nowrap text-lg")}>
                {range.from ? format(range.from, "dd MMM") : "Select date"}
              </span>
            </div>
          </Button>
          <Button
            className={cn(
              "grid h-fit w-full grid-cols-3 rounded-xl border border-gray-500 bg-card px-0 py-1 text-primary outline-none ring-offset-background transition-all duration-300 hover:bg-card",
              {
                "ring-2 ring-primary ring-offset-2": !isSelectingStartDate,
              },
            )}
            onClick={() => {
              if (range.from) {
                setIsSelectingStartDate(false);
              }
            }}
            disabled={!range.from}
          >
            <span className="col-span-1 m-auto">
              <CalendarDays />
            </span>
            <div className="col-span-2 flex flex-col items-start">
              <span className="whitespace-nowrap text-sm">End date</span>
              <span className={cn("whitespace-nowrap text-lg")}>
                {range.to ? format(range.to, "dd MMM") : "Select date"}
              </span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
