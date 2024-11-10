import { cn } from "../lib/utils";
import { Button } from "./ui/button";

interface ErrorButtonProps {
  errorMessage: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorLoadingButton({
  errorMessage,
  onRetry = () => window.location.reload(),
  className,
}: ErrorButtonProps) {
  return (
    <div
      className={cn(
        "mt-32 flex flex-col items-center justify-center space-y-6",
        className,
      )}
    >
      <p className="text-red-500">{errorMessage}</p>
      <Button
        variant={"ringHover"}
        onClick={onRetry}
        className="rounded-full border border-primary bg-card px-6 py-1.5 text-primary shadow-sm transition-all duration-200 hover:bg-muted"
      >
        Retry
      </Button>
    </div>
  );
}
