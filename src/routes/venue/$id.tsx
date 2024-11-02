import VenueById from "@/components/venueById";
import { createFileRoute } from "@tanstack/react-router";
import { zodSearchValidator } from "@tanstack/router-zod-adapter";
import { format } from "date-fns";
import { z } from "zod";

const bookVenueSchema = z.object({
  guests: z.number().default(2),
  start_date: z.string().default(() => format(new Date(), "yyyy-MM-dd")),
  end_date: z.string().optional(),
});

export const Route = createFileRoute("/venue/$id")({
  validateSearch: zodSearchValidator(bookVenueSchema),
  component: VenueById,
});
