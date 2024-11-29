import { Venue } from "@/lib/types";
import { HeartIcon, ShareIcon } from "lucide-react";
import { titleCase } from "title-case";

interface VenueHeaderProps {
  venue: Venue;
}

export default function VenueHeader({ venue }: VenueHeaderProps) {
  return (
    <div className="flex flex-col justify-between space-y-4 lg:flex-row lg:items-end lg:space-y-0">
      <div className="flex flex-col font-medium">
        <h1 className="text-3xl">{titleCase(venue.name)}</h1>
        <span className="text-lg text-paragraph">
          {venue.location?.city && (
            <span className="capitalize">{venue.location.city}</span>
          )}
          {venue.location?.country && (
            <span className="capitalize">
              {venue.location.city && ", "}
              {venue.location.country}
            </span>
          )}
        </span>
      </div>
      <div className="flex items-center gap-8">
        <button className="flex items-center rounded-md text-lg lg:px-4 lg:py-2 lg:hover:bg-accent lg:hover:text-accent-foreground">
          <ShareIcon className="mr-2 size-6" />
          Share
        </button>
        <button className="flex items-center rounded-md text-lg lg:px-4 lg:py-2 lg:hover:bg-accent lg:hover:text-accent-foreground">
          <HeartIcon className="mr-2 size-6" />
          Save
        </button>
      </div>
    </div>
  );
}
