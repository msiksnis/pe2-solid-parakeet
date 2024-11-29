import { useMemo } from "react";

import BlurFade from "@/components/ui/blur-fade";
import { Venue } from "@/lib/types";
import {
  UpcomingBookingsForVenue,
  upcomingVenueBookings,
} from "../utils/upcomingVenueBookings";
import VenueCard from "./VenueCard";

interface OwnersVenuesProps {
  venues: Venue[];
}

export default function OwnersVenues({ venues }: OwnersVenuesProps) {
  const upcomingBookingsForVenue: UpcomingBookingsForVenue[] = useMemo(() => {
    return venues.map((venue) => upcomingVenueBookings(venue));
  }, [venues]);

  return (
    <div className="grid gap-4 pb-8 pt-8 md:grid-cols-3 lg:gap-y-0 xl:grid-cols-4">
      {upcomingBookingsForVenue.map((venue, idx) => (
        <BlurFade
          key={venue.id}
          delay={0.15 + idx * 0.05}
          inView
          inViewMargin="150px"
        >
          <VenueCard venue={venue} />
        </BlurFade>
      ))}
    </div>
  );
}
