import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateReservationsAction } from "../actions/updateReservationAction";
import { Reservation } from "../types";

export function useUpdateReservationMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      bookingId,
      data,
    }: {
      bookingId: string;
      data: Partial<Reservation>;
    }) => updateReservationsAction(bookingId, data),

    onMutate: async ({ bookingId, data }) => {
      const queryKey: QueryKey = ["reservationsByUser"];

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<Reservation[]>(queryKey);

      queryClient.setQueryData<Reservation[]>(
        queryKey,
        (oldReservations = []) =>
          oldReservations.map((reservation) =>
            reservation.id === bookingId
              ? { ...reservation, ...data }
              : reservation,
          ),
      );

      return { previousData };
    },

    onSuccess: async (updatedReservation) => {
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
