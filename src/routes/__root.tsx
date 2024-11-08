import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { AuthContext } from "@/hooks/useAuthStatus";
import { cn } from "@/lib/utils";
import {
  createRootRouteWithContext,
  Outlet,
  ScrollRestoration,
  useLocation,
} from "@tanstack/react-router";

interface RouterContext {
  authentication: AuthContext;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    const location = useLocation();
    const isHome = location.pathname === "/";

    return (
      <div className="flex min-h-screen flex-col">
        <div className={cn({ "border-b": !isHome })}>
          <Navbar />
        </div>
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <ScrollRestoration />
      </div>
    );
  },
});
