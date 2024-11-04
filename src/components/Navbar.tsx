import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import SignInModal from "@/auth/SignInModal";
import { useState } from "react";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import UserButton from "./UserButton";

export default function Navbar() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const { isLoggedIn } = useAuthStatus();

  return (
    <>
      <header className="mx-auto flex w-full max-w-[1920px] items-center px-4 py-4">
        <Link to="/">
          <img src="/Logo.png" className="max-h-14" />
        </Link>
        <nav className="ml-auto hidden items-center space-x-32 sm:flex">
          <div className="space-x-10">
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
              onClick={() => setIsSignInModalOpen(true)}
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
        onClose={() => setIsSignInModalOpen(false)}
        loading={false}
      />
    </>
  );
}
