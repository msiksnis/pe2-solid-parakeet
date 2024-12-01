import { Cat, ChevronRight, CircleParking, Utensils, Wifi } from "lucide-react";
import { useState } from "react";

import DescriptionModal from "@/components/DescriptionModal";
import RatingStars from "@/components/RatingStars";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Venue } from "@/lib/types";
import HostedBy from "./HostedBy";

interface VenueDetailsProps {
  venue: Venue;
}

export default function VenueDetails({ venue }: VenueDetailsProps) {
  const [openDescriptionModal, setOpenDescriptionModal] = useState(false);
  return (
    <>
      <div className="flex h-40 flex-col items-start justify-between overflow-hidden">
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
      {venue.owner && (
        <HostedBy className="hidden md:block" owner={venue.owner} />
      )}
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
    </>
  );
}
