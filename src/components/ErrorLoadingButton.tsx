import { cn } from "../lib/utils";

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
        "mt-32 flex flex-col items-center justify-center space-y-4",
        className,
      )}
    >
      <p className="text-red-500">{errorMessage}</p>
      <button
        onClick={onRetry}
        className="hover:bg-muted rounded-full border px-4 py-1.5 shadow-sm transition-all duration-200"
      >
        Retry
      </button>
    </div>
  );
}
