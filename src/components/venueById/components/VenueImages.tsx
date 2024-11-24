import { MutableRefObject, useCallback } from "react";
import { ImagesIcon } from "lucide-react";
import { LightGallery as LightGalleryProps } from "lightgallery/lightgallery";

import { Button } from "@/components/ui/button";
import { Venue } from "@/lib/types";
import { cn } from "@/lib/utils";

interface VenueImagesProps {
  venue: Venue;
  galleryRef: MutableRefObject<LightGalleryProps | null>;
}

export default function VenueImages({ venue, galleryRef }: VenueImagesProps) {
  const handleOpenGallery = useCallback(
    (index: number) => {
      if (galleryRef.current) {
        galleryRef.current.openGallery(index);
      }
    },
    [galleryRef],
  );

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
  );
}
