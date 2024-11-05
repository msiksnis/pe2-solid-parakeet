import SignInModal from "@/auth/SignInModal";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { useSignInModalStore } from "@/hooks/useSignInModalStore";
import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import UserButton from "./UserButton";

export default function Navbar() {
  const { isSignInModalOpen, openSignInModal, closeSignInModal } =
    useSignInModalStore();

  const { isLoggedIn } = useAuthStatus();

  return (
    <>
      <header className="mx-auto flex w-full max-w-[1920px] items-center px-4 py-4">
        <Link to="/">
          <img src="/Logo.png" className="max-h-14" />
        </Link>
        <nav className="ml-auto flex items-center space-x-32">
          <div className="hidden space-x-10 sm:flex">
            <Link
              to="/"
              className="text-lg underline-offset-4 [&.active]:underline"
            >
              Home
            </Link>
            <Link
              to="/explore-venues"
              className="text-lg underline-offset-4 [&.active]:underline"
            >
              Explore Venues
            </Link>
            <Link
              to="/about"
              className="text-lg underline-offset-4 [&.active]:underline"
            >
              About
            </Link>
          </div>
          {isLoggedIn ? (
            <UserButton />
          ) : (
            <Button
              onClick={openSignInModal}
              variant="outline"
              className="rounded-full border-primary"
            >
              Log in
            </Button>
          )}
        </nav>
      </header>
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={closeSignInModal}
        loading={false}
      />
    </>
  );
}
