import { axiosInstance } from "@/lib/axiosInstance";
import axios from "axios";
import { Reservation } from "../types";

export async function updateReservationsAction(
  reservationId: string,
  data: Partial<Reservation>,
) {
  const persistedState = JSON.parse(
    localStorage.getItem("auth-object") || "{}",
  );
  const token = persistedState?.state?.token || null;

  if (!token) {
    throw new Error("Unauthorized: You must be logged in to update a booking.");
  }

  try {
    const response = await axiosInstance.put(
      `/bookings/${reservationId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
        },
      },
    );

    if (response.status === 200 || response.status === 204) {
      return response.data.data;
    }

    throw new Error(`Unexpected response status: ${response.status}`);
  } catch (error) {
    console.error("Error updating booking:", error);
    if (axios.isAxiosError(error)) {
      console.error("Error Response:", error.response?.data);
    } else {
      console.error("Error Response:", error);
    }

    const errorMessage =
      (error as any).response?.data?.message ||
      "Booking update failed. Please try again later.";
    throw new Error(errorMessage);
  }
}
