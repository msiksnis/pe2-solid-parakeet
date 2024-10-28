import { useQuery } from "@tanstack/react-query";
import { Venue } from "@/lib/types";
import { fetchVenueById } from "./queries/fetchVenueById";
import { useParams } from "@tanstack/react-router";
import { HeartIcon, ImagesIcon, ShareIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function VenueById() {
  const { id } = useParams({ from: "/venue/$id" }) as { id: string };

  const {
    data: venue,
    isLoading,
    isError,
  } = useQuery<Venue>({
    queryKey: ["venue", id],
    queryFn: () => fetchVenueById(id),
    enabled: !!id,
  });

  console.log(venue);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong...</p>;

  const images = venue?.media?.slice(0, 5) || [];
  const totalImages = venue?.media?.length || 0;

  const gridClasses =
    images.length === 1
      ? "grid-cols-1 grid-rows-1"
      : images.length === 2
        ? "grid-cols-2 grid-rows-1"
        : images.length >= 3 && images.length < 5
          ? "grid-cols-3 grid-rows-2"
          : "grid-cols-4 grid-rows-2";

  // Placeholder for handling button click
  const handleShowAllPhotos = () => {
    // Logic to show all photos will go here
    console.log("Show all photos");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-10 xl:px-6">
      <div className="flex items-end justify-between">
        <div className="flex items-center text-3xl font-medium">
          <h1>{venue?.name}</h1>
          {venue?.location?.city && (
            <span>&nbsp;|&nbsp;{venue.location.city}</span>
          )}
          {venue?.location?.country && (
            <span>
              {venue.location.city ? ", " : "&nbsp;|&nbsp;"}
              {venue.location.country}
            </span>
          )}
        </div>
        <div className="flex items-center gap-8">
          <Button variant="ghost" className="flex items-center text-lg">
            <ShareIcon className="mr-2 size-6" />
            Share
          </Button>
          <Button variant="ghost" className="flex items-center text-lg">
            <HeartIcon className="mr-2 size-6" />
            Save
          </Button>
        </div>
      </div>
      <div className="relative mt-6 aspect-[2/1] w-full overflow-hidden rounded-2xl">
        <div className={`grid ${gridClasses} h-full gap-2`}>
          {images.map((media, index) => (
            <img
              key={media.url}
              src={media.url}
              alt={media.alt || "Venue image"}
              className={`h-full w-full object-cover ${
                index === 0 && images.length >= 3 ? "col-span-2 row-span-2" : ""
              }`}
            />
          ))}
        </div>
        {totalImages > 5 && (
          <div className="absolute bottom-4 right-4">
            <Button
              onClick={handleShowAllPhotos}
              className="bg-primary/80 text-lg transition-all duration-300 hover:bg-primary/100"
            >
              <ImagesIcon className="mr-1 size-6" />
              {`${totalImages} photos`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
