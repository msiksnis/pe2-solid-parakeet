import { HeartIcon, ShareIcon } from "lucide-react";
import { titleCase } from "title-case";

import { useAuthStore } from "@/hooks/useAuthStore";
import { Venue } from "@/lib/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface VenueHeaderProps {
  venue: Venue;
}

export default function VenueHeader({ venue }: VenueHeaderProps) {
  const { favorites, addFavorite, removeFavorite } = useAuthStore();

  const toggleFavorite = (venueId: string) => {
    if (favorites.includes(venueId)) {
      removeFavorite(venueId);
    } else {
      addFavorite(venueId);
    }
  };

  const copyUrlToShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

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
        <button
          onClick={copyUrlToShare}
          className="flex items-center rounded-md text-lg lg:px-4 lg:py-2 lg:hover:bg-accent lg:hover:text-accent-foreground"
        >
          <ShareIcon className="mr-2 size-6" />
          Share
        </button>
        <button
          onClick={() => toggleFavorite(venue.id)}
          className="flex items-center rounded-md text-lg lg:px-4 lg:py-2 lg:hover:bg-accent lg:hover:text-accent-foreground"
        >
          <HeartIcon
            className={cn("mr-2 size-6", {
              "fill-destructive text-destructive": favorites.includes(venue.id),
            })}
          />
          {favorites.includes(venue.id) ? "Saved" : "Save"}
        </button>
      </div>
    </div>
  );
}
