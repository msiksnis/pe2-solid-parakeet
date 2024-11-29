import { format } from "date-fns";

export interface Booking {
  id?: string;
  venueId: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  created: string;
  updated: string;
}

export const defaultValues = {
  dateFrom: "",
  dateTo: "",
  guests: 1,
  venueId: "",
};

export const createTempBooking = (data: Partial<Booking>): Booking => ({
  id: `temp-${Date.now()}`,
  dateFrom: data.dateFrom ?? "Temporary Date From",
  dateTo: data.dateTo ?? "Temporary Date To",
  guests: data.guests ?? 1,
  venueId: data.venueId ?? "Temporary Venue Id",
  created: format(new Date(), "yyyy-MM-dd"),
  updated: format(new Date(), "yyyy-MM-dd"),
});
