import { compareAsc, format } from "date-fns";

import { Modal } from "@/components/Modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Booking } from "@/lib/types";

interface UpcomingBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings?: Booking[];
  venueName?: string;
}

export default function UpcomingBookingsModal({
  isOpen,
  onClose,
  bookings,
  venueName,
}: UpcomingBookingsModalProps) {
  const now = new Date();

  const sortedBookings = bookings
    ?.filter((booking) => new Date(booking.dateFrom) > now)
    .sort((a, b) => compareAsc(new Date(a.dateFrom), new Date(b.dateFrom)));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="text-xl">
          A list of all upcoming reservations for{" "}
          <span className="italic">{venueName}</span>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date from</TableHead>
            <TableHead>Date to</TableHead>
            <TableHead>Guests</TableHead>
            <TableHead>Customer</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedBookings?.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {format(booking.dateFrom, "d MMM yyyy")}
              </TableCell>
              <TableCell>{format(booking.dateTo, "d MMM yyyy")}</TableCell>
              <TableCell>{booking.guests}</TableCell>
              <TableCell className="w-32 max-w-32 truncate">
                {booking.customer.name}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Modal>
  );
}
