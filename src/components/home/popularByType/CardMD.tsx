import BlurFade from "@/components/ui/blur-fade";
import { Link } from "@tanstack/react-router";

export default function CardMD() {
  return (
    <BlurFade delay={0.15} inView className="grid gap-x-4 pb-20 md:grid-cols-2">
      <Link
        to="/for-groups"
        search={{ filter: "summer-escape" }}
        className="rounded-2xl border border-primary/0 transition-all duration-200 hover:border-primary/100 sm:p-2"
      >
        <img
          src="/assets/sunny-for-groups.webp"
          alt="Sunny place for groups"
          className="h-60 w-full rounded-2xl object-cover lg:h-80"
        />
        <p className="pt-4 text-sm font-semibold uppercase text-muted-foreground">
          Summer escape for everyone
        </p>
        <p className="text-pretty py-2 text-lg leading-6">
          Celebrate your season your way with the group
        </p>
      </Link>
      <Link
        to="/for-groups"
        search={{ filter: "explore-mountains" }}
        className="rounded-2xl border border-primary/0 transition-all duration-300 hover:border-primary/100 sm:p-2"
      >
        <img
          src="/assets/explore-mountains.webp"
          alt="Mountains for groups"
          className="h-60 w-full rounded-2xl object-cover lg:h-80"
        />
        <p className="pt-4 text-sm font-semibold uppercase text-muted-foreground">
          Explore mysterious mountains
        </p>
        <p className="text-pretty py-2 text-lg leading-6">
          Mountain cabin for recharge and reunite with nature
        </p>
      </Link>
    </BlurFade>
  );
}
