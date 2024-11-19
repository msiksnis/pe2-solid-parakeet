import AllVenues from "@/components/allVenues/All-Venues";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/all-venues")({
  component: AllVenues,
});
