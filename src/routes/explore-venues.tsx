import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/explore-venues")({
  component: () => <div>Hello /explore-venues!</div>,
});
