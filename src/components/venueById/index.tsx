import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Cat,
  ChevronRight,
  CircleParking,
  HeartIcon,
  ShareIcon,
  User,
  Utensils,
  Wifi,
} from "lucide-react";
import { useRef, useState } from "react";
import { titleCase } from "title-case";
import { LightGallery as LightGalleryProps } from "lightgallery/lightgallery";

import { Venue } from "@/lib/types";
import { cn, useScreenSizes } from "@/lib/utils";
import DescriptionModal from "../DescriptionModal";
import ErrorLoadingButton from "../ErrorLoadingButton";
import MainLoader from "../MainLoader";
import RatingStars from "../RatingStars";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import BookingDetails from "./components/BookingDetails.tsx";
import BookingDetailsMobile from "./components/BookingDetailsMobile.tsx";
import { Booking } from "./utils/BookingValidation.ts";
import Gallery from "./components/Gallery";
import VenueImages from "./components/VenueImages";
import { useCreateReservationMutation } from "./mutations/useCreateReservationMutation";
import { fetchVenueById } from "./queries/fetchVenueById";

export default function VenueById() {
  const { id } = useParams({ from: "/venue/$id" }) as { id: string };
  const navigate = useNavigate();

  const [openDescriptionModal, setOpenDescriptionModal] = useState(false);

  const galleryRef = useRef<LightGalleryProps | null>(null);

  const { smCalendarContainer } = useScreenSizes();

  const bookingMutation = useCreateReservationMutation();

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
      { ...data },
      {
        onSuccess: () => {
          navigate({ to: "/manage-reservations" });
        },
      },
    );
  };

  if (isLoading) return <MainLoader className="mt-60" />;

  const errorMessage =
    error instanceof Error
      ? `Error loading venue details: ${error.message}`
      : "An unexpected error occurred while loading venue details.";

  if (error) {
    return <ErrorLoadingButton errorMessage={errorMessage} onRetry={refetch} />;
  }

  if (!venue) return <p className="my-20">Venue not found.</p>;

  return (
    <div className="mx-auto mt-4 max-w-7xl space-y-6 px-4 sm:px-6 md:px-10 xl:px-6">
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
      <VenueImages venue={venue} galleryRef={galleryRef} />

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
              onClick={() => setOpenDescriptionModal(true)}
            >
              <span className="">Show more</span>
              <ChevronRight className="ml-1 size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
            </Button>
            <DescriptionModal
              description={venue.description}
              isOpen={openDescriptionModal}
              onClose={() => setOpenDescriptionModal(false)}
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
        <Gallery venue={venue} galleryRef={galleryRef} />
      </div>
    </div>
  );
}
