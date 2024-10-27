import { useEffect, useRef } from "react";
import LandingImage from "./LandingImage";

/**
 * LandingSection component that renders a responsive section with text and an image background.
 * The text dynamically adjusts its size and line height based on the container width.
 *
 * @returns {JSX.Element} The rendered LandingSection component.
 */
export default function LandingSection(): JSX.Element {
  // Reference to the span element that contains the text
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Get the text container element
    const container = document.querySelector(".text-container");

    // ResizeObserver to observe the changes in the size of the container
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const containerWidth = entry.contentRect.width;

        // Calculate the new font size and line height based on the container's width
        const newSize = containerWidth / 7; // Ratio of text size to container width
        const newLineHeight = newSize * 1.1; // Ratio of line height to text size

        // Apply the new font size and line height to the text, if the textRef is valid
        if (textRef.current) {
          const text = textRef.current;
          text.style.fontSize = `${newSize}px`;
          text.style.lineHeight = `${newLineHeight}px`;
        }
      }
    });

    // Start observing the container for size changes
    if (container) {
      resizeObserver.observe(container);
    }

    // Cleanup observer when the component unmounts to avoid memory leaks
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative hidden sm:block">
      {/* Text container with dynamic size adjustment */}
      <div className="text-container absolute left-10 top-8 z-20 h-2/5 w-[45%] text-center font-semibold lg:left-14 lg:top-14 xl:left-20 xl:w-[42%]">
        <span ref={textRef} className="block">
          Find your best place to stay
        </span>
      </div>

      {/* Image component */}
      <LandingImage />

      {/* Background blur effect */}
      <div className="absolute left-0 top-0 z-0 h-4/5 w-full rounded-full bg-orange-100/60 blur-[90px]"></div>
    </div>
  );
}
