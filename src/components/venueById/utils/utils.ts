import { format } from "date-fns";
import { Booking } from "./BookingValidation";

export const createBooking = (
  venueId: string,
  guests: number,
  rangeFrom: Date | undefined,
  rangeTo: Date | undefined,
): Omit<Booking, "id"> => {
  if (!rangeFrom || !rangeTo) {
    throw new Error("Both rangeFrom and rangeTo must be defined");
  }

  return {
    created: format(new Date(), "yyyy-MM-dd"),
    updated: format(new Date(), "yyyy-MM-dd"),
    venueId,
    guests,
    dateFrom: format(rangeFrom, "yyyy-MM-dd"),
    dateTo: format(rangeTo, "yyyy-MM-dd"),
  };
};
