import { useEffect, useState } from 'react';

export const usePWAUpdate = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Listen for controller change (only reload when SW actually updates)
      const handleControllerChange = () => {
        if (needRefresh) {
          window.location.reload();
        }
      };

      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Check for updates periodically (every 6 hours to reduce frequency)
        const interval = setInterval(() => {
          reg.update();
        }, 6 * 60 * 60 * 1000);

        // Listen for new service worker waiting
        const onUpdateFound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setNeedRefresh(true);
              }
            });
          }
        };

        reg.addEventListener('updatefound', onUpdateFound);

        // Only check for updates on mount in production
        if (import.meta.env.PROD) {
          reg.update();
        }

        return () => {
          clearInterval(interval);
          reg.removeEventListener('updatefound', onUpdateFound);
        };
      });

      return () => {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      };
    }
  }, [needRefresh]);

  const updateServiceWorker = () => {
    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  };

  return {
    needRefresh,
    updateServiceWorker,
    closePrompt: () => setNeedRefresh(false),
  };
};
