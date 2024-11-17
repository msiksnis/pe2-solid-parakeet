import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateSelectionControlsProps {
  range: { from?: Date; to?: Date };
  setIsSelectingStartDate: (isSelecting: boolean) => void;
  isSelectingStartDate: boolean;
}

export default function DateSelectionControls({
  range,
  setIsSelectingStartDate,
  isSelectingStartDate,
}: DateSelectionControlsProps) {
  return (
    <div className="@[520px]/calendar:flex-col mt-2 flex w-full items-center gap-4">
      <Button
        className={cn(
          "grid h-fit w-full grid-cols-3 rounded-xl border border-gray-500 bg-card px-0 py-1 text-primary outline-none ring-offset-background transition-all duration-300 hover:bg-card",
          {
            "ring-2 ring-primary ring-offset-2": isSelectingStartDate,
          },
        )}
        onClick={() => setIsSelectingStartDate(true)}
      >
        <span className="col-span-1 m-auto">
          <CalendarDays />
        </span>
        <div className="col-span-2 flex flex-col items-start">
          <span className="whitespace-nowrap text-sm">Start date</span>
          <span className={cn("whitespace-nowrap text-lg")}>
            {range.from ? format(range.from, "dd MMM") : "Select date"}
          </span>
        </div>
      </Button>
      <Button
        className={cn(
          "grid h-fit w-full grid-cols-3 rounded-xl border border-gray-500 bg-card px-0 py-1 text-primary outline-none ring-offset-background transition-all duration-300 hover:bg-card",
          {
            "ring-2 ring-primary ring-offset-2": !isSelectingStartDate,
          },
        )}
        onClick={() => {
          if (range.from) {
            setIsSelectingStartDate(false);
          }
        }}
        disabled={!range.from}
      >
        <span className="col-span-1 m-auto">
          <CalendarDays />
        </span>
        <div className="col-span-2 flex flex-col items-start">
          <span className="whitespace-nowrap text-sm">End date</span>
          <span className={cn("whitespace-nowrap text-lg")}>
            {range.to ? format(range.to, "dd MMM") : "Select date"}
          </span>
        </div>
      </Button>
    </div>
  );
}
