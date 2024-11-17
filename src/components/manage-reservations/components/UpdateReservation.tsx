import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { endOfDay, format, startOfDay } from "date-fns";
import { motion } from "framer-motion";
import { CalendarDays, ChevronDown, Minus, Plus } from "lucide-react";
import { useState } from "react";

import ErrorLoadingButton from "@/components/ErrorLoadingButton";
import MainLoader from "@/components/MainLoader";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useDisabledDates } from "@/hooks/useDisabledDates";
import { Venue } from "@/lib/types";
import { cn, useScreenSizes } from "@/lib/utils";
import { Route } from "@/routes/manage-reservations/$id";
import { useUpdateReservationMutation } from "../mutations/useUpdateReservationMutation";
import { fetchVenueById } from "../queries/fetchVenueById";
import { toZonedTime } from "date-fns-tz";

interface Range {
  from: Date | undefined;
  to: Date | undefined;
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

  console.log("Mapped Booked Ranges:", bookedRanges);

  const { isDateDisabled } = useDisabledDates({
    bookedRanges,
    currentRange: range as Range,
    originalRange: originalRange as Range,
    minimumDays: 1,
    isSelectingStartDate,
  });

  console.log("Current Range:", range);
  console.log("Original Range:", originalRange);

  const updateNavigate = (
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

      updateNavigate(
        format(newDay, "yyyy-MM-dd"),
        range.to && newDay <= range.to
          ? format(range.to, "yyyy-MM-dd")
          : undefined,
      );
    } else if (range.from && newDay > range.from) {
      // If selecting an end date, ensure it is after the start date
      const newTo = endOfDay(day);
      setRange({ ...range, to: newTo });

      updateNavigate(
        range.from ? format(range.from, "yyyy-MM-dd") : undefined,
        format(newTo, "yyyy-MM-dd"),
      );
    } else {
      // Reset to a new start date if the range is invalid
      setRange({ from: newDay, to: undefined });
      setIsSelectingStartDate(false);

      updateNavigate(format(newDay, "yyyy-MM-dd"), undefined);
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

  const incrementGuests = () => {
    if (guests < venue.maxGuests) {
      navigate({
        search: (prev) => ({
          ...prev,
          guests: guests + 1,
        }),
        resetScroll: false,
      });
    }
  };

  const decrementGuests = () => {
    if (guests > 1) {
      navigate({
        search: (prev) => ({
          ...prev,
          guests: guests - 1,
        }),
        resetScroll: false,
      });
    }
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
          <div className="@[520px]/calendar:flex-col mt-2 flex w-full items-center gap-4">
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
                    onClick={decrementGuests}
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
                    onClick={incrementGuests}
                    disabled={guests >= venue.maxGuests}
                  >
                    <Plus />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-end gap-x-4">
        <Button
          size={"lg"}
          variant={"gooeyLeft"}
          //   onClick={cancelReservation}
          className="border border-primary bg-muted from-gray-200 text-base text-primary after:duration-500"
        >
          Cancel reservation
        </Button>
        <Button
          size={"lg"}
          variant={"gooeyLeft"}
          onClick={handleUpdate}
          disabled={!range.from || !range.to}
          className="text-base after:duration-500"
        >
          Update reservation
        </Button>
      </div>
    </div>
  );
}
