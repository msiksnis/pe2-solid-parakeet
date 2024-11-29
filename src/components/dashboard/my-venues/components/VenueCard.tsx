import { useState } from "react";
import { format } from "date-fns";
import { Link } from "@tanstack/react-router";

import {
  Carousel,
  CarouselBullets,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/Carousel";
import { useVenueStore } from "@/hooks/useVenueStore";
import { UpcomingBookingsForVenue } from "../utils/upcomingVenueBookings";
import { Button } from "@/components/ui/button";
import UpcomingBookingsModal from "./UpcomingBookingsModal";

interface VenueCardProps {
  venue: UpcomingBookingsForVenue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { id, media, name, price, nextBooking, hasMultipleUpcoming } = venue;

  const handleViewAllBookings = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  return (
    <div className="group/card mb-4 flex flex-col rounded-2xl border-primary/0 transition-all duration-200 hover:border-primary/100 sm:p-2 md:border">
      <Link
        to={`/manage-venues/host-venue/${id}`}
        onClick={() => useVenueStore.getState().setSelectedVenue(venue)}
        className="flex flex-col"
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
        <div className="mt-auto p-2">
          {nextBooking ? (
            <div>
              <div className="text-paragraph">Next Booking</div>
              <div className="text-sm">
                {format(new Date(nextBooking.dateFrom), "d MMM yyyy")} -{" "}
                {format(new Date(nextBooking.dateTo), "d MMM yyyy")}
              </div>
              {hasMultipleUpcoming && (
                <Button
                  variant={"linkHover1"}
                  onClick={handleViewAllBookings}
                  className="mt-2 px-0 after:w-full"
                >
                  View All Upcoming Bookings
                </Button>
              )}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No upcoming bookings
            </div>
          )}
        </div>
      </Link>

      {hasMultipleUpcoming && (
        <UpcomingBookingsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          bookings={venue.bookings}
          venueName={name}
        />
      )}
    </div>
  );
}
