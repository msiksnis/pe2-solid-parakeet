import { useEffect } from "react";

/**
 * Custom hook to handle clicks outside a specified element.
 *
 * @param ref - The reference to the DOM element.
 * @param callback - The function to call when an outside click is detected.
 */
export function useOutsideClick(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

/**
 * Custom hook to handle the Escape key press.
 *
 * @param callback - The function to call when the Escape key is pressed.
 */
export function useEscapeKey(callback: () => void) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        callback();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [callback]);
}
