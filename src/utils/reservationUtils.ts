import { startOfDay, endOfDay, format } from "date-fns";

interface DateSelectionParams {
  day: Date;
  range: { from?: Date; to?: Date };
  isSelectingStartDate: boolean;
  setRange: React.Dispatch<React.SetStateAction<{ from?: Date; to?: Date }>>;
  setIsSelectingStartDate: (isSelecting: boolean) => void;
  updateDates: (
    startDate: string | undefined,
    endDate: string | undefined,
  ) => void;
}

export function handleDateSelection({
  day,
  range,
  isSelectingStartDate,
  setRange,
  setIsSelectingStartDate,
  updateDates,
}: DateSelectionParams) {
  const newDay = startOfDay(day);

  if (isSelectingStartDate) {
    // Set the new start date
    setRange((prevRange) => ({
      from: newDay,
      to: prevRange.to && newDay > prevRange.to ? undefined : prevRange.to,
    }));

    // Automatically switch to selecting the end date
    setIsSelectingStartDate(false);

    updateDates(
      format(newDay, "yyyy-MM-dd"),
      range.to && newDay <= range.to
        ? format(range.to, "yyyy-MM-dd")
        : undefined,
    );
  } else if (range.from && newDay >= range.from) {
    // Valid end date selected
    const newTo = endOfDay(day);
    setRange({ ...range, to: newTo });

    updateDates(
      range.from ? format(range.from, "yyyy-MM-dd") : undefined,
      format(newTo, "yyyy-MM-dd"),
    );
  } else {
    // End date is before start date; reset the selection
    setRange({ from: newDay, to: undefined });
    setIsSelectingStartDate(false);

    updateDates(format(newDay, "yyyy-MM-dd"), undefined);
  }
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
