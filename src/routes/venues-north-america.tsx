import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/venues-north-america")({
  component: VenuesNorthAmerica,
});

function VenuesNorthAmerica() {
  return (
    <div>
      <h1>Venues North America</h1>
      <p>This is a page for venues in North America.</p>
    </div>
  );
}
