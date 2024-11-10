import { axiosInstance } from "@/lib/axiosInstance";
import { Venue } from "@/lib/types";

export const fetchVenues = async (): Promise<Venue[]> => {
  try {
    const { data } = await axiosInstance.get("/venues");
    return data.data;
  } catch (error: any) {
    if (error.code === "ECONNABORTED") {
      console.error("Request timed out");
    } else {
      console.error("An error occurred", error);
    }
    throw error;
  }
};
