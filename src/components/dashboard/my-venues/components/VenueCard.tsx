import {
  Carousel,
  CarouselBullets,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/Carousel";
import { useVenueStore } from "@/hooks/useVenueStore";
import { Link } from "@tanstack/react-router";
import { UpcomingBookingsForVenue } from "../utils/upcomingVenueBookings";
import { format } from "date-fns";

interface VenueCardProps {
  venue: UpcomingBookingsForVenue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const { id, media, name, price, nextBooking, hasMultipleUpcoming } = venue;

  const handleViewAllBookings = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Implement your modal open logic here, e.g.:
    // openBookingsModal(venue.id);
    console.log(`Open all bookings for venue ${venue.id}`);
  };

  return (
    <Link
      to={`/manage-venues/host-venue/${id}`}
      onClick={() => useVenueStore.getState().setSelectedVenue(venue)}
      className="group/card mb-4 flex flex-col rounded-2xl border-primary/0 transition-all duration-200 hover:border-primary/100 sm:p-2 md:border"
    >
      <Carousel className="w-full">
        <CarouselContent>
          {media?.length > 0 ? (
            media.map((mediaItem, i) => (
              <CarouselItem key={i}>
                <img
                  src={mediaItem.url || "/default-image.jpg"}
                  alt={mediaItem.alt || "Venue image"}
                  className="aspect-square h-60 w-full rounded-2xl object-cover"
                />
              </CarouselItem>
            ))
          ) : (
            <CarouselItem>
              <img
                src="/default-image.jpg"
                alt="Default Venue"
                className="aspect-square h-60 w-full rounded-2xl object-cover"
              />
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselBullets />
      </Carousel>

      <div className="my-4 flex flex-col justify-between">
        <h1 className="line-clamp-2 text-lg font-medium capitalize leading-6">
          {name}
        </h1>
        <div className="flex items-center pt-1">
          <span>${price}</span>
          <span className="text-muted-foreground">&nbsp;/night</span>
        </div>
      </div>

      {/* Upcoming Booking Information */}
      <div className="mt-auto">
        {nextBooking ? (
          <div className="mt-2">
            <div className="text-paragraph">Next Booking</div>
            <div className="text-sm">
              {format(nextBooking.dateFrom, "d MMM yyyy")} -{" "}
              {format(nextBooking.dateTo, "d MMM yyyy")}
            </div>
            {hasMultipleUpcoming && (
              <button
                onClick={handleViewAllBookings}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                View All Upcoming Bookings
              </button>
            )}
          </div>
        ) : (
          <div className="mt-2 text-sm text-muted-foreground">
            No upcoming bookings
          </div>
        )}
      </div>
    </Link>
  );
}
