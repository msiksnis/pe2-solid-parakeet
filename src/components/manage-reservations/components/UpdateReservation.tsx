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
import {
  decrementGuests,
  handleDateSelection,
  incrementGuests,
} from "@/utils/reservationUtils";
import { useUpdateReservationMutation } from "../mutations/useUpdateReservationMutation";
import { fetchVenueById } from "../queries/fetchVenueById";
import DateSelectionControls from "@/components/reservation-components/DateSelectionControls.tsx";
import GuestControl from "../../reservation-components/GuestNumberControl.tsx";
import { useDeleteReservationMutation } from "../mutations/useDeleteReservationMutation";
import { toast } from "sonner";
import WarningModal from "@/components/WarningModal";

interface Range {
  from?: Date | undefined;
  to?: Date | undefined;
}

/**
 * Component for updating an existing reservation.
 *
 * This component allows users to:
 * - Modify reservation dates.
 * - Adjust the number of guests.
 * - Cancel their reservation.
 *
 * It fetches the venue data based on the ID from the URL parameters and handles date selection,
 * guest number adjustments, and updates or cancels the reservation via mutations.
 *
 * @returns The JSX element representing the UpdateReservation component.
 */
export default function UpdateReservation() {
  const { id } = useParams({ from: "/manage-reservations/$id" }) as {
    id: string | undefined;
  };
  const { guests, start_date, end_date, reservationId } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);
  const [openWarningModal, setOpenWarningModal] = useState(false);
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
  const { mutate: deleteReservation, isPending: isDeleting } =
    useDeleteReservationMutation();

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

  /**
   * Updates the URL search parameters with the new start and end dates.
   *
   * @param startDate - The new start date in 'yyyy-MM-dd' format.
   * @param endDate - The new end date in 'yyyy-MM-dd' format.
   */
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
    handleDateSelection({
      day,
      range,
      isSelectingStartDate,
      setRange,
      setIsSelectingStartDate,
      updateDates,
    });
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

  const cancelReservation = () => {
    if (!reservationId) {
      toast.error("Reservation ID is missing. Unable to cancel reservation.");
      return;
    }

    deleteReservation(reservationId, {
      onSuccess: () => {
        setOpenWarningModal(false);
        navigate({ to: "/manage-reservations" });
      },
      onError: (error) => {
        console.error("Error cancelling reservation:", error);
        toast.error("Failed to cancel reservation. Please try again later.");
      },
    });
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
    <div className="mx-auto my-20 max-w-4xl px-4 @container/calendar sm:px-6 lg:px-10 xl:px-4">
      <h1 className="text-3xl font-semibold">
        Your reservation for: {venue.name}
      </h1>
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
        <div className="w-full max-w-80 space-y-4 @[520px]/calendar:max-w-40">
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
      <div className="mt-4 flex items-center justify-center gap-x-4 md:mt-14 md:justify-end">
        <Button
          size={"lg"}
          variant={"gooeyLeft"}
          onClick={() => setOpenWarningModal(true)}
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
      <WarningModal
        isOpen={openWarningModal}
        onClose={() => setOpenWarningModal(false)}
        onConfirm={cancelReservation}
        loading={isDeleting}
      />
    </div>
  );
}
