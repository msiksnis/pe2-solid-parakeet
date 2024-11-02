import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import {
  Cat,
  CircleParking,
  HeartIcon,
  ImagesIcon,
  ShareIcon,
  Utensils,
  Wifi,
} from "lucide-react";
import { titleCase } from "title-case";

import { Venue } from "@/lib/types";
import ErrorLoadingButton from "../ErrorLoadingButton";
import Loader from "../loader";
import RatingStars from "../RatingStars";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import BookingDetails from "./BookingDetails";
import { fetchVenueById } from "./queries/fetchVenueById";

export default function VenueById() {
  const { id } = useParams({ from: "/venue/$id" }) as { id: string };

  const {
    data: venue,
    isLoading,
    error,
    refetch,
  } = useQuery<Venue>({
    queryKey: ["venue", id],
    queryFn: () => fetchVenueById(id),
    enabled: !!id,
    retry: 2,
  });

  if (isLoading) return <Loader className="mt-60" />;

  const errorMessage =
    error instanceof Error
      ? `Error loading venue details: ${error.message}`
      : "An unexpected error occurred while loading venue details.";

  if (error) {
    return <ErrorLoadingButton errorMessage={errorMessage} onRetry={refetch} />;
  }

  if (!venue) return <p className="my-20">Venue not found.</p>;

  const images = venue.media?.slice(0, 5) || [];
  const totalImages = venue.media?.length || 0;

  const gridClasses =
    images.length === 1
      ? "grid-cols-1 grid-rows-1"
      : images.length === 2
        ? "grid-cols-2 grid-rows-1"
        : images.length >= 3 && images.length < 5
          ? "grid-cols-3 grid-rows-2"
          : "grid-cols-4 grid-rows-2";

  const handleShowAllPhotos = () => {
    // Logic to show all photos will go here
    console.log("Show all photos");
  };

  return (
    <div className="mx-auto mt-10 max-w-7xl space-y-6 px-4 sm:px-6 md:px-10 xl:px-6">
      {/* Venue Header */}
      <div className="flex items-end justify-between">
        <div className="flex items-center text-3xl font-medium">
          <h1>{titleCase(venue.name)}</h1>
          {venue.location?.city && (
            <span className="capitalize">
              &nbsp;|&nbsp;{venue.location.city}
            </span>
          )}
          {venue.location?.country && (
            <span className="capitalize">
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

      {/* Image Gallery */}
      <div className="relative aspect-[2/1] w-full overflow-hidden rounded-2xl">
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

      {/* Venue Details and Booking */}
      <div className="relative flex items-start justify-between gap-14 px-4">
        <div className="w-2/3 space-y-6">
          {/* Todo: AI generated heading here */}
          <div className="text-paragraph text-pretty pb-6 text-lg font-light">
            {venue.description}
          </div>
          <Separator />
          <div className="flex items-center space-x-4">
            <img
              src={venue.owner.avatar.url}
              alt={venue.owner.avatar.alt}
              className="size-10 rounded-full"
            />
            <span>
              Hosted by <span className="capitalize">{venue.owner.name}</span>
            </span>
          </div>
          <Separator />
          <div>
            <h2 className="text-2xl font-semibold">Features and services</h2>
            <div className="mt-8 grid grid-cols-3">
              <div className="space-y-2">
                <div className="">Max Guests: {venue.maxGuests}</div>
                {venue.rating > 0 ? <RatingStars rating={venue.rating} /> : ""}
              </div>
              <div className="space-y-2">
                <span className="flex">
                  <Wifi className="mr-2 size-5" />
                  Wifi
                </span>
                <span className="flex">
                  <CircleParking className="mr-2 size-5" />
                  Parking
                </span>
              </div>
              <div className="space-y-2">
                <span className="flex">
                  <Utensils className="mr-2 size-5" />
                  Breakfast
                </span>
                <span className="flex">
                  <Cat className="mr-2 size-5" />
                  Pets
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-4">
          <BookingDetails venue={venue} />
        </div>
      </div>
    </div>
  );
}
