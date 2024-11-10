import { create } from "zustand";
import { Venue } from "@/lib/types";

interface VenueStoreState {
  selectedVenue: Venue | null;
  venues: Venue[];
  setSelectedVenue: (venue: Venue | null) => void;
  setVenues: (venues: Venue[]) => void;
  clearSelectedVenue: () => void;
}

export const useVenueStore = create<VenueStoreState>((set) => ({
  selectedVenue: null,
  venues: [],
  setSelectedVenue: (venue) => set({ selectedVenue: venue }),
  setVenues: (venues) => set({ venues }),
  clearSelectedVenue: () => set({ selectedVenue: null }),
}));
