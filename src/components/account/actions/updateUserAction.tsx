import { useAuthStore } from "@/hooks/useAuthStore";
import { authenticatedAxiosInstance } from "@/lib/axiosInstance";
import { User } from "@/lib/types";
import { handleApiError } from "@/lib/utils";

/**
 * Updates a user by their username with the provided data.
 *
 * @param userName - The username of the user to update.
 * @param data - The data to update the user with.
 * @returns A promise resolving to the updated user data.
 * @throws Will throw an error if the user is not authenticated, lacks permissions, or if the update fails.
 */
export async function updateUserAction(
  userName: string,
  data: Partial<User>,
): Promise<User> {
  const { token } = useAuthStore.getState();

  if (!token) {
    throw new Error("Unauthorized: You must be logged in to update a user.");
  }

  try {
    const response = await authenticatedAxiosInstance.put(
      `/profiles/${userName}`,
      data,
    );

    if (response.status === 200) {
      return response.data.data as User;
    }

    throw new Error(`Unexpected response status: ${response.status}`);
  } catch (error) {
    console.error("Error updating user:", error);
    const errorMessage = handleApiError(error);
    throw new Error(errorMessage);
  }
}
