import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import SignInModal from "@/auth/SignInModal";
import { useState } from "react";

export default function Navbar() {
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  return (
    <>
      <header className="mx-auto flex w-full max-w-6xl items-center px-4 py-4 sm:px-10 xl:px-0">
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
          <Button
            onClick={() => setIsSignInModalOpen(true)}
            variant="outline"
            className="rounded-full border-primary"
          >
            Log in
          </Button>
        </nav>
      </header>
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onConfirm={() => {}}
        loading={false}
      />
    </>
  );
}
