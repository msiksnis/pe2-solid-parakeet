import UpdateReservation from "@/components/manage-reservations/components/UpdateReservation";
import { createFileRoute } from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

const updateReservationSchema = z.object({
  guests: z.number(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  reservationId: z.string(),
});

export const Route = createFileRoute("/manage-reservations/$id")({
  validateSearch: zodSearchValidator(updateReservationSchema),
  component: UpdateReservation,
});
