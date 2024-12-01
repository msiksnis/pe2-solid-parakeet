import { useState } from "react";
import Skeleton from "../Skeleton";

export default function LandingImage() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative z-10 hidden aspect-[2/1] w-full max-w-7xl overflow-hidden sm:block">
      <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="clip-path-id" clipPathUnits="objectBoundingBox">
            <path
              d="M0,0.5 C0,0.46,0.0175,0.43,0.043,0.43 H0.422
              C0.442,0.43,0.462,0.414,0.476,0.39 L0.678,0.04
              C0.693,0.015,0.715,0,0.738,0 
              H0.96 C0.98,0,1,0.015,1,0.06 V0.93
              C1,0.97,0.98,1,0.95,1 H0.043
              C0.0175,1,0,0.97,0,0.92 V0.5Z"
            />
          </clipPath>
        </defs>
      </svg>

      {isLoading && (
        <Skeleton
          className="absolute inset-0 h-full w-full"
          style={{ clipPath: "url(#clip-path-id)" }}
        />
      )}

      <img
        src="/landing_img.webp"
        alt="Decorative background image"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ clipPath: "url(#clip-path-id)" }}
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
    </div>
  );
}
