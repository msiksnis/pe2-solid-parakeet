import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import SearchPage from "@/components/search";

const validateSearch = z.object({
  q: z.string().optional(),
  destination: z.string().optional(),
});

export const Route = createFileRoute("/search")({
  validateSearch: validateSearch,
  component: SearchPage,
});
