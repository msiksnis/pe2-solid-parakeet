import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createVenueAction } from "../actions/createVenueAction";
import { updateVenueAction } from "../actions/updateVenueAction";
import { createTempVenue, Venue } from "../VenueValidation";

/**
 * Custom hook to handle the creation and updating of venues with optimistic updates.
 * It updates the cache optimistically and rolls back in case of an error.
 *
 * @returns A mutation object from React Query for creating or updating a venue.
 */
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

    onSuccess: (_data, variables) => {
      baseQueryKeys.forEach((key) =>
        queryClient.invalidateQueries({
          queryKey: key,
        }),
      );

      toast.success(
        variables.isUpdate
          ? "Venue updated successfully!"
          : "Venue created successfully!",
      );
    },

    onError: (error, variables, context) => {
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
