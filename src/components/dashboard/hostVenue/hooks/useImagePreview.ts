import { useEffect, useState } from "react";

export const useImagePreview = (initialUrl: string | undefined = "") => {
  const [imagePreview, setImagePreview] = useState<string | undefined>(
    initialUrl,
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (
    url: string,
    onChange: (value: string) => void,
  ) => {
    onChange(url);
    if (url) {
      setIsLoading(true);
      setImagePreview(url);
    } else {
      setImagePreview(undefined);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (imagePreview) {
      const img = new Image();
      img.src = imagePreview;
      img.onload = () => setIsLoading(false);
      img.onerror = () => {
        setIsLoading(false);
        setImagePreview(undefined);
      };
    }
  }, [imagePreview]);

  useEffect(() => {
    if (initialUrl) {
      setIsLoading(true);
      setImagePreview(initialUrl);
    }
  }, [initialUrl]);

  return {
    imagePreview,
    isLoading,
    handleImageChange,
  };
};
