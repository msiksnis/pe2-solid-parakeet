import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
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
import { CalendarDays, ChevronDown, Minus, Plus, User } from "lucide-react";

import { useAuthStatus } from "@/hooks/useAuthStatus.ts";
import { useSignInModalStore } from "@/hooks/useSignInModalStore.ts";
import { Venue } from "@/lib/types.ts";
import { calculateTotalPrice, cn, useScreenSizes } from "@/lib/utils.ts";
import { Route } from "@/routes/venue/$id.tsx";
import { Button } from "../../ui/button.tsx";
import { Calendar } from "../../ui/calendar.tsx";
import { Separator } from "../../ui/separator.tsx";
import { Booking } from "../utils/BookingValidation.ts";
import { calculateSingleDayGaps } from "../utils/utils.ts";
import { useDateRangeSelection } from "@/hooks/useDateRangeSelection.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";

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

  return (
    <div className={cn("hidden", { block: smCalendarContainer })}>
      <Separator />
      <div className="mx-auto mt-6 flex min-w-[21rem] max-w-[25rem] flex-col justify-between">
        <>
          <div className="space-y-6">
            <div className="mt-2 flex w-full items-center justify-between gap-4">
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
                  <span
                    className={cn("whitespace-nowrap text-lg", {
                      "text-base": smCalendarContainer,
                    })}
                  >
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
                  <span
                    className={cn("whitespace-nowrap text-lg", {
                      "text-base": smCalendarContainer,
                    })}
                  >
                    {range.to ? format(range.to, "dd MMM") : "Select date"}
                  </span>
                </div>
              </Button>
            </div>

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

            <div className="relative h-32">
              <div className="absolute w-full rounded-xl border border-gray-500 px-4 py-1">
                <div
                  className="grid cursor-pointer grid-cols-5"
                  onClick={toggleGuestControl}
                >
                  <div className="col-span-4 grid">
                    <span className="whitespace-nowrap text-sm">Guests</span>
                    <span className="whitespace-nowrap text-lg">
                      {guests} {guests > 1 ? "guests" : "guest"}
                    </span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "ml-auto mt-2 opacity-60 transition duration-200",
                      {
                        "rotate-180": guestControlExpanded,
                      },
                    )}
                  />
                </div>

                {/* Guest control section */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: guestControlExpanded ? "auto" : 0,
                    opacity: guestControlExpanded ? 1 : 0,
                  }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <div className="col-span-5 mb-2 mt-4 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-6 rounded-full border-gray-500"
                      onClick={() => {
                        navigate({
                          search: (prev) => ({
                            ...prev,
                            guests: Math.max(1, guests - 1),
                          }),
                          resetScroll: false,
                        });
                      }}
                      disabled={guests <= 1}
                    >
                      <Minus />
                    </Button>
                    <span className="tabular-nums selection:bg-card">
                      {guests}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-6 rounded-full border-gray-500"
                      onClick={() => {
                        navigate({
                          search: (prev) => ({
                            ...prev,
                            guests: Math.min(guests + 1, venue.maxGuests),
                          }),
                          resetScroll: false,
                        });
                      }}
                      disabled={guests >= venue.maxGuests}
                    >
                      <Plus />
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 text-lg font-bold">
            <span className="selection:bg-card">Total</span>
            <span>${totalPrice.toLocaleString()}</span>
          </div>
          <Button
            size="lg"
            variant={"gooeyLeft"}
            onClick={handleReserveClick}
            className="h-14 w-full rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-lg font-semibold text-primary after:duration-700"
          >
            Reserve
          </Button>
          <p className="text-center text-muted-foreground">
            You will not be charged yet
          </p>
        </div>
      </div>
      <div className="mt-12 space-y-6 md:hidden">
        <Separator />
        <div className="flex items-center space-x-4">
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={venue.owner?.avatar.url}
              alt={venue.owner?.avatar.alt}
            />
            <AvatarFallback>
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <span>
            Hosted by <span className="capitalize">{venue.owner?.name}</span>
          </span>
        </div>
        <Separator />
      </div>
    </div>
  );
}
