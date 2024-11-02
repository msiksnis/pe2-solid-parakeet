import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import {
  createRootRoute,
  Outlet,
  ScrollRestoration,
  useLocation,
} from "@tanstack/react-router";

export const Route = createRootRoute({
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
