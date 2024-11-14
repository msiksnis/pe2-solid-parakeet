import { cn } from "@/lib/utils";

interface MainLoaderProps {
  className?: string;
}

export default function MainLoader({ className }: MainLoaderProps) {
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
