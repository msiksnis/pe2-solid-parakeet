import { cn } from "@/lib/utils";
import {
  ResponsiveModal,
  ResponsiveModalOverlay,
  ResponsiveModalContent,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
} from "./ui/responsive-nodal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, children, className }: ModalProps) {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <ResponsiveModal open={isOpen} onOpenChange={onChange}>
      <ResponsiveModalOverlay>
        <ResponsiveModalContent className={cn("overflow-y-hidden", className)}>
          <ResponsiveModalHeader className="sr-only">
            <ResponsiveModalTitle>Modal Title</ResponsiveModalTitle>
            <ResponsiveModalDescription>Description</ResponsiveModalDescription>
          </ResponsiveModalHeader>
          {children}
        </ResponsiveModalContent>
      </ResponsiveModalOverlay>
    </ResponsiveModal>
  );
}
