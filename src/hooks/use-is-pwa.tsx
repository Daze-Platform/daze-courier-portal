import { useState, useEffect } from 'react';

/**
 * Hook to detect if the app is running as a PWA (installed to home screen)
 * or in a regular browser
 */
export const useIsPWA = () => {
  const [isPWA, setIsPWA] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = (window.navigator as any).standalone === true;
    
    setIsPWA(isStandalone || isIOSStandalone);
  }, []);

  return isPWA;
};
