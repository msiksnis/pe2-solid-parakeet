import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import HomePage from "@/components/home";
import { FOR_TABS_FILTERS } from "@/components/home/popularByType/filterVenuesForTabs";

const filterVenuesSchema = z.object({
  filter: z.enum(FOR_TABS_FILTERS).optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: filterVenuesSchema,
  component: HomePage,
});
