import PopularByType from "./popularByType";
import LandingSection from "./LandingSection";
import ByContinentCards from "./byContinent/ByContinentCards";
import ForGroupsCard from "./forGroups/ForGroupsCard";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-10 xl:px-6">
      <LandingSection />
      <PopularByType />
      <ForGroupsCard />
      <ByContinentCards />
    </div>
  );
}
