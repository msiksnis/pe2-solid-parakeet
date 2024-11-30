import { axiosInstance } from "@/lib/axiosInstance";
import { Venue } from "@/lib/types";

/**
 * Fetches a single venue by ID.
 * @param id - The ID of the venue.
 * @returns A promise that resolves to a Venue object.
 */
export async function fetchFavoriteById(id: string): Promise<Venue> {
  const response = await axiosInstance.get(`/venues/${id}`);
  return response.data.data;
}
