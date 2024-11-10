import HostVenueForm from "@/components/dashboard/hostVenue/HostVenueForm";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/manage-venues/host-venue/$id",
)({
  component: HostVenueForm,
});
