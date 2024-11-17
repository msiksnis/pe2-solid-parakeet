import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { endOfDay, format, startOfDay } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { useState } from "react";

import ErrorLoadingButton from "@/components/ErrorLoadingButton";
import MainLoader from "@/components/MainLoader";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useDisabledDates } from "@/hooks/useDisabledDates";
import { Venue } from "@/lib/types";
import { cn, useScreenSizes } from "@/lib/utils";
import { Route } from "@/routes/manage-reservations/$id";
import { decrementGuests, incrementGuests } from "@/utils/reservationUtils";
import { useUpdateReservationMutation } from "../mutations/useUpdateReservationMutation";
import { fetchVenueById } from "../queries/fetchVenueById";
import DateSelectionControls from "./DateSelectionControls";
import GuestControl from "./GuestNumberControl";

interface Range {
  from?: Date | undefined;
  to?: Date | undefined;
}

export default function UpdateReservation() {
  const { id } = useParams({ from: "/manage-reservations/$id" }) as {
    id: string | undefined;
  };
  const { guests, start_date, end_date, reservationId } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);
  const [guestControlExpanded, setGuestControlExpanded] = useState(false);
  const [originalRange] = useState<Range>({
    from: start_date ? startOfDay(new Date(start_date)) : undefined,
    to: end_date ? endOfDay(new Date(end_date)) : undefined,
  });
  const [range, setRange] = useState<Range>({
    from: start_date ? startOfDay(new Date(start_date)) : undefined,
    to: end_date ? endOfDay(new Date(end_date)) : undefined,
  });

  const updateReservationMutation = useUpdateReservationMutation();

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

  if (isLoading) return <MainLoader className="mt-60" />;

  const errorMessage =
    error instanceof Error
      ? `Error loading reservation details: ${error.message}`
      : "An unexpected error occurred while loading reservation details.";

  if (error) {
    return <ErrorLoadingButton errorMessage={errorMessage} onRetry={refetch} />;
  }

  if (!venue) return <p className="my-20">Reservation not found.</p>;

  const toggleGuestControl = () => {
    setGuestControlExpanded((prev) => !prev);
  };

  const currentRange = {
    from: range.from,
    to: range.to,
  };

  const bookedRanges = (venue?.bookings ?? []).map((booking) => ({
    from: startOfDay(toZonedTime(new Date(booking.dateFrom), "UTC")),
    to: endOfDay(toZonedTime(new Date(booking.dateTo), "UTC")),
  }));

  const { isDateDisabled } = useDisabledDates({
    bookedRanges,
    currentRange: range as Range,
    originalRange: originalRange as Range,
    minimumDays: 1,
    isSelectingStartDate,
  });

  const updateDates = (
    startDate: string | undefined,
    endDate: string | undefined,
  ) => {
    navigate({
      search: (prev) => ({
        ...prev,
        start_date: startDate,
        end_date: endDate,
      }),
      resetScroll: false,
    });
  };

  const handleDayClick = (day: Date) => {
    const newDay = startOfDay(day);

    if (isSelectingStartDate) {
      // Only reset the end date if the new start date is after the current end date
      setRange((prevRange) => ({
        from: newDay,
        to: prevRange.to && newDay > prevRange.to ? undefined : prevRange.to,
      }));

      // Automatically switch to selecting the end date
      setIsSelectingStartDate(false);

      updateDates(
        format(newDay, "yyyy-MM-dd"),
        range.to && newDay <= range.to
          ? format(range.to, "yyyy-MM-dd")
          : undefined,
      );
    } else if (range.from && newDay > range.from) {
      // If selecting an end date, ensure it is after the start date
      const newTo = endOfDay(day);
      setRange({ ...range, to: newTo });

      updateDates(
        range.from ? format(range.from, "yyyy-MM-dd") : undefined,
        format(newTo, "yyyy-MM-dd"),
      );
    } else {
      // Reset to a new start date if the range is invalid
      setRange({ from: newDay, to: undefined });
      setIsSelectingStartDate(false);

      updateDates(format(newDay, "yyyy-MM-dd"), undefined);
    }
  };

  const handleUpdate = () => {
    if (currentRange && currentRange.from && currentRange.to) {
      updateReservationMutation.mutate(
        {
          reservationId,
          data: {
            dateFrom: format(currentRange.from, "yyyy-MM-dd"),
            dateTo: format(currentRange.to, "yyyy-MM-dd"),
            guests,
          },
        },
        {
          onSuccess: () => {
            navigate({ to: "/manage-reservations" });
          },
        },
      );
    }
  };

  const handleIncrementGuests = () => {
    incrementGuests(guests, venue.maxGuests, (newGuests) => {
      navigate({
        search: (prev) => ({ ...prev, guests: newGuests }),
        resetScroll: false,
      });
    });
  };

  const handleDecrementGuests = () => {
    decrementGuests(guests, 1, (newGuests) => {
      navigate({
        search: (prev) => ({ ...prev, guests: newGuests }),
        resetScroll: false,
      });
    });
  };

  return (
    <div className="@container/calendar mx-auto my-20 max-w-4xl px-4 sm:px-6 lg:px-10 xl:px-4">
      <h1 className="text-2xl">Your reservation for: {venue.name}</h1>
      <img
        src={venue.media[0].url}
        alt={venue.media[0].alt}
        className="mt-8 h-60 w-full rounded-2xl object-cover md:h-80"
      />
      <div
        className={cn(
          "mt-8 flex w-full flex-col items-center justify-center gap-4",
          "@[520px]/calendar:flex-row @[520px]/calendar:items-start",
        )}
      >
        <Calendar
          mode="range"
          numberOfMonths={isMobile ? 1 : 2}
          weekStartsOn={1}
          selected={currentRange}
          onDayClick={handleDayClick}
          disabled={(date) => isDateDisabled(date)}
          className={cn({ "max-w-[332px]": isMobile })}
        />
        <div className="@[520px]/calendar:max-w-40 w-full max-w-80 space-y-4">
          <DateSelectionControls
            range={range}
            setIsSelectingStartDate={setIsSelectingStartDate}
            isSelectingStartDate={isSelectingStartDate}
          />
          <GuestControl
            guests={guests}
            maxGuests={venue.maxGuests}
            incrementGuests={handleIncrementGuests}
            decrementGuests={handleDecrementGuests}
            guestControlExpanded={guestControlExpanded}
            toggleGuestControl={toggleGuestControl}
          />
        </div>
      </div>
      <div className="mt-8 flex items-center justify-center gap-x-4 md:justify-end">
        <Button
          size={"lg"}
          variant={"gooeyLeft"}
          //   onClick={cancelReservation}
          className="w-52 border border-primary bg-muted from-gray-200 text-base text-primary after:duration-500"
        >
          {updateReservationMutation.isPending ? (
            <span className="flex items-center">
              Cancelling
              <Spinner className="ml-2 text-white" />
            </span>
          ) : (
            "Cancel reservation"
          )}
        </Button>
        <Button
          size={"lg"}
          variant={"gooeyLeft"}
          onClick={handleUpdate}
          disabled={
            !range.from || !range.to || updateReservationMutation.isPending
          }
          className="w-52 text-base after:duration-500"
        >
          {updateReservationMutation.isPending ? (
            <span className="flex items-center">
              Updating
              <Spinner className="ml-2 text-white" />
            </span>
          ) : (
            "Update reservation"
          )}
        </Button>
      </div>
    </div>
  );
}
