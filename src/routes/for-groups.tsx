import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import ForGroups from "@/components/home/forGroups";
import { FOR_GROUPS_FILTERS } from "@/components/home/forGroups/filterVenuesForGroups";

const forGroupsFilterSchema = z.object({
  filter: z.enum(FOR_GROUPS_FILTERS).optional(),
});

export const Route = createFileRoute("/for-groups")({
  validateSearch: forGroupsFilterSchema,
  component: ForGroups,
});
