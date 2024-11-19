import { Venue } from "@/lib/types";
import { MapPinIcon, StarIcon } from "lucide-react";
import BlurFade from "./ui/blur-fade";
import { Link } from "@tanstack/react-router";
import {
  Carousel,
  CarouselBullets,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./Carousel";

interface VenueCardProps {
  venues: Venue[];
  currentFilter?: string;
}

export default function VenueCardSM({ venues, currentFilter }: VenueCardProps) {
  return (
    <div className="grid gap-4 pt-8 md:grid-cols-3 lg:gap-y-0 xl:grid-cols-4">
      {venues.map((venue, idx) => (
        <BlurFade
          key={`${venue.id}-${currentFilter}-${idx}`}
          delay={0.05 + idx * 0.05}
          inView
          inViewMargin="100px"
        >
          <Link
            to={`/venue/${venue.id}`}
            search={{
              guests: 1,
              // ? Uncomment the following lines to pass the start_date and end_date to the venue page
              // start_date: format(new Date(), "yyyy-MM-dd"),
              // end_date: format(new Date(), "yyyy-MM-dd"),
            }}
            className="group/card relative mb-4 flex flex-col rounded-2xl border-primary/0 transition-all duration-200 hover:border-primary/100 sm:p-2 md:border"
          >
            <Carousel className="w-full">
              <CarouselContent>
                {venue.media?.length > 0 ? (
                  venue.media.map((media, i) => (
                    <CarouselItem key={i}>
                      <img
                        src={media.url}
                        alt={media.alt}
                        className="h-60 w-full rounded-2xl object-cover md:h-48"
                      />
                    </CarouselItem>
                  ))
                ) : (
                  <img
                    src="/default-image.jpg"
                    alt="Venue placeholder"
                    className="h-60 w-full rounded-2xl object-cover md:h-48"
                  />
                )}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
              <CarouselBullets />
            </Carousel>
            <div className="flex h-[7.5rem] flex-col justify-between">
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
                  {venue.location && venue.location.city && (
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
              </div>
            </div>
          </Link>
        </BlurFade>
      ))}
    </div>
  );
}
