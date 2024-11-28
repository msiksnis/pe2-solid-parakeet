import { Venue, Booking } from "@/lib/types";

/**
 * Processes a venue to extract the next upcoming booking and determine if there are multiple upcoming bookings.
 *
 * @param venue - The venue to process.
 * @returns An object containing the next booking and a flag for multiple upcoming bookings.
 */
export interface UpcomingBookingsForVenue extends Venue {
  nextBooking: Booking | null;
  hasMultipleUpcoming: boolean;
}

export function upcomingVenueBookings(venue: Venue): UpcomingBookingsForVenue {
  const now = new Date();

  // Filter bookings to include only future bookings
  const upcomingBookings = venue.bookings
    ? venue.bookings.filter((booking) => new Date(booking.dateFrom) > now)
    : [];

  // Sort bookings by dateFrom in ascending order
  upcomingBookings.sort(
    (a, b) => new Date(a.dateFrom).getTime() - new Date(b.dateFrom).getTime(),
  );

  const nextBooking = upcomingBookings[0] || null;
  const hasMultipleUpcoming = upcomingBookings.length > 1;

  return {
    ...venue,
    nextBooking,
    hasMultipleUpcoming,
  };
}
