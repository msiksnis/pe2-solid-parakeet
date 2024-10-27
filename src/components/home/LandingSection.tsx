import LandingImage from "./LandingImage";

export default function LandingSection() {
  return (
    <div className="relative hidden sm:block">
      <div className="absolute z-20 text-center text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[clamp(2.5rem,6vw,5rem)] tracking-tight sm:left-12 sm:top-8 sm:max-w-[280px] md:left-[clamp(1vw,3vw,10rem)] md:top-8 md:max-w-[380px] lg:left-[4rem] lg:top-12 lg:max-w-[470px] xl:left-24 xl:max-w-[490px]">
        Find your best place to stay
      </div>
      <LandingImage />
      <div className="absolute left-0 top-0 z-0 h-4/5 w-full rounded-full bg-orange-100/60 blur-[90px]"></div>
    </div>
  );
}
