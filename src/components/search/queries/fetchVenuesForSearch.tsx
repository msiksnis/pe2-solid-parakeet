import { axiosInstance } from "@/lib/axiosInstance";
import { Venue } from "@/lib/types";

interface FetchVenuesParams {
  q?: string;
  city?: string;
}

export const fetchVenues = async ({
  q,
  city,
}: FetchVenuesParams): Promise<Venue[]> => {
  try {
    let data: Venue[] = [];

    if (q) {
      const response = await axiosInstance.get("/venues/search?sort=created", {
        params: { q },
      });
      data = response.data.data;
    } else {
      // Fetch limited venues when only city is specified
      const response = await axiosInstance.get("/venues?sort=created");
      data = response.data.data;
    }

    if (city) {
      data = data.filter(
        (venue) => venue.location?.city?.toLowerCase() === city.toLowerCase(),
      );
    }

    return data;
  } catch (error: any) {
    console.error("An error occurred", error);
    throw error;
  }
};
