import {
  startOfDay,
  endOfDay,
  isWithinInterval,
  isBefore,
  addDays,
} from "date-fns";
import { toZonedTime } from "date-fns-tz";

interface Range {
  from?: Date | undefined;
  to?: Date | undefined;
}

interface UseDisabledDatesParams {
  bookedRanges: Range[];
  currentRange: Range;
  originalRange: Range;
  minimumDays?: number;
  isSelectingStartDate: boolean;
}

/**
 * Hook to determine whether specific dates should be disabled based on booked ranges,
 * current selection, original range, and other constraints like minimum days.
 * @param {Range[]} bookedRanges - The list of date ranges that are already booked.
 * @returns {Object} - An object containing the `isDateDisabled` function.
 */
export function useDisabledDates({
  bookedRanges,
  // currentRange,
  originalRange,
  minimumDays = 1,
  // isSelectingStartDate,
}: UseDisabledDatesParams) {
  const timezone = "Europe/Oslo";

  const sortedRanges = [...bookedRanges]
    .map((range) => ({
      from: range.from
        ? startOfDay(toZonedTime(range.from, timezone))
        : undefined,
      to: range.to ? endOfDay(toZonedTime(range.to, timezone)) : undefined,
    }))
    .sort((a, b) => (a.from?.getTime() ?? 0) - (b.from?.getTime() ?? 0));

  const isDateInBookedRanges = (date: Date) =>
    sortedRanges.some(
      (range) =>
        range.from &&
        range.to &&
        isWithinInterval(date, { start: range.from, end: range.to }),
    );

  const isDateInOriginalRange = (date: Date) => {
    if (!originalRange?.from || !originalRange?.to) return false;
    return isWithinInterval(date, {
      start: startOfDay(originalRange.from),
      end: endOfDay(originalRange.to),
    });
  };

  const isDateBetweenBookedRanges = (date: Date) => {
    return sortedRanges.some((range, index) => {
      const nextRange = sortedRanges[index + 1];
      if (!nextRange?.from || !range.to) return false;

      const gapStart = addDays(range.to, 1);
      const gapEnd = addDays(nextRange.from, -1);

      const gapSizeInDays = Math.ceil(
        (gapEnd.getTime() - gapStart.getTime()) / (24 * 60 * 60 * 1000),
      );

      return (
        gapSizeInDays < minimumDays &&
        isWithinInterval(date, { start: gapStart, end: gapEnd })
      );
    });
  };

  /**
   * Determines if a given date should be disabled.
   *
   * @param {Date} date - The date to check.
   * @returns {boolean} - Whether the date should be disabled.
   */
  const isDateDisabled = (date: Date): boolean => {
    const normalizedDate = startOfDay(toZonedTime(date, timezone));

    if (isDateInOriginalRange(normalizedDate)) return false;

    if (
      isBefore(normalizedDate, startOfDay(new Date())) &&
      !isDateInOriginalRange(normalizedDate)
    )
      return true;

    //* Uncomment this block to disable dates before the current start date
    // if (
    //   !isSelectingStartDate &&
    //   currentRange?.from &&
    //   isBefore(normalizedDate, startOfDay(currentRange.from))
    // )
    //   return true;

    if (isDateInBookedRanges(normalizedDate)) return true;

    if (isDateBetweenBookedRanges(normalizedDate)) return true;

    return false;
  };

  return { isDateDisabled };
}
