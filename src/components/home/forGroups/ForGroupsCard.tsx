import BlurFade from "@/components/ui/blur-fade";
import { Link } from "@tanstack/react-router";

export default function ForGroupsCard() {
  return (
    <BlurFade delay={0.15} inView>
      <div className="grid gap-y-8 pb-20 pt-4 md:grid-cols-2 md:gap-x-4 md:gap-y-0">
        <Link
          to="/for-groups"
          search={{ filter: "summer-escape" }}
          className="rounded-2xl border-primary/0 transition-all duration-200 hover:border-primary/100 sm:p-2 md:border"
        >
          <img
            src="/assets/sunny-for-groups.webp"
            alt="Sunny place for groups"
            className="h-80 w-full rounded-2xl object-cover"
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
          className="rounded-2xl border-primary/0 transition-all duration-300 hover:border-primary/100 sm:p-2 md:border"
        >
          <img
            src="/assets/explore-mountains.webp"
            alt="Mountains for groups"
            className="h-80 w-full rounded-2xl object-cover"
          />
          <p className="pt-4 text-sm font-semibold uppercase text-muted-foreground">
            Explore mysterious mountains
          </p>
          <p className="text-pretty py-2 text-lg leading-6">
            Mountain cabin for recharge and reunite with your group and nature
          </p>
        </Link>
      </div>
    </BlurFade>
  );
}
