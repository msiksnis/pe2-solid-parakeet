import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import ByContinent from "@/components/home/byContinent";
import { CONTINENT_FILTERS } from "@/components/home/byContinent/filterVenuesByContinent";

const byContinentSchema = z.object({
  filter: z.enum(CONTINENT_FILTERS).optional(),
});

export const Route = createFileRoute("/by-continent")({
  validateSearch: byContinentSchema,
  component: ByContinent,
});
