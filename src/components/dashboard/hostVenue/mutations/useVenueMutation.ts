import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createVenueAction } from "../actions/createVenueAction";
import { updateVenueAction } from "../actions/updateVenueAction";
import { createTempVenue, Venue } from "../VenueValidation";

export function useVenueMutation() {
  const queryClient = useQueryClient();
  const baseQueryKeys: QueryKey[] = [["venue"], ["venuesByUser"], ["venues"]];

  const handleCreateVenue = (data: Venue) => createVenueAction(data);
  const handleUpdateVenue = (venueId: string, data: Venue) =>
    updateVenueAction(venueId, data);

  const mutation = useMutation<
    Venue,
    Error,
    { isUpdate: boolean; venueId?: string; data: Partial<Venue> },
    { previousData: Record<string, Venue[]> }
  >({
    mutationFn: async ({ isUpdate, venueId, data }) => {
      if (isUpdate && venueId) {
        return handleUpdateVenue(venueId, data as Venue);
      }
      return handleCreateVenue(data as Venue);
    },

    onMutate: async ({ isUpdate, venueId, data }) => {
      await queryClient.cancelQueries();

      const previousData: Record<string, Venue[]> = {};

      // Optimistically update all relevant query keys
      baseQueryKeys.forEach((key) => {
        const previous = queryClient.getQueryData<Venue[]>(key);
        if (previous) {
          previousData[key.join()] = previous;
          queryClient.setQueryData<Venue[]>(key, (oldVenues = []) => {
            if (isUpdate && venueId) {
              return oldVenues.map((venue) =>
                venue.id === venueId ? { ...venue, ...data } : venue,
              );
            }
            return [...oldVenues, createTempVenue(data)];
          });
        }
      });

      return { previousData };
    },

    onSuccess: (variables) => {
      // Invalidate all relevant queries on success
      baseQueryKeys.forEach((key) =>
        queryClient.invalidateQueries({
          queryKey: key,
        }),
      );

      toast.success(
        variables.updated
          ? "Venue updated successfully!"
          : "Venue created successfully!",
      );
    },

    onError: (error, variables, context) => {
      // Rollback to previous data for all affected queries
      if (context?.previousData) {
        Object.entries(context.previousData).forEach(([key, data]) => {
          queryClient.setQueryData(key.split(","), data);
        });
      }

      toast.error(
        error.message ||
          `Failed to ${variables.isUpdate ? "update" : "create"} venue. Please try again.`,
      );
    },
  });

  return mutation;
}
