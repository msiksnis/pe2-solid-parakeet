import BlurFade from "@/components/ui/blur-fade";
import { Reservation } from "../types";
import { Link } from "@tanstack/react-router";
import {
  Carousel,
  CarouselBullets,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/Carousel";
import { format } from "date-fns";

export default function ReservationCard({
  reservations,
}: {
  reservations: Reservation[];
}) {
  return (
    <div className="grid gap-4 pb-8 pt-8 md:grid-cols-3 lg:gap-y-0 xl:grid-cols-4">
      {reservations.map((reservation, idx) => (
        <BlurFade
          key={reservation.id}
          delay={0.15 + idx * 0.05}
          inView
          inViewMargin="150px"
        >
          <Link
            to={`/manage-venues/host-venue/${reservation.id}`}
            className="group/card mb-4 flex flex-col rounded-2xl border-primary/0 transition-all duration-200 hover:border-primary/100 sm:p-2 md:border"
          >
            <Carousel className="w-full">
              <CarouselContent>
                {reservation.venue.media?.length > 0 &&
                  reservation.venue.media.map((media, i) => (
                    <CarouselItem key={i}>
                      <img
                        src={media.url || "/default-image.jpg"}
                        alt={media.alt || "Venue image"}
                        className="aspect-square h-60 w-full rounded-2xl object-cover"
                      />
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
              <CarouselBullets />
            </Carousel>

            <div className="my-4 flex flex-col justify-between">
              <h1 className="line-clamp-2 text-lg font-medium capitalize leading-6">
                {reservation.venue.name}
              </h1>
              <div className="flex items-center pt-1 text-paragraph">
                <span className="">
                  {format(reservation.dateFrom, "yyyy-MM-dd")}
                </span>
                <span className="mx-1">-</span>
                <span className="">
                  {format(reservation.dateTo, "yyyy-MM-dd")}
                </span>
              </div>
              <span className="text-paragraph">
                Guests: {reservation.guests}
              </span>
            </div>
          </Link>
        </BlurFade>
      ))}
    </div>
  );
}
