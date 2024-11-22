import { useLocation, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { cn, useScreenSizes } from "@/lib/utils.ts";
import { Route } from "@/routes/search.tsx";
import { Search, X } from "lucide-react";
import { Button } from "../ui/button.tsx";

export default function SearchBar() {
  const [isVenueFocused, setIsVenueFocused] = useState(false);
  const [isCityFocused, setIsCityFocused] = useState(false);
  const [venueValue, setVenueValue] = useState("");
  const [cityValue, setCityValue] = useState("");

  const navigate = useNavigate({ from: Route.fullPath });

  const location = useLocation();

  const { isMobile } = useScreenSizes();

  const labelSize = isMobile ? "1rem" : "1.125rem";
  const labelTop = isMobile ? "1.3rem" : "1.1rem";

  const labelVariants = {
    initial: {
      top: labelTop,
      fontSize: labelSize,
      color: "#676A6E",
    },
    floating: {
      top: "0.4rem",
      fontSize: "0.875rem",
      color: "#6B7280",
    },
  };

  const handleSearch = () => {
    const searchParams: Record<string, string> = {};

    if (venueValue.trim() !== "") {
      searchParams.q = venueValue.trim();
    }

    if (cityValue.trim() !== "") {
      searchParams.city = cityValue.trim();
    }

    navigate({
      to: "/search",
      search: {
        q: venueValue.trim() || undefined,
        destination: cityValue.trim() || undefined,
      },
      replace: true,
      resetScroll: false,
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    if (location.pathname !== "/search") {
      setVenueValue("");
      setCityValue("");
    }
  }, [location.pathname]);

  return (
    <div
      className={cn(
        "shadow-search lg:shadow-custom flex h-16 w-full max-w-7xl justify-center rounded-full bg-card",
      )}
    >
      <div className="grid h-full w-full grid-cols-12 divide-x divide-primary/20 md:grid-cols-10">
        {/* Venue Search Input */}
        <div className="relative col-span-5 flex items-center py-2 pl-6 md:col-span-4 md:text-lg">
          <motion.label
            htmlFor="search-venue"
            className="pointer-events-none absolute left-6 md:left-6"
            variants={labelVariants}
            initial="initial"
            animate={
              isVenueFocused || venueValue !== "" ? "floating" : "initial"
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <span className="sm:hidden">Search venue</span>
            <span className="hidden sm:block">Search by venue</span>
          </motion.label>
          <input
            id="search-venue"
            value={venueValue}
            onChange={(e) => setVenueValue(e.target.value)}
            onFocus={() => setIsVenueFocused(true)}
            onBlur={() => setIsVenueFocused(false)}
            onKeyDown={handleKeyPress}
            className="h-full w-full border-transparent pt-4 text-lg capitalize focus:outline-none"
            placeholder=" "
          />
          <X
            className={cn(
              "mr-2 mt-4 size-7 cursor-pointer bg-card p-0.5 opacity-0 transition-opacity",
              {
                "opacity-100": venueValue,
              },
            )}
            onClick={() => setVenueValue("")}
          />
        </div>
        {/* Destination Search Input */}
        <div className="relative col-span-5 flex items-center py-2 pl-4 md:col-span-4 md:pl-6 md:text-lg">
          <motion.label
            htmlFor="search-city"
            className="pointer-events-none absolute md:left-6"
            variants={labelVariants}
            initial="initial"
            animate={isCityFocused || cityValue !== "" ? "floating" : "initial"}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <span className="sm:hidden">Search destination</span>
            <span className="hidden sm:block">Search destination</span>
          </motion.label>
          <input
            id="search-city"
            value={cityValue}
            onChange={(e) => setCityValue(e.target.value)}
            onFocus={() => setIsCityFocused(true)}
            onBlur={() => setIsCityFocused(false)}
            onKeyDown={handleKeyPress}
            className="h-full w-full border-transparent pt-4 text-lg capitalize focus:outline-none"
            placeholder=" "
          />
          <X
            className={cn(
              "mr-2 mt-4 size-7 cursor-pointer bg-card p-0.5 opacity-0 transition-opacity",
              {
                "opacity-100": cityValue,
              },
            )}
            onClick={() => setCityValue("")}
          />
        </div>
        {/* Search Button */}
        <div className="col-span-2 flex items-center">
          <Button
            variant={"gooeyRight"}
            onClick={handleSearch}
            disabled={venueValue.trim() === "" && cityValue.trim() === ""}
            className="h-full w-full overflow-hidden rounded-e-full bg-card from-amber-400 to-amber-500 px-4 text-[#222832] before:duration-500 disabled:opacity-80 disabled:before:opacity-0 md:text-lg"
          >
            <span className="hidden opacity-95 sm:flex">
              <Search className="mr-2 mt-0.5 size-[1.325rem] text-[#222832]" />
              Search
            </span>
            <span className="sm:hidden">
              <Search className="size-5 text-[#222832] md:size-6" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
