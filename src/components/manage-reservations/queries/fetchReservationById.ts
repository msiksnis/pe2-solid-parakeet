import { authenticatedAxiosInstance } from "@/lib/axiosInstance";
import { Reservation } from "../types";

export const fetchReservationById = async (
  id: string,
): Promise<Reservation> => {
  try {
    const { data } = await authenticatedAxiosInstance.get(
      `/bookings/${id}?_owner=true&_venue=true&_bookings=true`,
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
