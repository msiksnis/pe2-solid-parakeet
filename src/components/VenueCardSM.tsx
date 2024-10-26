import { Venue } from "@/lib/types";
import { MapPinIcon, StarIcon } from "lucide-react";
import { Button } from "./ui/button";

interface VenueCardProps {
  venues: Venue[];
}

export default function VenueCardSM({ venues }: VenueCardProps) {
  return (
    <>
      {venues.map((venue) => (
        <div key={venue.id} className="mb-4 flex flex-col">
          <img
            src={venue.media?.[0]?.url || "/default-image.jpg"}
            alt={venue.media?.[0]?.alt || "Default alt text"}
            className="h-48 w-full rounded-2xl object-cover"
          />
          <div className="flex h-28 flex-col justify-between">
            <div className="mb-2 mt-4 flex h-12 items-start justify-between">
              <h1 className="line-clamp-2 w-44 text-lg font-medium capitalize leading-6">
                {venue.name}
              </h1>
              <span className="flex items-center">
                <StarIcon className="size-[1.125rem]" />
                <span className="mt-0.5 tabular-nums text-muted-foreground">
                  &nbsp;{venue.rating}&nbsp;
                </span>
                <span className="mt-0.5 text-muted-foreground">Rating</span>
              </span>
            </div>
            <div className="mt-auto flex items-end justify-between">
              <div>
                {venue.location.city && (
                  <div className="flex items-center capitalize">
                    <MapPinIcon className="-ml-0.5 mb-0.5 size-4" />
                    <span className="text-muted-foreground">
                      &nbsp;{venue.location.city}
                    </span>
                  </div>
                )}
                <div className="flex items-center pt-1">
                  <span className="">${venue.price}</span>
                  <span className="text-muted-foreground">&nbsp;/night</span>
                </div>
              </div>
              <Button size="sm" className="mb-1 rounded-full px-6 text-base">
                View
              </Button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
