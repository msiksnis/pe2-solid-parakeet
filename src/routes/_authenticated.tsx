import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context }) => {
    const { isLoggedIn, isVenueManager } = context.authentication;
    if (!isLoggedIn || !isVenueManager) {
      throw redirect({
        to: "/",
      });
    }
  },
});
