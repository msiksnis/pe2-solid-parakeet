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
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import DateSelectionControls from "@/components/reservation-components/DateSelectionControls.tsx";
import GuestControl from "@/components/reservation-components/GuestNumberControl.tsx";
import { useAuthStatus } from "@/hooks/useAuthStatus.ts";
import { useDateRangeSelection } from "@/hooks/useDateRangeSelection.ts";
import { useSignInModalStore } from "@/hooks/useSignInModalStore.ts";
import { Venue } from "@/lib/types.ts";
import { calculateTotalPrice, cn, useScreenSizes } from "@/lib/utils.ts";
import { Route } from "@/routes/venue/$id.tsx";
import { decrementGuests, incrementGuests } from "@/utils/reservationUtils.ts";
import { Button } from "../../ui/button.tsx";
import { Calendar } from "../../ui/calendar.tsx";
import { Separator } from "../../ui/separator.tsx";
import { Booking } from "../utils/BookingValidation.ts";
import { calculateSingleDayGaps } from "../utils/utils.ts";
import ReservationButton from "@/components/reservation-components/ReservationButton.tsx";

interface BookingDetailsProps {
  venue: Venue;
  onReserve: (data: Booking) => void;
  className?: string;
}

interface Range {
  from: Date | undefined;
  to: Date | undefined;
}

export default function BookingDetails({
  venue,
  onReserve,
  className,
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [guestControlExpanded, setGuestControlExpanded] = useState(false);
  const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);

  const calendarRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  const { openSignInModal } = useSignInModalStore();
  const { isLoggedIn } = useAuthStatus();

  const { smCalendarContainer, mdCalendarContainer } = useScreenSizes();

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

  useEffect(() => {
    const handleOutsideClickForCalendar = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    };

    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleOutsideClickForCalendar);
      document.addEventListener("keydown", handleEscapePress);
    } else {
      document.removeEventListener("mousedown", handleOutsideClickForCalendar);
      document.removeEventListener("keydown", handleEscapePress);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClickForCalendar);
      document.removeEventListener("keydown", handleEscapePress);
    };
  }, [isExpanded]);

  useEffect(() => {
    const handleOutsideClickForGuests = (event: MouseEvent) => {
      if (
        guestsRef.current &&
        !guestsRef.current.contains(event.target as Node)
      ) {
        setGuestControlExpanded(false);
      }
    };

    if (guestControlExpanded) {
      document.addEventListener("mousedown", handleOutsideClickForGuests);
    } else {
      document.removeEventListener("mousedown", handleOutsideClickForGuests);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClickForGuests);
    };
  }, [guestControlExpanded]);

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

  const openCalendar = () => {
    setIsExpanded(true);
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
    <div
      className={cn(
        "flex flex-col",
        {
          hidden: smCalendarContainer,
        },
        className,
      )}
    >
      <div
        ref={calendarRef}
        className="shadow-custom relative flex flex-col rounded-2xl bg-card px-6 py-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          {isExpanded && (
            <div className="">
              <div className="text-2xl font-semibold">Select dates</div>
              <span className="text-sm text-muted-foreground">
                {range.from ? format(range.from, "dd MMM") : "Select dates"}{" "}
                {range.to && (
                  <span className=""> - {format(range.to, "dd MMM")}</span>
                )}
              </span>
            </div>
          )}
          <div className="w-[336px]">
            <div className="flex flex-col">
              <span className="text-2xl font-semibold">${venue?.price}</span>
              <span className="pb-0.5 text-muted-foreground">Per night</span>
            </div>
          </div>
        </div>
        <Separator className="mb-4 mt-2" />
        <div className="flex h-96">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mr-10"
            >
              <Calendar
                mode="range"
                numberOfMonths={
                  smCalendarContainer || mdCalendarContainer ? 1 : 2
                }
                weekStartsOn={1}
                selected={range}
                onDayClick={handleDateSelect}
                disabled={disabledDates}
              />
            </motion.div>
          )}

          <div
            className={cn("hidden", {
              "absolute bottom-4 left-4 block cursor-pointer text-base font-semibold":
                isExpanded,
            })}
          >
            <Button variant={"linkHover1"} onClick={() => setIsExpanded(false)}>
              Close
            </Button>
          </div>

          <div className="ml-auto flex w-[21rem] flex-col justify-between">
            <DateSelectionControls
              range={range}
              setIsSelectingStartDate={setIsSelectingStartDate}
              isSelectingStartDate={isSelectingStartDate}
              openCalendar={openCalendar}
            />
            <GuestControl
              guests={guests}
              maxGuests={venue.maxGuests}
              incrementGuests={handleIncrementGuests}
              decrementGuests={handleDecrementGuests}
              guestControlExpanded={guestControlExpanded}
              toggleGuestControl={toggleGuestControl}
            />
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
        </div>
      </div>
    </div>
  );
}
