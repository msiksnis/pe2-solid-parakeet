import { Modal } from "./Modal";
import { Button } from "./ui/button";

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function WarningModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: WarningModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="text-xl">
          Are you sure you want to cancel this reservation?
        </div>
        <p className="text-paragraph">This action cannot be undone.</p>
      </div>
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button
          variant={"gooeyLeft"}
          size="lg"
          disabled={loading}
          onClick={onConfirm}
          className="w-52 border border-primary bg-muted from-gray-200 text-base text-primary after:duration-500"
        >
          Cancel reservation
        </Button>
        <Button
          variant={"gooeyLeft"}
          size="lg"
          disabled={loading}
          onClick={onClose}
          className="w-52 text-base after:duration-500"
        >
          Don&apos;t cancel
        </Button>
      </div>
    </Modal>
  );
}
