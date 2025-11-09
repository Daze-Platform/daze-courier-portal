import { useEffect, useState } from 'react';

export const usePWAUpdate = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg);

        // Check for updates periodically
        const interval = setInterval(() => {
          reg.update();
        }, 60 * 60 * 1000); // Check every hour

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

        // Check for updates on mount
        reg.update();

        return () => {
          clearInterval(interval);
          reg.removeEventListener('updatefound', onUpdateFound);
        };
      });

      // Listen for controller change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

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
