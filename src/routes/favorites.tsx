import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/favorites")({
  component: () => <div>Hello /favorites!</div>,
});
