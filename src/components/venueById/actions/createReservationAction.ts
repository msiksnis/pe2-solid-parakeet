import { axiosInstance } from "@/lib/axiosInstance";
import { Booking } from "../BookingValidation";

export async function createReservationAction(data: Booking): Promise<Booking> {
  const persistedState = JSON.parse(
    localStorage.getItem("auth-object") || "{}",
  );
  const token = persistedState?.state?.token || null;

  if (!token) {
    throw new Error("Unauthorized: You must be logged in to book a venue.");
  }

  try {
    const response = await axiosInstance.post("/bookings", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
      },
    });

    if (response.status === 200 || response.status === 201) {
      return response.data.data;
    }

    throw new Error(`Unexpected response status: ${response.status}`);
  } catch (error) {
    console.error("Error creating reservation:", error);
    console.error("Error Response:", (error as any).response?.data);

    const errorMessage =
      (error as any).response?.data?.message ||
      "Failed creating reservation. Please try again later.";
    throw new Error(errorMessage);
  }
}
