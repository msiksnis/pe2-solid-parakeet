import BlurFade from "@/components/ui/blur-fade";
import { Link } from "@tanstack/react-router";

export default function ByContinentCards() {
  return (
    <BlurFade delay={0.15} inView>
      <div className="grid gap-y-8 pb-20 pt-4 md:grid-cols-3 md:gap-x-4 md:gap-y-4">
        <Link
          to="/by-continent"
          search={{ filter: "europe" }}
          className="rounded-2xl border-primary/0 transition-all duration-200 hover:border-primary/100 sm:p-2 md:border"
        >
          <img
            src="/assets/europe.webp"
            alt="Sunny place for groups"
            className="h-44 w-full rounded-2xl object-cover lg:h-52"
          />
          <p className="text-pretty py-2 text-lg font-medium leading-6">
            Explore places in Europe
          </p>
        </Link>
        <Link
          to="/by-continent"
          search={{ filter: "asia" }}
          className="rounded-2xl border-primary/0 transition-all duration-300 hover:border-primary/100 sm:p-2 md:border"
        >
          <img
            src="/assets/asia.webp"
            alt="Mountains for groups"
            className="h-44 w-full rounded-2xl object-cover lg:h-52"
          />
          <p className="text-pretty py-2 text-lg font-medium leading-6">
            Explore places in Asia
          </p>
        </Link>
        <Link
          to="/by-continent"
          search={{ filter: "north-america" }}
          className="rounded-2xl border-primary/0 transition-all duration-300 hover:border-primary/100 sm:p-2 md:border"
        >
          <img
            src="/assets/north-america.webp"
            alt="Mountains for groups"
            className="h-44 w-full rounded-2xl object-cover lg:h-52"
          />
          <p className="text-pretty py-2 text-lg font-medium leading-6">
            Explore places in North America
          </p>
        </Link>
        <Link
          to="/by-continent"
          search={{ filter: "south-america" }}
          className="rounded-2xl border-primary/0 transition-all duration-300 hover:border-primary/100 sm:p-2 md:border"
        >
          <img
            src="/assets/south-america.webp"
            alt="Mountains for groups"
            className="h-44 w-full rounded-2xl object-cover lg:h-52"
          />
          <p className="text-pretty py-2 text-lg font-medium leading-6">
            Explore places in South America
          </p>
        </Link>
        <Link
          to="/by-continent"
          search={{ filter: "africa" }}
          className="rounded-2xl border-primary/0 transition-all duration-300 hover:border-primary/100 sm:p-2 md:border"
        >
          <img
            src="/assets/africa.webp"
            alt="Mountains for groups"
            className="h-44 w-full rounded-2xl object-cover lg:h-52"
          />
          <p className="text-pretty py-2 text-lg font-medium leading-6">
            Explore places in Africa
          </p>
        </Link>
        <Link
          to="/by-continent"
          search={{ filter: "oceania" }}
          className="rounded-2xl border-primary/0 transition-all duration-300 hover:border-primary/100 sm:p-2 md:border"
        >
          <img
            src="/assets/oceania.webp"
            alt="Mountains for groups"
            className="h-44 w-full rounded-2xl object-cover lg:h-52"
          />
          <p className="text-pretty py-2 text-lg font-medium leading-6">
            Explore places in Oceania
          </p>
        </Link>
      </div>
    </BlurFade>
  );
}
