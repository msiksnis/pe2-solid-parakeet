import { authenticatedAxiosInstance } from "@/lib/axiosInstance";
import axios, { AxiosError } from "axios";
import { Reservation } from "../types";

/**
 * Updates a reservation by its ID with the provided data.
 *
 * @param reservationId - The ID of the reservation to update.
 * @param data - The data to update the reservation with.
 * @returns A promise resolving to the updated reservation data.
 * @throws Will throw an error if the user is not authenticated or if the update fails.
 */
export async function updateReservationsAction(
  reservationId: string,
  data: Partial<Reservation>,
): Promise<Reservation> {
  try {
    const response = await authenticatedAxiosInstance.put(
      `/bookings/${reservationId}`,
      data,
    );

    if (response.status === 200 || response.status === 204) {
      return response.data.data as Reservation;
    }

    throw new Error(`Unexpected response status: ${response.status}`);
  } catch (error) {
    console.error("Error updating booking:", error);

    if (axios.isAxiosError(error)) {
      console.error("Error Response:", error.response?.data);
      const axiosError = error as AxiosError<{ message: string }>;

      const errorMessage =
        axiosError.response?.data?.message ||
        "Booking update failed. Please try again later.";

      throw new Error(errorMessage);
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
}
