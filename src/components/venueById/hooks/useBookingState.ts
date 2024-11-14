import { create } from "zustand";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface BookingState {
  range: DateRange;
  guests: number;
  isSelectingStartDate: boolean;
  setRange: (range: DateRange) => void;
  setGuests: (guests: number) => void;
  setSelectingStartDate: (state: boolean) => void;
}

const useBookingState = create<BookingState>((set) => ({
  range: { from: undefined, to: undefined },
  guests: 1,
  isSelectingStartDate: true,
  setRange: (range) => set({ range }),
  setGuests: (guests) => set({ guests }),
  setSelectingStartDate: (state) => set({ isSelectingStartDate: state }),
}));

export default useBookingState;
