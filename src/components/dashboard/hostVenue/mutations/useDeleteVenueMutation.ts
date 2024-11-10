import { authenticatedAxiosInstance } from "@/lib/axiosInstance";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Venue } from "../VenueValidation";

export const useDeleteVenueMutation = () => {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["venuesByUser"] as const;

  const mutation = useMutation<
    void, // Return type from mutationFn
    Error, // Error type
    string, // Input type to mutationFn (venueId)
    { previousVenues: Venue[] | undefined } // Context type for rollback
  >({
    mutationFn: async (venueId) => {
      await authenticatedAxiosInstance.delete(`/venues/${venueId}`);
    },
    onMutate: async (venueId) => {
      await queryClient.cancelQueries({ queryKey });

      const previousVenues = queryClient.getQueryData<Venue[]>(queryKey);

      queryClient.setQueryData<Venue[]>(queryKey, (oldVenues = []) =>
        oldVenues.filter((venue) => venue.id !== venueId),
      );

      // Return the context with previous data for rollback
      return { previousVenues };
    },
    onSuccess: (venueId) => {
      queryClient.invalidateQueries({ queryKey });
      queryClient.removeQueries({ queryKey: ["venue", venueId] });

      toast.success("Venue deleted successfully!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return mutation;
};
