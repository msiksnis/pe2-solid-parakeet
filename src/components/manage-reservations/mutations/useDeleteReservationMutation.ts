import { authenticatedAxiosInstance } from "@/lib/axiosInstance";
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Reservation } from "../types";

/**
 * Custom hook to handle reservation deletion/cancelation with optimistic updates.
 * It updates the cache to remove the deleted reservation and handles rollback in case of failure.
 *
 * @returns A mutation object from React Query for deleting a reservation.
 */
export const useDeleteReservationMutation = () => {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["reservationsByUser"];

  const mutation = useMutation<
    void, // Nothing is returned from the API
    Error,
    string,
    { previousData: Record<string, Reservation[] | undefined> }
  >({
    mutationFn: async (reservationId) => {
      await authenticatedAxiosInstance.delete(`/bookings/${reservationId}`);
    },
    onMutate: async (reservationId) => {
      const queryKey: QueryKey = ["reservationsByUser"];

      await queryClient.cancelQueries({ queryKey });

      const previousData = queryClient.getQueryData<Reservation[]>(queryKey);

      queryClient.setQueryData<Reservation[]>(
        queryKey,
        (oldReservations = []) =>
          oldReservations.filter(
            (reservation) => reservation.id !== reservationId,
          ),
      );

      return { previousData: { default: previousData } };
    },
    onSuccess: () => {
      toast.success("Reservation canceled successfully!");
    },
    onError: (error, _reservationId, context) => {
      const queryKey: QueryKey = ["reservationsByUser"];

      if (context?.previousData) {
        queryClient.setQueryData<Reservation[]>(
          queryKey,
          context.previousData.default,
        );
      }

      console.error("Error deleting reservation:", error);
      toast.error("Failed to cancel reservation. Please try again.");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return mutation;
};
