import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/venues-south-america")({
  component: VenuesSouthAmerica,
});

function VenuesSouthAmerica() {
  return (
    <div>
      <h1>Venues South America</h1>
      <p>This is a page for venues in South America.</p>
    </div>
  );
}
