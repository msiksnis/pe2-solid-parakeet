import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/venues-asia")({
  component: VenuesAsia,
});

function VenuesAsia() {
  return (
    <div>
      <h1>Venues Asia</h1>
      <p>This is the Venues Asia page.</p>
    </div>
  );
}
