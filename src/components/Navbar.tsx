import SignInModal from "@/auth/SignInModal";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useSignInModalStore } from "@/hooks/useSignInModalStore";
import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "./ui/button";
import UserButton from "./UserButton";
import SearchBar from "./search/SearchBar.tsx";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isDashboard = location.pathname.startsWith("/manage-venues");
  const isAccount = location.pathname.startsWith("/account");

  const { isSignInModalOpen, openSignInModal, closeSignInModal } =
    useSignInModalStore();

  const { isLoggedIn } = useAuthStatus();

  return (
    <div className="px-4 py-4">
      <header className="mx-auto flex max-w-[1920px] items-center justify-between">
        <Link to="/" className="">
          <img src="/Logo.png" className="max-h-14" />
        </Link>
        <div className="flex items-center justify-end">
          {isLoggedIn ? (
            <UserButton />
          ) : (
            <Button
              onClick={openSignInModal}
              variant="outline"
              className="rounded-full border-primary px-6"
            >
              Log in
            </Button>
          )}
        </div>
      </header>
      <div
        className={cn("mx-auto mt-4 max-w-2xl lg:-mt-12 lg:mb-0", {
          hidden: isDashboard || isAccount,
        })}
      >
        <h1
          className={cn(
            "relative mx-auto mb-10 mt-14 max-w-96 text-balance text-center text-5xl sm:hidden",
            { hidden: !isHome },
          )}
        >
          Find your best place to stay
          <div className="absolute left-10 right-10 top-0 -z-10 h-3/5 rounded-full bg-orange-100/60 blur-[90px] sm:hidden" />
        </h1>
        <SearchBar />
      </div>
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={closeSignInModal}
        loading={false}
      />
    </div>
  );
}
