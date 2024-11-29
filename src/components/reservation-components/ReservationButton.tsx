import { Button } from "../ui/button";

interface ReservationButtonProps {
  handleReserveClick: () => void;
}

export default function ReservationButton({
  handleReserveClick,
}: ReservationButtonProps) {
  return (
    <Button
      size="lg"
      variant={"gooeyRight"}
      onClick={handleReserveClick}
      className="h-14 w-full rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-lg font-semibold text-primary before:duration-700"
    >
      Reserve
    </Button>
  );
}
