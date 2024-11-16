import { addDays, isBefore, isWithinInterval } from "date-fns";

interface DateRange {
  from?: Date;
  to?: Date;
}

interface UseDisabledDatesParams {
  bookedRanges: DateRange[];
  currentRange?: DateRange;
  originalRange?: DateRange;
  minimumDays?: number;
  isSelectingStartDate: boolean; // New parameter to track the active date selection
}

export function useDisabledDates({
  bookedRanges,
  currentRange,
  originalRange,
  minimumDays = 2,
  isSelectingStartDate,
}: UseDisabledDatesParams) {
  const sortedRanges = [...bookedRanges].sort(
    (a, b) => (a.from?.getTime() ?? 0) - (b.from?.getTime() ?? 0),
  );

  const isDateInBookedRanges = (date: Date) => {
    return sortedRanges.some(
      (range) =>
        range.from &&
        range.to &&
        isWithinInterval(date, { start: range.from, end: range.to }),
    );
  };

  const isDateInOriginalRange = (date: Date) => {
    if (!originalRange?.from || !originalRange?.to) return false;
    return isWithinInterval(date, {
      start: originalRange.from,
      end: originalRange.to,
    });
  };

  const isDateBetweenBookedRanges = (date: Date) => {
    return sortedRanges.some((range, index) => {
      const nextRange = sortedRanges[index + 1];
      if (!nextRange?.from || !range.to) return false;

      const gapStart = addDays(range.to, 1);
      const gapEnd = addDays(nextRange.from, -1);

      return (
        isWithinInterval(date, { start: gapStart, end: gapEnd }) &&
        gapEnd.getTime() - gapStart.getTime() <
          minimumDays * 24 * 60 * 60 * 1000
      );
    });
  };

  const isDateDisabled = (date: Date): boolean => {
    // Allow dates in the original range explicitly
    if (isDateInOriginalRange(date)) return false;

    // Disable past dates unless in the original range
    if (isBefore(date, new Date()) && !isDateInOriginalRange(date)) return true;

    // Disable dates before the selected current start date (only if selecting the end date)
    if (
      !isSelectingStartDate &&
      currentRange?.from &&
      isBefore(date, currentRange.from)
    )
      return true;

    // Disable dates within booked ranges
    if (isDateInBookedRanges(date)) return true;

    // Disable dates between booked ranges that violate the minimum range
    if (isDateBetweenBookedRanges(date)) return true;

    // Otherwise, the date is enabled
    return false;
  };

  return { isDateDisabled };
}
