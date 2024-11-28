import { Booking } from "@/lib/types";

/**
 * Filters bookings to include only those that are in the future relative to the current date.
 *
 * @param bookings - Array of Booking objects.
 * @returns Array of upcoming Booking objects.
 */
export const getUpcomingBookings = (bookings: Booking[]) => {
  const now = new Date();
  return bookings.filter((booking) => new Date(booking.dateFrom) > now);
};

/**
 * Sorts bookings by the dateFrom in ascending order.
 *
 * @param bookings - Array of Booking objects.
 * @returns Sorted array of Booking objects.
 */
export const sortBookingsByDate = (bookings: Booking[]) => {
  return bookings.sort(
    (a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime(),
  );
};
