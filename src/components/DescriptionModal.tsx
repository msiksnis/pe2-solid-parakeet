import { Modal } from "./Modal";
import { Separator } from "./ui/separator";

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
    <Modal isOpen={isOpen} onClose={onClose} className="">
      <div>
        <div className="pb-2 text-2xl">Description</div>
        <Separator />
        <div className="no-scrollbar max-h-[70vh] overflow-y-auto pb-10 pt-4">
          {description}
        </div>
      </div>
    </Modal>
  );
}
