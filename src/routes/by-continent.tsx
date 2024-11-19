import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import { CONTINENT_FILTERS } from "@/lib/filterVenues";
import ByContinent from "@/components/home/byContinent";

const byContinentSchema = z.object({
  filter: z.enum(CONTINENT_FILTERS).optional(),
});

export const Route = createFileRoute("/by-continent")({
  validateSearch: byContinentSchema,
  component: ByContinent,
});
