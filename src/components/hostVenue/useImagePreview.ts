import { useState } from "react";

export function useImagePreview() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (
    value: string,
    onChange: (val: string) => void,
  ) => {
    onChange(value); // Update the form field with the new value
    if (value) {
      setImagePreview(value); // Set the preview if the URL is valid
    } else {
      setImagePreview(null); // Clear the preview if the field is empty
    }
  };

  return { imagePreview, handleImageChange };
}
