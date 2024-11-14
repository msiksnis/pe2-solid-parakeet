import { useRef, useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Cat,
  ChevronRight,
  CircleParking,
  HeartIcon,
  ImagesIcon,
  ShareIcon,
  User,
  Utensils,
  Wifi,
} from "lucide-react";
import { titleCase } from "title-case";

import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";

import { Venue } from "@/lib/types";
import { cn, useScreenSizes } from "@/lib/utils";
import ErrorLoadingButton from "../ErrorLoadingButton";
import RatingStars from "../RatingStars";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import BookingDetails from "./BookingDetails";
import BookingDetailsMobile from "./BookingDetailsMobile";
import { fetchVenueById } from "./queries/fetchVenueById";
import DescriptionModal from "../DescriptionModal";
import { useBookingMutation } from "./mutations/useBookingMutation";
import { Booking } from "./BookingValidation";
import MainLoader from "../MainLoader";

export default function VenueById() {
  const { id } = useParams({ from: "/venue/$id" }) as { id: string };
  const navigate = useNavigate();

  const [openDescriptionModal, sEtOpenDescriptionModal] = useState(false);

  const galleryRef = useRef<any>(null);

  const { smCalendarContainer } = useScreenSizes();

  const bookingMutation = useBookingMutation();

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

  const handleReserve = (data: Booking) => {
    bookingMutation.mutate(
      {
        isUpdate: false,
        data,
      },
      {
        onSuccess: () => {
          navigate({ to: "/manage-reservations" });
        },
        onError: (error) => {
          console.error("Error reserving booking:", error);
        },
      },
    );
  };

  const handleOpenGallery = useCallback(
    (index: number) => {
      if (galleryRef.current) {
        galleryRef.current.openGallery(index);
      }
    },
    [galleryRef],
  );

  if (isLoading) return <MainLoader className="mt-60" />;

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

  return (
    <div className="mx-auto mt-10 max-w-7xl space-y-6 px-4 sm:px-6 md:px-10 xl:px-6">
      {/* Venue Header */}
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

      {/* Image Gallery */}
      <div className="relative w-full overflow-hidden md:aspect-[2/1] md:rounded-2xl">
        <div className={`hidden md:grid ${gridClasses} h-full gap-2`}>
          {images.map((media, index) => (
            <img
              key={media.url}
              src={media.url}
              alt={media.alt || "Venue image"}
              className={`h-full w-full cursor-pointer object-cover ${
                index === 0 && images.length >= 3 ? "col-span-2 row-span-2" : ""
              }`}
              onClick={() => handleOpenGallery(index)}
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
                onClick={() => handleOpenGallery(index)}
              />
            );
          })}
        </div>
        {totalImages > 5 && (
          <div className="absolute bottom-4 right-4">
            <Button
              onClick={() => handleOpenGallery(0)}
              className="bg-primary/80 text-lg transition-all duration-300 hover:bg-primary/100"
            >
              <ImagesIcon className="mr-1 size-6" />
              {`${totalImages} photos`}
            </Button>
          </div>
        )}
      </div>

      {/* Venue Details and Booking */}
      <div className="relative flex min-h-[600px] items-start justify-between px-0 pb-20 md:pb-32 xl:px-4">
        <div
          className={cn(
            "w-[calc(100%-400px)] space-y-6 xl:w-[calc(100%-420px)]",
            {
              "w-full": smCalendarContainer,
            },
          )}
        >
          <div className="flex h-40 flex-col items-start justify-between overflow-hidden">
            {/* Todo: AI generated heading here */}
            <div className="line-clamp-4 text-lg font-light text-paragraph">
              {venue.description}
            </div>
            <Button
              variant={"linkHover1"}
              className="group/button px-0 after:w-full"
              onClick={() => sEtOpenDescriptionModal(true)}
            >
              <span className="">Show more</span>
              <ChevronRight className="ml-1 size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
            </Button>
            <DescriptionModal
              description={venue.description}
              isOpen={openDescriptionModal}
              onClose={() => sEtOpenDescriptionModal(false)}
            />
          </div>
          <Separator />
          <div className="hidden items-center space-x-4 md:flex">
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={venue.owner?.avatar.url}
                alt={venue.owner?.avatar.alt}
              />
              <AvatarFallback>
                <User className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <span>
              Hosted by <span className="capitalize">{venue.owner?.name}</span>
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

          <BookingDetailsMobile venue={venue} onReserve={handleReserve} />
          <div className="space-y-6 md:hidden">
            <Separator />
            <div className="flex items-center space-x-4">
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={venue.owner?.avatar.url}
                  alt={venue.owner?.avatar.alt}
                />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <span>
                Hosted by{" "}
                <span className="capitalize">{venue.owner?.name}</span>
              </span>
            </div>
            <Separator />
          </div>
        </div>
        <div className="absolute right-0 xl:right-4">
          <BookingDetails venue={venue} onReserve={handleReserve} />
        </div>

        {/* LightGallery */}
        <LightGallery
          onInit={(detail) => {
            galleryRef.current = detail.instance;
          }}
          // plugins={[lgZoom]}
          dynamic
          dynamicEl={venue.media?.map((media) => ({
            src: media.url,
            thumb: media.url,
            subHtml: `<div class="lightGallery-caption">${media.alt || ""}</div>`,
          }))}
          index={0}
          closable
          hideBarsDelay={2000}
          counter
        />
      </div>
    </div>
  );
}
