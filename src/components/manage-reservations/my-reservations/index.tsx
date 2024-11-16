import ReservationCard from "../components/ReservationCard";

export default function MyReservations() {
  return (
    <div className="mx-auto my-20 max-w-7xl px-4 sm:px-6 lg:px-10 xl:px-4">
      <h1 className="px-4 text-3xl">My all reservations</h1>

      <ReservationCard />
    </div>
  );
}
