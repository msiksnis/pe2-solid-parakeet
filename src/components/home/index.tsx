import PopularByType from "./popularByType";
import LandingSection from "./LandingSection";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-10 md:px-10 xl:px-6">
      <LandingSection />
      <PopularByType />
    </div>
  );
}
