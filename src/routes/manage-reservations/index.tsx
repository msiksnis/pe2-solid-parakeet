import MyReservations from "@/components/manage-reservations/my-reservations";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/manage-reservations/")({
  component: MyReservations,
});
