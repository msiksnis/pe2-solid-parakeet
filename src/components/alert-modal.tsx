import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export default function AlertModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
}: AlertModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div>
        <div className="text-xl">Are you sure you want to delete?</div>
        <p className="text-paragraph">This action cannot be undone.</p>
      </div>
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button
          variant="outline"
          size="lg"
          disabled={loading}
          onClick={onClose}
          className="font-normal"
        >
          Cancel
        </Button>
        <Button
          variant="destructive"
          size="lg"
          disabled={loading}
          onClick={onConfirm}
          className="bg-red-500 font-normal text-white hover:bg-red-600"
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}
