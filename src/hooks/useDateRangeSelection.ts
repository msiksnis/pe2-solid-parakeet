import {
  format,
  startOfDay,
  endOfDay,
  areIntervalsOverlapping,
} from "date-fns";
import { DayClickEventHandler } from "react-day-picker";

interface Range {
  from: Date | undefined;
  to: Date | undefined;
}

interface SearchParams {
  start_date?: string;
  end_date?: string;
}

function isDateRangeOverlapping(
  startDate: Date,
  endDate: Date,
  bookedRanges: { from: Date; to: Date }[],
): boolean {
  return bookedRanges.some((bookedRange) =>
    areIntervalsOverlapping(
      { start: startDate, end: endDate },
      { start: bookedRange.from, end: bookedRange.to },
      { inclusive: true },
    ),
  );
}

export function useDateRangeSelection(
  bookedDateRanges: { from: Date; to: Date }[],
  navigate: (options: {
    search: (prev: SearchParams) => SearchParams;
    resetScroll: boolean;
  }) => void,
  range: Range,
  setRange: React.Dispatch<React.SetStateAction<Range>>,
  isSelectingStartDate: boolean,
  setIsSelectingStartDate: React.Dispatch<React.SetStateAction<boolean>>,
) {
  const handleDateSelect: DayClickEventHandler = (selectedDate, modifiers) => {
    if (modifiers.disabled) return;

    if (isSelectingStartDate) {
      setRange({ from: selectedDate, to: undefined });
      setIsSelectingStartDate(false);

      navigate({
        search: (prev: SearchParams) => ({
          ...prev,
          start_date: format(selectedDate, "yyyy-MM-dd"),
          end_date: undefined,
        }),
        resetScroll: false,
      });
    } else {
      if (range.from && selectedDate > range.from) {
        const startDate = startOfDay(range.from);
        const endDate = endOfDay(selectedDate);

        if (isDateRangeOverlapping(startDate, endDate, bookedDateRanges)) {
          alert(
            "The selected dates include unavailable dates. Please choose a different range.",
          );
          return;
        }

        setRange((prevRange) => ({ ...prevRange, to: selectedDate }));

        navigate({
          search: (prev: SearchParams) => ({
            ...prev,
            end_date: format(selectedDate, "yyyy-MM-dd"),
          }),
          resetScroll: false,
        });
      }
    }
  };

  return { handleDateSelect };
}
