import { Button } from "@/components/ui/button.tsx";
import { Minus, Plus, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils.ts";

interface GuestControlProps {
  guests: number;
  maxGuests: number;
  incrementGuests: () => void;
  decrementGuests: () => void;
  guestControlExpanded: boolean;
  toggleGuestControl: () => void;
}

export default function GuestControl({
  guests,
  maxGuests,
  incrementGuests,
  decrementGuests,
  guestControlExpanded,
  toggleGuestControl,
}: GuestControlProps) {
  return (
    <div className="relative h-32">
      <div className="absolute w-full rounded-xl border border-gray-500 px-4 py-1">
        <div
          className="grid cursor-pointer grid-cols-5"
          onClick={toggleGuestControl}
        >
          <div className="col-span-4 grid">
            <span className="whitespace-nowrap text-sm">Guests</span>
            <span className="whitespace-nowrap text-lg">
              {guests} {guests > 1 ? "guests" : "guest"}
            </span>
          </div>
          <ChevronDown
            className={cn("ml-auto mt-2 opacity-60 transition duration-200", {
              "rotate-180": guestControlExpanded,
            })}
          />
        </div>
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: guestControlExpanded ? "auto" : 0,
            opacity: guestControlExpanded ? 1 : 0,
          }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="overflow-hidden"
        >
          <div className="col-span-5 mb-2 mt-4 flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="size-6 rounded-full border-gray-500"
              onClick={decrementGuests}
              disabled={guests <= 1}
            >
              <Minus />
            </Button>
            <span className="tabular-nums selection:bg-card">{guests}</span>
            <Button
              variant="outline"
              size="icon"
              className="size-6 rounded-full border-gray-500"
              onClick={incrementGuests}
              disabled={guests >= maxGuests}
            >
              <Plus />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
