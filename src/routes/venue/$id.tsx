import VenueById from "@/components/venueById";
import { createFileRoute } from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

const bookVenueSchema = z.object({
  guests: z.number().default(1),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export const Route = createFileRoute("/venue/$id")({
  validateSearch: zodSearchValidator(bookVenueSchema),
  component: VenueById,
});
