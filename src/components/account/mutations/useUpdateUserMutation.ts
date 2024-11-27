import { User } from "@/lib/types";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUserAction } from "../actions/updateUserAction";
import { useAuthStore } from "@/hooks/useAuthStore";

/**
 * Custom hook to handle updating a user with optimistic updates.
 * It updates the cache optimistically and rolls back in case of an error.
 *
 * @param userName - The username of the user to update.
 * @returns A mutation object from React Query for updating a user.
 */
export function useUpdateUserMutation(userName: string) {
  const queryClient = useQueryClient();

  const queryKeys = {
    user: () => ["user"] as const,
  };

  const mutation = useMutation<
    User,
    Error,
    Partial<User>,
    { previousData: User | undefined }
  >({
    mutationFn: (data) => updateUserAction(userName, data),

    onMutate: async (newData) => {
      const queryKey: QueryKey = queryKeys.user();

      // Cancel any outgoing refetches to prevent them from overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous data
      const previousData = queryClient.getQueryData<User>(queryKey);

      // Optimistically update to the new value
      if (previousData) {
        queryClient.setQueryData<User>(queryKey, {
          ...previousData,
          ...newData,
        });
      }

      // Return a context with the previous data for rollback
      return { previousData };
    },

    onSuccess: (updatedUser) => {
      const queryKey: QueryKey = queryKeys.user();

      // Update the cache with the updated user
      queryClient.setQueryData<User>(queryKey, updatedUser);

      // Update the Zustand store with the new user data
      useAuthStore.setState({
        bio: updatedUser.bio,
        venueManager: updatedUser.venueManager,
        userAvatar: updatedUser.avatar,
      });

      toast.success("User updated successfully");
    },

    onError: (error, _, context) => {
      const queryKey: QueryKey = queryKeys.user();

      // Rollback to the previous data
      if (context?.previousData) {
        queryClient.setQueryData<User>(queryKey, context.previousData);
      }

      console.error("Error updating user:", error);

      toast.error("Failed to update user. Please try again later.");
    },
  });

  return mutation;
}
