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
      const destLower = destination.trim().toLowerCase();
      data = data.filter((venue) => {
        const city = venue.location.city?.toLowerCase() || "";
        const country = venue.location.country?.toLowerCase() || "";
        const continent = venue.location.continent?.toLowerCase() || "";
        return (
          city.includes(destLower) ||
          country.includes(destLower) ||
          continent.includes(destLower)
        );
      });
    }

    return data;
  } catch (error: any) {
    console.error("An error occurred", error);
    throw error;
  }
};
