import { axiosInstance } from "@/lib/axiosInstance";
import { Venue } from "../VenueValidation";

export async function createVenueAction(data: Venue) {
  const persistedState = JSON.parse(
    localStorage.getItem("auth-object") || "{}",
  );
  const token = persistedState?.state?.token || null;
  const venueManager = persistedState?.state?.venueManager || false;

  if (!token) {
    throw new Error("Unauthorized: You must be logged in to create a venue.");
  }

  if (!venueManager) {
    throw new Error(
      "Unauthorized: You must be a Venue Manager to create a venue.",
    );
  }

  try {
    const response = await axiosInstance.post("/venues", data, {
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
    console.error("Error creating venue:", error);
    console.error("Error Response:", (error as any).response?.data);

    const errorMessage =
      (error as any).response?.data?.message ||
      "Venue creation failed. Please try again later.";
    throw new Error(errorMessage);
  }
}
