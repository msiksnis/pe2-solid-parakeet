import { MutableRefObject } from "react";
import LightGallery from "lightgallery/react";
import { LightGallery as LightGalleryProps } from "lightgallery/lightgallery";
import "lightgallery/css/lightgallery.css";

import { Venue } from "@/lib/types";

interface GalleryProps {
  galleryRef: MutableRefObject<LightGalleryProps | null>;
  venue: Venue;
}

export default function Gallery({ venue, galleryRef }: GalleryProps) {
  return (
    <>
      <LightGallery
        onInit={(detail) => {
          galleryRef.current = detail.instance;
        }}
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
    </>
  );
}
