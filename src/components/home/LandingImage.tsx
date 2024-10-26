export default function LandingImage() {
  return (
    <div className="relative z-10 hidden w-full max-w-7xl overflow-hidden sm:block">
      {/* Embed the SVG shape as clip-path */}
      <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id="clip-path-id" clipPathUnits="objectBoundingBox">
            <path d="M0,0.5 C0,0.46,0.0175,0.43,0.043,0.43 H0.422C0.442,0.43,0.462,0.414,0.476,0.39L0.678,0.04C0.693,0.015,0.715,0,0.738,0 H0.96C0.98,0,1,0.015,1,0.04V0.93 C1,0.97,0.98,1,0.96,1 H0.043C0.0175,1,0,0.97,0,0.93 V0.5Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Apply the clip path to the image */}
      <img
        src="/img_for_shape.webp"
        alt="Image with Shape"
        className="h-full w-full object-cover"
        style={{ clipPath: "url(#clip-path-id)" }}
      />
    </div>
  );
}
