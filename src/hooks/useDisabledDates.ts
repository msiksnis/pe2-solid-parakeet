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
}

export function useDisabledDates({
  bookedRanges,
  currentRange,
  originalRange,
  minimumDays = 2,
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
    if (isBefore(date, new Date())) return true;
    if (currentRange?.from && isBefore(date, currentRange.from)) return true;
    if (isDateInOriginalRange(date)) return false;
    if (isDateInBookedRanges(date)) return true;
    if (isDateBetweenBookedRanges(date)) return true;
    return false;
  };

  return { isDateDisabled };
}
