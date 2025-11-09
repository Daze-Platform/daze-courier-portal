import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';
import { usePWAUpdate } from '@/hooks/use-pwa-update';

export const PWAUpdatePrompt = () => {
  const { needRefresh, updateServiceWorker, closePrompt } = usePWAUpdate();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (needRefresh) {
      setShowPrompt(true);
    }
  }, [needRefresh]);

  const close = () => {
    closePrompt();
    setShowPrompt(false);
  };

  const handleUpdate = () => {
    updateServiceWorker();
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 lg:left-auto lg:right-4 lg:max-w-md z-[200] animate-slide-in-right">
      <div className="bg-card border border-border rounded-lg shadow-xl p-4 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
            <RefreshCw className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground mb-1">
              Update Available
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              A new version of the app is ready. Refresh to get the latest features and improvements.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleUpdate}
                className="flex-1 bg-primary hover:bg-primary/90"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Update Now
              </Button>
              <Button
                onClick={close}
                variant="outline"
                size="sm"
              >
                Later
              </Button>
            </div>
          </div>
          <button
            onClick={close}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
