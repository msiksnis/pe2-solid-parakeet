import { authenticatedAxiosInstance } from "@/lib/axiosInstance";
import { Reservation } from "../types";

export const fetchReservationsByProfile = async (): Promise<Reservation[]> => {
  const persistedState = JSON.parse(
    localStorage.getItem("auth-object") || "{}",
  );
  const userName = persistedState?.state?.userName || null;

  if (!userName) {
    throw new Error("User name is not available in the store.");
  }

  try {
    const { data } = await authenticatedAxiosInstance.get(
      `/profiles/${userName}/bookings?_owner=true&_venue=true`,
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
