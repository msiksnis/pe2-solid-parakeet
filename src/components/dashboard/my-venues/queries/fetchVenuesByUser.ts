import { authenticatedAxiosInstance } from "@/lib/axiosInstance";
import { Venue } from "@/lib/types";

export const fetchVenuesByUser = async (): Promise<Venue[]> => {
  const persistedState = JSON.parse(
    localStorage.getItem("auth-object") || "{}",
  );
  const userName = persistedState?.state?.userName || null;

  if (!userName) {
    throw new Error("User name is not available in the store.");
  }

  try {
    const { data } = await authenticatedAxiosInstance.get(
      `/profiles/${userName}/venues?_owner=true&_bookings=true&_customer=true`,
    );
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
