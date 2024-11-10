import { axiosInstance } from "@/lib/axiosInstance";
import { Venue } from "../VenueValidation";

export async function updateVenueAction(venueId: string, data: Partial<Venue>) {
  const persistedState = JSON.parse(
    localStorage.getItem("auth-object") || "{}",
  );
  const token = persistedState?.state?.token || null;
  const venueManager = persistedState?.state?.venueManager || false;

  if (!token) {
    throw new Error("Unauthorized: You must be logged in to update a venue.");
  }

  if (!venueManager) {
    throw new Error(
      "Unauthorized: You must be a Venue Manager to update a venue.",
    );
  }

  try {
    const response = await axiosInstance.put(`/venues/${venueId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
      },
    });

    if (response.status === 200 || response.status === 204) {
      return response.data.data;
    }

    throw new Error(`Unexpected response status: ${response.status}`);
  } catch (error) {
    console.error("Error updating venue:", error);
    console.error("Error Response:", (error as any).response?.data);

    const errorMessage =
      (error as any).response?.data?.message ||
      "Venue update failed. Please try again later.";
    throw new Error(errorMessage);
  }
}
