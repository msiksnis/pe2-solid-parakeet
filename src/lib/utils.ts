import { clsx, type ClassValue } from "clsx";
import { useMediaQuery } from "react-responsive";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const useScreenSizes = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isMedium = useMediaQuery({
    query: "(min-width: 768px) and (max-width: 1279px)",
  });
  const isExtraLarge = useMediaQuery({ query: "(min-width: 1280px)" });

  return { isMobile, isMedium, isExtraLarge };
};
