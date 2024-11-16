import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query";
import { createReservationAction } from "../actions/createReservationAction";
import { Booking } from "../BookingValidation";
import { toast } from "sonner";

export function useCreateReservationMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createReservationAction,

    onSuccess: async (newReservation) => {
      const queryKey: QueryKey = ["reservationsByUser"];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<Booking[]>(queryKey, (oldReservations) => {
        return [...(oldReservations || []), newReservation];
      });

      queryClient.invalidateQueries({ queryKey });

      toast.success("Reservation created successfully");
    },

    onError(error) {
      console.error("Error creating reservation:", error);
      console.error("Error Response:", (error as any).response?.data);

      const errorMessage =
        (error as any).response?.data?.message ||
        "Failed creating reservation. Please try again later.";
      toast.error(errorMessage);
    },
  });

  return mutation;
}
