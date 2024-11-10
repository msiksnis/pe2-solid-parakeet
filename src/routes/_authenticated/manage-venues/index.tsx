import MyVenues from "@/components/dashboard/my-venues";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/manage-venues/")({
  component: MyVenues,
});
