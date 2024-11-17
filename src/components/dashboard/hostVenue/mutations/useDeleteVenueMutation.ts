import { authenticatedAxiosInstance } from "@/lib/axiosInstance";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Venue } from "../VenueValidation";

/**
 * Custom hook to handle venue deletion with optimistic updates.
 * It updates the cache to remove the deleted venue and handles rollback in case of failure.
 *
 * @returns A mutation object from React Query for deleting a venue.
 */
export const useDeleteVenueMutation = () => {
  const queryClient = useQueryClient();
  const baseQueryKeys: QueryKey[] = [["venuesByUser"], ["venues"]];

  const mutation = useMutation<
    void,
    Error,
    string,
    { previousData: Record<string, Venue[] | undefined> }
  >({
    mutationFn: async (venueId) => {
      await authenticatedAxiosInstance.delete(`/venues/${venueId}`);
    },
    onMutate: async (venueId) => {
      await queryClient.cancelQueries();

      const previousData: Record<string, Venue[] | undefined> = {};

      baseQueryKeys.forEach((key) => {
        const previous = queryClient.getQueryData<Venue[]>(key);
        if (previous) {
          previousData[key.join()] = previous;
          queryClient.setQueryData<Venue[]>(key, (oldVenues = []) =>
            oldVenues.filter((venue) => venue.id !== venueId),
          );
        }
      });

      return { previousData };
    },
    onSuccess: (_data, venueId) => {
      baseQueryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      queryClient.removeQueries({ queryKey: ["venue", venueId] });

      toast.success("Venue deleted successfully!");
    },
    onSettled: () => {
      baseQueryKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key }),
      );
    },
  });

  return mutation;
};
