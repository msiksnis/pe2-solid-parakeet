import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";

import ForGroups from "@/components/home/forGroups";
import { FILTER_OPTIONS } from "@/lib/filterVenues";

const forGroupsFilterSchema = z.object({
  filter: z.enum(FILTER_OPTIONS).optional(),
});

export const Route = createFileRoute("/for-groups")({
  validateSearch: forGroupsFilterSchema,
  component: ForGroups,
});
