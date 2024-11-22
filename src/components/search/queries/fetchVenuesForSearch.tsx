import { axiosInstance } from "@/lib/axiosInstance";
import { Venue } from "@/lib/types";

interface FetchVenuesParams {
  q?: string;
  destination?: string;
}

export const fetchVenues = async ({
  q,
  destination,
}: FetchVenuesParams): Promise<Venue[]> => {
  try {
    let data: Venue[] = [];

    if (q) {
      const response = await axiosInstance.get("/venues/search?sort=created", {
        params: { q },
      });
      data = response.data.data;
    } else {
      const response = await axiosInstance.get("/venues?sort=created");
      data = response.data.data;
    }

    if (destination) {
      data = data.filter(
        (venue) =>
          venue.location?.city?.toLowerCase() === destination.toLowerCase() ||
          venue.location?.country?.toLowerCase() ===
            destination.toLowerCase() ||
          venue.location?.continent?.toLowerCase() ===
            destination.toLowerCase(),
      );
    }

    return data;
  } catch (error: any) {
    console.error("An error occurred", error);
    throw error;
  }
};
