import HostVenue from "@/components/hostVenue";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/manage-venues/host-venue",
)({
  component: HostVenue,
});
