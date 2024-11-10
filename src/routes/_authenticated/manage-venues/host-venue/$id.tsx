import HostVenueForm from "@/components/dashboard/hostVenue/HostVenueForm";
import { useVenueStore } from "@/hooks/useVenueStore";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/manage-venues/host-venue/$id",
)({
  component: HostVenueForm,
  onLeave: () => {
    const clearSelectedVenue = useVenueStore.getState().clearSelectedVenue;
    clearSelectedVenue();
  },
});
