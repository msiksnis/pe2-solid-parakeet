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

  return { isMobile, isMedium, isExtraLarge };
};

export function calculateTotalPrice(
  startDate: Date,
  endDate: Date,
  pricePerNight: number,
  // guests: number
): number {
  const numberOfNights = differenceInCalendarDays(endDate, startDate);
  if (numberOfNights <= 0) {
    return 0;
  }
  // Adjust this calculation if price depends on guests
  return numberOfNights * pricePerNight;
}
