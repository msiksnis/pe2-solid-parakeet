import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { differenceInCalendarDays } from "date-fns";
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

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    return typeof message === "string"
      ? message
      : "An unexpected error occurred.";
  }

  return "An unexpected error occurred.";
};
