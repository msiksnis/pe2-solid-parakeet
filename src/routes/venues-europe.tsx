import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/venues-europe")({
  component: VenuesEurope,
});

function VenuesEurope() {
  return (
    <div>
      <h1>Venues Europe</h1>
      <p>This is the Venues Europe page.</p>
    </div>
  );
}
