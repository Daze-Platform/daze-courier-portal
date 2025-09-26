import { useEffect, useState } from 'react';

interface UseImagePreloadResult {
  isLoading: boolean;
  hasError: boolean;
}

export const useImagePreload = (imageSrc: string): UseImagePreloadResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!imageSrc) {
      setIsLoading(false);
      return;
    }

    const img = new Image();
    
    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
    };
    
    const handleError = () => {
      setIsLoading(false);
      setHasError(true);
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);
    
    img.src = imageSrc;

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [imageSrc]);

  return { isLoading, hasError };
};

export const preloadImages = (imageSources: string[]): Promise<void[]> => {
  return Promise.all(
    imageSources.map(src => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Resolve even on error to not block other images
        img.src = src;
      });
    })
  );
};