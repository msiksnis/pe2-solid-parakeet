import LandingImage from "./LandingImage";

export default function LandingSection() {
  return (
    <div className="relative">
      <div className="absolute z-20 text-center text-[clamp(1.5rem,5vw,5rem)] font-medium leading-[clamp(1.5rem,5vw,5rem)] tracking-tight sm:left-20 sm:top-10 sm:max-w-[250px] md:left-24 md:top-14 md:max-w-[320px] lg:left-32 lg:top-16 lg:max-w-[390px] xl:max-w-[490px]">
        Find your best place to stay
      </div>
      <LandingImage />
      <div className="absolute left-0 top-0 z-0 h-4/5 w-full rounded-full bg-orange-100/60 blur-[90px]"></div>
    </div>
  );
}
