import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { LightGallery as LightGalleryProps } from "lightgallery/lightgallery";
import { useRef } from "react";

import { Venue } from "@/lib/types";
import { cn, useScreenSizes } from "@/lib/utils";
import ErrorLoadingButton from "../ErrorLoadingButton";
import MainLoader from "../MainLoader";
import BookingDetails from "./components/BookingDetails.tsx";
import BookingDetailsMobile from "./components/BookingDetailsMobile.tsx";
import Gallery from "./components/Gallery";
import VenueDetails from "./components/VenueDetails.tsx";
import VenueHeader from "./components/VenueHeader.tsx";
import VenueImages from "./components/VenueImages";
import { useCreateReservationMutation } from "./mutations/useCreateReservationMutation";
import { fetchVenueById } from "./queries/fetchVenueById";
import { Booking } from "./utils/BookingValidation.ts";

export default function VenueById() {
  const { id } = useParams({ from: "/venue/$id" }) as { id: string };
  const navigate = useNavigate();

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
      <VenueHeader venue={venue} />
      <VenueImages venue={venue} galleryRef={galleryRef} />
      <div className="relative flex min-h-[600px] items-start justify-between px-0 pb-20 md:pb-32 xl:px-4">
        <div
          className={cn(
            "w-[calc(100%-400px)] space-y-6 xl:w-[calc(100%-420px)]",
            {
              "w-full": smCalendarContainer,
            },
          )}
        >
          <VenueDetails venue={venue} />
          <BookingDetailsMobile venue={venue} onReserve={handleReserve} />
        </div>
        <div className="absolute right-0 xl:right-4">
          <BookingDetails venue={venue} onReserve={handleReserve} />
        </div>
        <Gallery venue={venue} galleryRef={galleryRef} />
      </div>
    </div>
  );
}
