import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateReservationsAction } from "../actions/updateReservationAction";
import { Reservation } from "../types";

/**
 * Custom hook to handle updating reservations with optimistic updates.
 * It updates the cache optimistically and rolls back in case of an error.
 *
 * @returns A mutation object from React Query for updating a reservation.
 */
export function useUpdateReservationMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    Reservation,
    Error,
    { reservationId: string; data: Partial<Reservation> },
    { previousData: Reservation[] | undefined }
  >({
    mutationFn: ({ reservationId, data }) =>
      updateReservationsAction(reservationId, data),

    onMutate: async ({ reservationId, data }) => {
      const queryKey: QueryKey = ["reservationsByUser"];

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<Reservation[]>(queryKey);

      queryClient.setQueryData<Reservation[]>(
        queryKey,
        (oldReservations = []) =>
          oldReservations.map((reservation) =>
            reservation.id === reservationId
              ? { ...reservation, ...data }
              : reservation,
          ),
      );

      return { previousData };
    },

    onSuccess: (updatedReservation) => {
      const queryKey: QueryKey = ["reservationsByUser"];

      queryClient.setQueryData<Reservation[]>(
        queryKey,
        (oldReservations = []) =>
          oldReservations.map((reservation) =>
            reservation.id === updatedReservation.id
              ? updatedReservation
              : reservation,
          ),
      );

      queryClient.invalidateQueries({ queryKey });

      toast.success("Reservation updated successfully");
    },

    onError: (error, _, context) => {
      const queryKey: QueryKey = ["reservationsByUser"];

      queryClient.setQueryData(queryKey, context?.previousData);

      console.error("Error updating reservation:", error);

      toast.error("Failed to update reservation. Please try again later.");
    },
  });

  return mutation;
}
