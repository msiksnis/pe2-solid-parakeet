import { authenticatedAxiosInstance } from "@/lib/axiosInstance";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Venue } from "../VenueValidation";

export const useDeleteVenueMutation = () => {
  const queryClient = useQueryClient();
  const baseQueryKeys: QueryKey[] = [["venuesByUser"], ["venues"]];

  const mutation = useMutation<
    void, // Return type from mutationFn
    Error, // Error type
    string, // Input type to mutationFn (venueId)
    { previousData: Record<string, Venue[] | undefined> } // Context type for rollback
  >({
    mutationFn: async (venueId) => {
      await authenticatedAxiosInstance.delete(`/venues/${venueId}`);
    },
    onMutate: async (venueId) => {
      // Cancel any ongoing queries
      await queryClient.cancelQueries();

      // Store previous data for all relevant query keys
      const previousData: Record<string, Venue[] | undefined> = {};

      // Optimistically update all relevant queries
      baseQueryKeys.forEach((key) => {
        const previous = queryClient.getQueryData<Venue[]>(key);
        if (previous) {
          previousData[key.join()] = previous;
          queryClient.setQueryData<Venue[]>(key, (oldVenues = []) =>
            oldVenues.filter((venue) => venue.id !== venueId),
          );
        }
      });

      // Return previous data for rollback
      return { previousData };
    },
    onSuccess: (venueId) => {
      // Invalidate all relevant queries to refetch fresh data
      baseQueryKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      // Remove individual venue query cache
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
