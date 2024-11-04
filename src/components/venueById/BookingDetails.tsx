import { Venue } from "@/lib/types";
import { calculateTotalPrice, cn } from "@/lib/utils";
import { Route } from "@/routes/venue/$id";
import { useNavigate } from "@tanstack/react-router";
import {
  addDays,
  areIntervalsOverlapping,
  differenceInCalendarDays,
  endOfDay,
  format,
  isWithinInterval,
  parseISO,
  startOfDay,
} from "date-fns";
import { motion } from "framer-motion";
import { CalendarDays, ChevronDown, Minus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DayClickEventHandler } from "react-day-picker";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Separator } from "../ui/separator";

interface BookingDetailsProps {
  venue: Venue;
}

interface Range {
  from: Date | undefined;
  to: Date | undefined;
}

export default function BookingDetails({ venue }: BookingDetailsProps) {
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

  useEffect(() => {
    if (range.from && range.to && range.from > range.to) {
      navigate({
        search: (prev) => ({
          ...prev,
          end_date: undefined,
        }),
        replace: true, // Replace the current history entry
      });
      setRange((prevRange) => ({ ...prevRange, to: undefined }));
    }
  }, [range.from, range.to, navigate]);

  const bookedDateRanges = venue.bookings
    .map((booking) => ({
      from: startOfDay(parseISO(booking.dateFrom)),
      to: endOfDay(parseISO(booking.dateTo)),
    }))
    .sort((a, b) => a.from.getTime() - b.from.getTime());

  const handleDateSelect: DayClickEventHandler = (selectedDate, modifiers) => {
    if (modifiers.disabled) {
      return; // Ignore clicks on disabled dates
    }

    if (isSelectingStartDate) {
      // Reset the end date when selecting a new start date
      setRange({ from: selectedDate, to: undefined });
      setIsSelectingStartDate(false);

      // Update URL parameters - reset end_date
      navigate({
        search: (prev) => ({
          ...prev,
          start_date: format(selectedDate, "yyyy-MM-dd"),
          end_date: undefined,
        }),
        resetScroll: false,
      });
    } else {
      if (range.from && selectedDate > range.from) {
        const startDate = startOfDay(range.from);
        const endDate = endOfDay(selectedDate);

        // Check if the range overlaps with any booked dates
        if (isDateRangeOverlapping(startDate, endDate, bookedDateRanges)) {
          alert(
            "The selected dates include unavailable dates. Please choose a different range.",
          );
          return;
        }

        // Update the end date
        setRange((prevRange) => ({ ...prevRange, to: selectedDate }));

        // Update end_date in URL parameters
        navigate({
          search: (prev) => ({
            ...prev,
            end_date: format(selectedDate, "yyyy-MM-dd"),
          }),
          resetScroll: false,
        });
      }
    }
  };

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

  const singleDayGaps: Date[] = [];

  for (let i = 0; i < bookedDateRanges.length - 1; i++) {
    const currentBooking = bookedDateRanges[i];
    const nextBooking = bookedDateRanges[i + 1];

    // The day after the current booking ends
    const gapStart = addDays(currentBooking.to, 1);
    // The day before the next booking starts
    const gapEnd = addDays(nextBooking.from, -1);

    const gapDays = differenceInCalendarDays(gapEnd, gapStart) + 1;

    if (gapDays === 1) {
      // Only one day available between bookings; disable it
      singleDayGaps.push(gapStart);
    }
  }

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
    ...singleDayGaps,
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

  return (
    <div className="flex flex-col">
      <div
        ref={calendarRef}
        className="shadow-custom space-y- relative flex flex-col rounded-2xl border bg-card px-6 py-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          {isExpanded && (
            <div className="">
              <div className="text-2xl font-semibold">Select dates</div>
              <span className="text-sm text-muted-foreground">
                {range.from ? format(range.from, "dd MMM") : "Select date"} -{" "}
                {range.to ? format(range.to, "dd MMM") : "Select date"}
              </span>
            </div>
          )}
          <div className="w-80">
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
                numberOfMonths={2}
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
            <>
              <div className="space-y-4">
                <div
                  className="mt-2 flex w-full items-center justify-between gap-4"
                  onClick={() => setIsExpanded(true)}
                >
                  <Button
                    className={cn(
                      "grid h-fit w-full grid-cols-3 rounded-xl border border-gray-500 bg-card py-1 text-primary outline-none ring-offset-background transition-all duration-300 hover:bg-card",
                      {
                        "ring-2 ring-primary ring-offset-2":
                          isSelectingStartDate && isExpanded,
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
                      <span className="whitespace-nowrap text-sm">
                        Start date
                      </span>
                      <span className="whitespace-nowrap text-lg">
                        {range.from
                          ? format(range.from, "dd MMM")
                          : "Select date"}
                      </span>
                    </div>
                  </Button>
                  <Button
                    className={cn(
                      "grid h-fit w-full grid-cols-3 rounded-xl border border-gray-500 bg-card py-1 text-primary outline-none ring-offset-background transition-all duration-300 hover:bg-card",
                      {
                        "ring-2 ring-primary ring-offset-2":
                          !isSelectingStartDate && isExpanded,
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
                      <span className="whitespace-nowrap text-sm">
                        End date
                      </span>
                      <span className="whitespace-nowrap text-lg">
                        {range.to ? format(range.to, "dd MMM") : "Select date"}
                      </span>
                    </div>
                  </Button>
                </div>

                <div
                  ref={guestsRef}
                  className="rounded-xl border border-gray-500 px-4 py-1"
                >
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
            </>
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2 text-lg font-bold">
                  <span className="selection:bg-card">Total</span>
                  <span>${totalPrice.toLocaleString()}</span>
                </div>
                <Button
                  size="lg"
                  variant={"gooeyLeft"}
                  className="w-full rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 py-6 text-lg font-semibold text-primary after:duration-700"
                >
                  Reserve
                </Button>
                <p className="text-center text-muted-foreground">
                  You will not be charged yet
                </p>
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
}
