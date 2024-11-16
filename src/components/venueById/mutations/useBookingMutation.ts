import {
  QueryFilters,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { Booking, createTempBooking } from "../BookingValidation";
import { createBookingAction } from "../actions/createBookingAction";
import { updateBookingAction } from "../actions/updateBookingAction";

export function useBookingMutation() {
  const queryClient = useQueryClient();
  const queryKey: QueryKey = ["reservationsByUser"];

  const handleCreateBooking = (data: Booking) => createBookingAction(data);
  const handleUpdateBooking = (bookingId: string, data: Booking) =>
    updateBookingAction(bookingId, data);

  const mutation = useMutation<
    Booking,
    Error,
    { isUpdate: boolean; bookingId?: string; data: Partial<Booking> },
    { previousData: Record<string, Booking> }
  >({
    mutationFn: async ({ isUpdate, bookingId, data }) => {
      if (isUpdate && bookingId) {
        return handleUpdateBooking(bookingId, data as Booking);
      }
      return handleCreateBooking(data as Booking);
    },

    onMutate: async ({ isUpdate, bookingId, data }) => {
      console.log("onMutate triggered:", { isUpdate, bookingId, data });

      await queryClient.cancelQueries({ queryKey });

      const previousDataArray =
        queryClient.getQueryData<Booking[]>(queryKey) || [];

      console.log("Previous data from cache:", previousDataArray);

      const previousData: Record<string, Booking> = previousDataArray.reduce(
        (acc, booking) => {
          acc[booking.id] = booking;
          return acc;
        },
        {} as Record<string, Booking>,
      );

      queryClient.setQueryData<Booking[]>(queryKey, (oldBooking = []) => {
        if (isUpdate && bookingId) {
          return oldBooking.map((booking) =>
            booking.id === bookingId ? { ...booking, ...data } : booking,
          );
        } else {
          const newBooking = createTempBooking(data);

          console.log("Temporary new booking created:", newBooking);

          return [...oldBooking, newBooking];
        }
      });

      return { previousData };
    },

    onSuccess: async (newBooking, variables) => {
      console.log("Mutation succeeded:", { newBooking, variables });

      const queryFilter = {
        queryKey,
        predicate(query) {
          return query.queryKey.includes("booking");
        },
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilter);

      // Update the cache with the new booking
      queryClient.setQueriesData<Booking[]>(queryFilter, (oldBooking = []) =>
        oldBooking.map((booking) =>
          booking.id === newBooking.id ? newBooking : booking,
        ),
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      toast.success(
        `Reservation ${variables.isUpdate ? "updated successfully!" : "successfully created!"}`,
      );
    },

    onError: async (error, newBooking, context) => {
      queryClient.setQueryData(queryKey, context?.previousData);

      console.log("Error creating/updating booking:", error);

      toast.error(
        `Failed to ${
          newBooking.isUpdate ? "update" : "create"
        } reservation. Please try again later.`,
      );
    },
  });

  return mutation;
}
