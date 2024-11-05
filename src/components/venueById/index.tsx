import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import {
  Cat,
  CircleParking,
  HeartIcon,
  ImagesIcon,
  ShareIcon,
  User,
  Utensils,
  Wifi,
} from "lucide-react";
import { titleCase } from "title-case";

import { Venue } from "@/lib/types";
import { cn, useScreenSizes } from "@/lib/utils";
import ErrorLoadingButton from "../ErrorLoadingButton";
import Loader from "../loader";
import RatingStars from "../RatingStars";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import BookingDetails from "./BookingDetails";
import BookingDetailsMobile from "./BookingDetailsMobile";
import { fetchVenueById } from "./queries/fetchVenueById";

export default function VenueById() {
  const { id } = useParams({ from: "/venue/$id" }) as { id: string };

  const { smCalendarContainer } = useScreenSizes();

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

  const mobileImages = venue.media?.slice(0, 3) || [];

  const handleShowAllPhotos = () => {
    // Logic to show all photos will go here
    console.log("Show all photos");
  };

  return (
    <div className="mt-10 max-w-7xl space-y-6 px-4 sm:px-6 md:px-10 xl:px-6">
      {/* Venue Header */}
      <div className="flex flex-col justify-between space-y-4 lg:flex-row lg:items-end lg:space-y-0">
        <div className="flex flex-col text-3xl font-medium lg:flex-row lg:items-center">
          <h1>{titleCase(venue.name)}</h1>
          <span>
            {venue.location?.city && (
              <span className="capitalize">
                <span className="hidden font-normal lg:inline">
                  &nbsp;|&nbsp;
                </span>
                {venue.location.city}
              </span>
            )}
            {venue.location?.country && (
              <span className="capitalize">
                {venue.location.city ? ", " : "&nbsp;|&nbsp;"}
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

      {/* Image Gallery */}
      <div className="relative w-full overflow-hidden md:aspect-[2/1] md:rounded-2xl">
        <div className={`hidden md:grid ${gridClasses} h-full gap-2`}>
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
        <div className="grid w-[calc(100vw)] grid-cols-2 grid-rows-2 gap-2 md:hidden">
          {mobileImages.map((media, index) => {
            const className = cn(
              "w-full object-cover",
              mobileImages.length === 1
                ? "col-span-2 row-span-2"
                : mobileImages.length === 2
                  ? index === 0
                    ? "col-span-2 row-start-1 aspect-[2/1]"
                    : "col-span-2 row-start-2 aspect-[2/1]"
                  : mobileImages.length === 3 && index === 0
                    ? "col-span-2 row-start-1 aspect-[2/1]"
                    : index === 1
                      ? "col-span-1 row-start-2 aspect-square"
                      : "col-span-1 col-start-2 row-start-2 aspect-square",
            );

            return (
              <img
                key={media.url}
                src={media.url}
                alt={media.alt || "Venue image"}
                className={className}
              />
            );
          })}
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
      <div className="relative flex items-start justify-between gap-14 px-4 xl:px-0">
        <div
          className={cn(
            "w-[calc(100%-400px)] space-y-6 xl:w-[calc(100%-420px)]",
            {
              "w-full": smCalendarContainer,
            },
          )}
        >
          {/* Todo: AI generated heading here */}
          <div className="text-paragraph text-pretty pb-6 text-lg font-light">
            {venue.description}
          </div>
          <Separator />
          <div className="hidden items-center space-x-4 md:flex">
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={venue.owner.avatar.url}
                alt={venue.owner.avatar.alt}
              />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <span>
              Hosted by <span className="capitalize">{venue.owner.name}</span>
            </span>
          </div>
          <Separator className="hidden md:flex" />
          <div>
            <h2 className="text-2xl font-semibold">Features and services</h2>
            <div className="my-8 grid grid-cols-1 sm:grid-cols-3">
              <div className="space-y-2">
                <div className="text-lg">Max Guests: {venue.maxGuests}</div>
                {venue.rating > 0 ? <RatingStars rating={venue.rating} /> : ""}
              </div>
              <div className="mt-8 space-y-2 sm:mt-0">
                {venue.meta.wifi && (
                  <span className="flex">
                    <Wifi className="mr-2 size-5" />
                    Wifi
                  </span>
                )}
                {venue.meta.parking && (
                  <span className="flex">
                    <CircleParking className="mr-2 size-5" />
                    Parking
                  </span>
                )}
              </div>
              <div className="mt-2 space-y-2 sm:mt-0">
                {venue.meta.breakfast && (
                  <span className="flex">
                    <Utensils className="mr-2 size-5" />
                    Breakfast
                  </span>
                )}
                {venue.meta.pets && (
                  <span className="flex">
                    <Cat className="mr-2 size-5" />
                    Pets
                  </span>
                )}
              </div>
            </div>
          </div>

          <BookingDetailsMobile venue={venue} />
          <div className="space-y-6 md:hidden">
            <Separator />
            <div className="flex items-center space-x-4">
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={venue.owner.avatar.url}
                  alt={venue.owner.avatar.alt}
                />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <span>
                Hosted by <span className="capitalize">{venue.owner.name}</span>
              </span>
            </div>
            <Separator />
          </div>
        </div>
        <div className="absolute right-0 xl:right-4">
          <BookingDetails venue={venue} />
        </div>
      </div>
    </div>
  );
}
