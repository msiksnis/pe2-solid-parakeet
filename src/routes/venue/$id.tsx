import VenueById from "@/components/venueById";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/venue/$id")({
  component: VenueById,
});
