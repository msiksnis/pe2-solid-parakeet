import { Modal } from "./Modal";

interface DescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  description: string;
}

export default function DescriptionModal({
  isOpen,
  onClose,
  description,
}: DescriptionModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-h-[60vh] overflow-y-auto"
    >
      <div>
        <div className="text-2xl">Description</div>
      </div>
      <div className="pb-10 pt-4">{description}</div>
    </Modal>
  );
}
