import Navbar from "@/components/Navbar";
import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  ),
});
