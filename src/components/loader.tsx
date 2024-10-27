import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
}

export default function Loader({ className }: LoaderProps) {
  return (
    <div className={cn("flex justify-center", className)}>
      <div className="loader">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
