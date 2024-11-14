import { addDays, differenceInCalendarDays } from "date-fns";

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
