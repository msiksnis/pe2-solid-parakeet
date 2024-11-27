import { clsx, type ClassValue } from "clsx";
import axios from "axios";
import { addDays, differenceInCalendarDays } from "date-fns";
import { useMediaQuery } from "react-responsive";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const useScreenSizes = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isMedium = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1279px)",
  });
  const isExtraLarge = useMediaQuery({ query: "(min-width: 1280px)" });
  const smCalendarContainer = useMediaQuery({
    query: "(max-width: 779px)",
  });
  const mdCalendarContainer = useMediaQuery({
    query: "(min-width: 780px) and (max-width: 1060px)",
  });

  return {
    isMobile,
    isMedium,
    isExtraLarge,
    smCalendarContainer,
    mdCalendarContainer,
  };
};

export function calculateTotalPrice(
  startDate: Date,
  endDate: Date,
  pricePerNight: number,
): number {
  const numberOfNights = differenceInCalendarDays(endDate, startDate);
  if (numberOfNights <= 0) {
    return 0;
  }
  return numberOfNights * pricePerNight;
}

export function getAuthStatus() {
  const isLoggedIn = Boolean(localStorage.getItem("state.token"));
  const isVenueManager =
    JSON.parse(localStorage.getItem("state.venueManager") || "{}") ===
    "venueManager";

  return { isLoggedIn, isVenueManager };
}

export function calculateSingleDayGaps(
  bookedDateRanges: { from: Date; to: Date }[],
) {
  const singleDayGaps: Date[] = [];

  for (let i = 0; i < bookedDateRanges.length - 1; i++) {
    const current = bookedDateRanges[i];
    const next = bookedDateRanges[i + 1];

    const gapStart = addDays(current.to, 1);
    const gapEnd = addDays(next.from, -1);

    if (differenceInCalendarDays(gapEnd, gapStart) === 1) {
      singleDayGaps.push(gapStart);
    }
  }

  return singleDayGaps;
}

/**
 * Extracts and returns a user-friendly error message from an Axios error or a generic message.
 *
 * @param error - The error object caught in a catch block.
 * @returns A string representing the error message.
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    return typeof message === "string"
      ? message
      : "An unexpected error occurred.";
  }

  return "An unexpected error occurred.";
};
