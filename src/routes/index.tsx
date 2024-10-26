import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { FILTER_OPTIONS } from "@/lib/filterVenues";
import HomePage from "@/components/home";

const filterVenuesSchema = z.object({
  filter: z.enum(FILTER_OPTIONS).optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: filterVenuesSchema,
  component: HomePage,
});
