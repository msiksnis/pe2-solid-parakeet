import { useNavigate } from "@tanstack/react-router";
import { endOfDay, format, startOfDay } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
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
import { toZonedTime } from "date-fns-tz";
import { Button } from "../../ui/button.tsx";
import { Calendar } from "../../ui/calendar.tsx";
import { Separator } from "../../ui/separator.tsx";
import { Booking } from "../utils/BookingValidation.ts";
import { useEscapeKey, useOutsideClick } from "../hooks/useOutsideClick.ts";
import { createBooking } from "../utils/utils.ts";

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
  const { guests, start_date, end_date } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [range, setRange] = useState<Range>({
    from: start_date ? startOfDay(new Date(start_date)) : undefined,
    to: end_date ? endOfDay(new Date(end_date)) : undefined,
  });
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

  const bookedRanges = (venue?.bookings ?? []).map((booking) => ({
    from: startOfDay(toZonedTime(new Date(booking.dateFrom), "UTC")),
    to: endOfDay(toZonedTime(new Date(booking.dateTo), "UTC")),
  }));

  const { handleDateSelect } = useDateRangeSelection(
    bookedRanges,
    navigate,
    range,
    setRange,
    isSelectingStartDate,
    setIsSelectingStartDate,
  );

  useOutsideClick(calendarRef, () => {
    setIsExpanded(false);
  });

  useEscapeKey(() => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  });

  useOutsideClick(guestsRef, () => {
    setGuestControlExpanded(false);
  });

  useEscapeKey(() => {
    if (guestControlExpanded) {
      setGuestControlExpanded(false);
    }
  });

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
                disabled={(date) => isDateDisabled(date)}
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
