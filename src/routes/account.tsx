import Account from "@/components/account";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  component: Account,
});
