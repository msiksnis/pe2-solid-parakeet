import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createVenueAction } from "../actions/createVenueAction";
import { updateVenueAction } from "../actions/updateVenueAction";
import { createTempVenue, Venue } from "../VenueValidation";

export function useVenueMutation() {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["venue"] as const;

  const handleCreateVenue = (data: Venue) => createVenueAction(data);
  const handleUpdateVenue = (venueId: string, data: Venue) =>
    updateVenueAction(venueId, data);

  const mutation = useMutation<
    Venue,
    Error,
    { isUpdate: boolean; venueId?: string; data: Partial<Venue> },
    { previousVenues?: Venue[] }
  >({
    mutationFn: async ({ isUpdate, venueId, data }) => {
      if (isUpdate && venueId) {
        return handleUpdateVenue(venueId, data as Venue);
      }
      return handleCreateVenue(data as Venue);
    },

    onMutate: async ({ isUpdate, venueId, data }) => {
      await queryClient.cancelQueries({ queryKey });

      const previousVenues = queryClient.getQueryData<Venue[]>(queryKey);

      queryClient.setQueryData<Venue[]>(queryKey, (oldVenues = []) => {
        if (isUpdate && venueId) {
          return oldVenues.map((venue) =>
            venue.id === venueId ? { ...venue, ...data } : venue,
          );
        }
        return [...oldVenues, createTempVenue(data)];
      });

      return { previousVenues };
    },
    onSuccess: (isUpdate) => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.includes(queryKey) || query.queryKey.includes("venue"),
      });

      toast.success(
        isUpdate
          ? "Venue updated successfully!"
          : "Venue created successfully!",
      );
    },
    onError: (error, variables, context) => {
      if (context?.previousVenues) {
        queryClient.setQueryData(["venuesByUser"], context.previousVenues);
      }

      toast.error(
        error.message ||
          `Failed to ${variables.isUpdate ? "update" : "create"} venue. Please try again.`,
      );
    },
  });

  return mutation;
}
