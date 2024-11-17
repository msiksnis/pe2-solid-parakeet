import { startOfDay, endOfDay, format } from "date-fns";

interface DateSelectionParams {
  day: Date;
  range: { from?: Date; to?: Date };
  setRange: React.Dispatch<React.SetStateAction<{ from?: Date; to?: Date }>>;
  setIsSelectingStartDate: (isSelecting: boolean) => void;
  updateDates: (
    startDate: string | undefined,
    endDate: string | undefined,
  ) => void;
}

export function handleDateSelection({
  day,
  setRange,
  setIsSelectingStartDate,
  updateDates,
}: DateSelectionParams) {
  const newDay = startOfDay(day);

  setRange((prevRange) => {
    if (!prevRange.from || newDay > (prevRange.to ?? newDay)) {
      setIsSelectingStartDate(false);
      updateDates(format(newDay, "yyyy-MM-dd"), undefined);
      return { from: newDay, to: undefined };
    } else if (prevRange.from && (!prevRange.to || newDay > prevRange.from)) {
      const newTo = endOfDay(day);
      updateDates(
        format(prevRange.from, "yyyy-MM-dd"),
        format(newTo, "yyyy-MM-dd"),
      );
      return { ...prevRange, to: newTo };
    } else {
      setIsSelectingStartDate(false);
      updateDates(format(newDay, "yyyy-MM-dd"), undefined);
      return { from: newDay, to: undefined };
    }
  });
}

export function incrementGuests(
  currentGuests: number,
  maxGuests: number,
  updateGuests: (guests: number) => void,
) {
  if (currentGuests < maxGuests) {
    updateGuests(currentGuests + 1);
  }
}

export function decrementGuests(
  currentGuests: number,
  minGuests: number,
  updateGuests: (guests: number) => void,
) {
  if (currentGuests > minGuests) {
    updateGuests(currentGuests - 1);
  }
}
