import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/venues-africa")({
  component: VenuesAfrica,
});

function VenuesAfrica() {
  return (
    <div>
      <h1>Venues Africa</h1>
      <p>This is a page for venues in Africa.</p>
    </div>
  );
}
