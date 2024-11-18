import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { AuthContext } from "@/hooks/useAuthStatus";
import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
} from "@tanstack/react-router";

interface RouterContext {
  authentication: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
      </div>
    );
  },
});
