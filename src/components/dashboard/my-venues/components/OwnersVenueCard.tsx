import BlurFade from "@/components/ui/blur-fade";
import { useVenueStore } from "@/hooks/useVenueStore";
import { Venue } from "@/lib/types";
import { Link } from "@tanstack/react-router";

interface OwnersVenuesCardProps {
  venues: Venue[];
}

export default function OwnersVenuesCard({ venues }: OwnersVenuesCardProps) {
  return (
    <div className="grid gap-4 pb-8 pt-8 md:grid-cols-3 lg:gap-y-0 xl:grid-cols-4">
      {venues.map((venue, idx) => (
        <BlurFade
          key={venue.id}
          delay={0.15 + idx * 0.05}
          inView
          inViewMargin="150px"
        >
          <Link
            to={`/manage-venues/host-venue/${venue.id}`}
            onClick={() => useVenueStore.getState().setSelectedVenue(venue)}
            className="mb-4 flex flex-col rounded-2xl border-primary/0 transition-all duration-200 hover:border-primary/100 sm:p-2 md:border"
          >
            <img
              src={venue.media?.[0]?.url || "/default-image.jpg"}
              alt={venue.media?.[0]?.alt || "Default alt text"}
              className="aspect-square h-60 w-full rounded-2xl object-cover"
            />

            <div className="my-4 flex flex-col justify-between">
              <h1 className="line-clamp-2 text-lg font-medium capitalize leading-6">
                {venue.name}
              </h1>
              <div className="flex items-center pt-1">
                <span className="">${venue.price}</span>
                <span className="text-muted-foreground">&nbsp;/night</span>
              </div>
            </div>
          </Link>
        </BlurFade>
      ))}
    </div>
  );
}
