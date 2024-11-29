import { useNavigate } from "@tanstack/react-router";
import { endOfDay, parseISO, startOfDay } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import DateSelectionControls from "@/components/reservation-components/DateSelectionControls.tsx";
import GuestControl from "@/components/reservation-components/GuestNumberControl.tsx";
import ReservationButton from "@/components/reservation-components/ReservationButton.tsx";
import { useAuthStatus } from "@/hooks/useAuthStatus.ts";
import { useDateRangeSelection } from "@/hooks/useDateRangeSelection.ts";
import { useDisabledDates } from "@/hooks/useDisabledDates.ts";
import { useSignInModalStore } from "@/hooks/useSignInModalStore.ts";
import { Venue } from "@/lib/types.ts";
import { calculateTotalPrice, cn, useScreenSizes } from "@/lib/utils.ts";
import { Route } from "@/routes/venue/$id.tsx";
import { decrementGuests, incrementGuests } from "@/utils/reservationUtils.ts";
import { Calendar } from "../../ui/calendar.tsx";
import { Separator } from "../../ui/separator.tsx";
import { Booking } from "../utils/BookingValidation.ts";
import { createBooking } from "../utils/utils.ts";
import HostedBy from "./HostedBy.tsx";

interface BookingDetailsProps {
  onReserve: (data: Booking) => void;
  venue: Venue;
}

interface Range {
  from: Date | undefined;
  to: Date | undefined;
}

export default function BookingDetailsMobile({
  venue,
  onReserve,
}: BookingDetailsProps) {
  const { guests, start_date, end_date } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [range, setRange] = useState<Range>({
    from: start_date ? startOfDay(new Date(start_date)) : undefined,
    to: end_date ? endOfDay(new Date(end_date)) : undefined,
  });
  const [guestControlExpanded, setGuestControlExpanded] = useState(false);
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);

  const { openSignInModal } = useSignInModalStore();
  const { isLoggedIn } = useAuthStatus();

  useEffect(() => {
    if (range.from && range.to && range.from > range.to) {
      navigate({
        search: (prev) => ({
          ...prev,
          end_date: undefined,
        }),
        replace: true,
      });
      setRange((prevRange) => ({ ...prevRange, to: undefined }));
    }
  }, [range.from, range.to, navigate]);

  const bookedRanges = (venue.bookings ?? [])
    .map((booking) => ({
      from: startOfDay(parseISO(booking.dateFrom)),
      to: endOfDay(parseISO(booking.dateTo)),
    }))
    .sort((a, b) => a.from.getTime() - b.from.getTime());

  const { handleDateSelect } = useDateRangeSelection(
    bookedRanges,
    navigate,
    range,
    setRange,
    isSelectingStartDate,
    setIsSelectingStartDate,
  );

  const toggleGuestControl = () => {
    setGuestControlExpanded((prev) => !prev);
  };

  const totalPrice =
    range.from && range.to
      ? calculateTotalPrice(range.from, range.to, venue.price)
      : 0;

  const { isDateDisabled } = useDisabledDates({
    bookedRanges,
    currentRange: range as Range,
    minimumDays: 1,
    isSelectingStartDate,
  });

  const { smCalendarContainer } = useScreenSizes();

  const handleReserveClick = () => {
    if (!isLoggedIn) {
      openSignInModal();
      return;
    }

    if (!range.from || !range.to) {
      toast.warning("Please select dates to reserve the venue.");
      return;
    }

    try {
      const bookingData = createBooking(venue.id, guests, range.from, range.to);
      onReserve(bookingData);
    } catch (error) {
      console.error("Failed to create booking:", error);
      toast.error("Failed to create booking. Please try again.");
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
    <div className={cn("hidden", { block: smCalendarContainer })}>
      <Separator />
      <div className="mx-auto mt-6 flex min-w-[21rem] max-w-[25rem] flex-col justify-between">
        <div className="space-y-6">
          <DateSelectionControls
            range={range}
            setIsSelectingStartDate={setIsSelectingStartDate}
            isSelectingStartDate={isSelectingStartDate}
          />
          <div className="flex justify-center rounded-xl border border-gray-500">
            <Calendar
              mode="range"
              numberOfMonths={1}
              weekStartsOn={1}
              selected={range}
              onDayClick={handleDateSelect}
              // disabled={disabledDates}
              disabled={(date) => isDateDisabled(date)}
            />
          </div>
          <GuestControl
            guests={guests}
            maxGuests={venue.maxGuests}
            incrementGuests={handleIncrementGuests}
            decrementGuests={handleDecrementGuests}
            guestControlExpanded={guestControlExpanded}
            toggleGuestControl={toggleGuestControl}
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 text-lg font-bold">
            <span className="selection:bg-card">Total</span>
            <span>${totalPrice.toLocaleString()}</span>
          </div>
          <ReservationButton handleReserveClick={handleReserveClick} />
          <p className="text-center text-muted-foreground">
            You will not be charged yet
          </p>
        </div>
      </div>
      <div className="mt-12 space-y-6 md:hidden">
        <Separator />
        {venue.owner && <HostedBy owner={venue.owner} />}
        <Separator />
      </div>
    </div>
  );
}
