import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <div className="mx-auto flex w-full max-w-6xl items-center px-10 py-4 xl:px-0">
      <img src="/public/Logo.png" className="max-h-14" />
      <div className="ml-auto flex items-center space-x-32">
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
        <div className="">
          <Button variant="outline" className="rounded-full border-primary">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
