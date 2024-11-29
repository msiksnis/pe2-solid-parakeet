import { useNavigate } from "@tanstack/react-router";
import {
  addDays,
  areIntervalsOverlapping,
  endOfDay,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
} from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import DateSelectionControls from "@/components/reservation-components/DateSelectionControls.tsx";
import GuestControl from "@/components/reservation-components/GuestNumberControl.tsx";
import ReservationButton from "@/components/reservation-components/ReservationButton.tsx";
import { useAuthStatus } from "@/hooks/useAuthStatus.ts";
import { useDateRangeSelection } from "@/hooks/useDateRangeSelection.ts";
import { useSignInModalStore } from "@/hooks/useSignInModalStore.ts";
import { Venue } from "@/lib/types.ts";
import { calculateTotalPrice, cn, useScreenSizes } from "@/lib/utils.ts";
import { Route } from "@/routes/venue/$id.tsx";
import { decrementGuests, incrementGuests } from "@/utils/reservationUtils.ts";
import { Calendar } from "../../ui/calendar.tsx";
import { Separator } from "../../ui/separator.tsx";
import { Booking } from "../utils/BookingValidation.ts";
import { calculateSingleDayGaps } from "../utils/utils.ts";
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
  const {
    guests,
    start_date: startDateParam,
    end_date: endDateParam,
  } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const startDate = startDateParam ? parseISO(startDateParam) : undefined;
  const endDate = endDateParam ? parseISO(endDateParam) : undefined;

  const [range, setRange] = useState<Range>({ from: startDate, to: endDate });
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

  const bookedDateRanges = (venue.bookings ?? [])
    .map((booking) => ({
      from: startOfDay(parseISO(booking.dateFrom)),
      to: endOfDay(parseISO(booking.dateTo)),
    }))
    .sort((a, b) => a.from.getTime() - b.from.getTime());

  const { handleDateSelect } = useDateRangeSelection(
    bookedDateRanges,
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

  const disabledDates = [
    ...bookedDateRanges,
    ...calculateSingleDayGaps(bookedDateRanges),
    (date: Date) => {
      const today = startOfDay(new Date());
      if (date < today) {
        return true;
      }
      if (isSelectingStartDate) {
        const nextDay = addDays(date, 1);
        const isNextDayBooked = bookedDateRanges.some((range) =>
          isWithinInterval(nextDay, { start: range.from, end: range.to }),
        );
        if (isNextDayBooked) {
          return true;
        }
        return false;
      } else {
        if (range.from) {
          if (date < range.from) {
            return true;
          }
          const startDate = startOfDay(range.from);
          const endDate = endOfDay(date);
          return isDateRangeOverlapping(startDate, endDate, bookedDateRanges);
        }
        return true;
      }
    },
  ];

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

    const bookingData: Booking = {
      id: "",
      created: format(new Date(), "yyyy-MM-dd"),
      updated: format(new Date(), "yyyy-MM-dd"),
      venueId: venue.id,
      guests,
      dateFrom: format(range.from, "yyyy-MM-dd"),
      dateTo: format(range.to, "yyyy-MM-dd"),
    };

    onReserve(bookingData);
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
              disabled={disabledDates}
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
