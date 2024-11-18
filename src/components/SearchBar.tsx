"use client";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [isVenueFocused, setIsVenueFocused] = useState(false);
  const [isCityFocused, setIsCityFocused] = useState(false);
  const [venueValue, setVenueValue] = useState("");
  const [cityValue, setCityValue] = useState("");

  const labelVariants = {
    initial: {
      top: "1.1rem",
      fontSize: "1.125rem",
      color: "#222832",
    },
    floating: {
      top: "0.4rem",
      fontSize: "0.875rem",
      color: "#6B7280",
    },
  };

  return (
    <div
      className={cn(
        "shadow-search lg:shadow-custom flex h-16 w-full max-w-7xl justify-center rounded-full bg-card",
      )}
    >
      <div className="grid h-full w-full grid-cols-10 divide-x divide-primary/20">
        {/* Venue Search Input */}
        <div className="relative col-span-4 flex items-center py-2 pl-6 md:text-lg">
          <motion.label
            htmlFor="search-venue"
            className="pointer-events-none absolute left-6"
            variants={labelVariants}
            initial="initial"
            animate={
              isVenueFocused || venueValue !== "" ? "floating" : "initial"
            }
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <span className="sm:hidden">Search Venue</span>
            <span className="hidden sm:block">Search by venue</span>
          </motion.label>
          <input
            id="search-venue"
            value={venueValue}
            onChange={(e) => setVenueValue(e.target.value)}
            onFocus={() => setIsVenueFocused(true)}
            onBlur={() => setIsVenueFocused(false)}
            className="h-full w-full border-transparent pt-4 text-lg capitalize focus:outline-none"
          />
        </div>
        {/* City Search Input */}
        <div className="relative col-span-4 flex items-center py-2 pl-6 md:text-lg">
          <motion.label
            htmlFor="search-city"
            className="pointer-events-none absolute left-6"
            variants={labelVariants}
            initial="initial"
            animate={isCityFocused || cityValue !== "" ? "floating" : "initial"}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <span className="sm:hidden">Search City</span>
            <span className="hidden sm:block">Search by city</span>
          </motion.label>
          <input
            id="search-city"
            value={cityValue}
            onChange={(e) => setCityValue(e.target.value)}
            onFocus={() => setIsCityFocused(true)}
            onBlur={() => setIsCityFocused(false)}
            className="h-full w-full border-transparent pt-4 text-lg capitalize focus:outline-none"
          />
        </div>
        {/* Search Button */}
        <div className="col-span-2 flex items-center">
          <Button
            variant={"gooeyRight"}
            className="h-full w-full rounded-e-full bg-card from-amber-400 to-amber-500 px-4 text-[#222832] md:text-lg"
          >
            <span className="hidden sm:flex">
              <Search className="mr-2 mt-0.5 size-[1.325rem] text-[#222832]" />
              Search
            </span>
            <span className="sm:hidden">
              <Search className="text-[#222832]" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
