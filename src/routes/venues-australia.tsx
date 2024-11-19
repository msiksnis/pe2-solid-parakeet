import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/venues-australia")({
  component: VenuesAustralia,
});

function VenuesAustralia() {
  return (
    <div>
      <h1>Venues Australia</h1>
      <p>This is a page for venues in Australia.</p>
    </div>
  );
}
