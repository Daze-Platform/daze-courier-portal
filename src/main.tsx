import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Detect if running as PWA
const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
              (window.navigator as any).standalone === true;

// Only apply aggressive cache busting in regular browser mode
if (!isPWA) {
  // Force no-cache on script tags in browser mode only
  const originalAppend = document.head.appendChild;
  document.head.appendChild = function(node: any) {
    if (node.tagName === 'SCRIPT' || node.tagName === 'LINK') {
      if (node.src) {
        const url = new URL(node.src, window.location.href);
        url.searchParams.set('v', Date.now().toString());
        node.src = url.toString();
      }
      if (node.href && node.rel === 'stylesheet') {
        const url = new URL(node.href, window.location.href);
        url.searchParams.set('v', Date.now().toString());
        node.href = url.toString();
      }
    }
    return originalAppend.call(this, node);
  };
}

// Register service worker for PWA with aggressive update checking
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Only register service worker in PWA mode or if explicitly requested
    const shouldRegisterSW = isPWA || window.location.search.includes('pwa=true');
    
    if (shouldRegisterSW) {
      navigator.serviceWorker.register('/sw.js', { 
        scope: '/',
        updateViaCache: 'none' // Force check for updates on every navigation
      })
        .then(registration => {
          console.log('SW registered:', registration);
          
          // Check for updates every 60 seconds
          setInterval(() => {
            registration.update();
          }, 60000);
          
          // Check for updates immediately
          registration.update();
          
          // Listen for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, reload the page
                  console.log('New content available, reloading...');
                  window.location.reload();
                }
              });
            }
          });
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    } else {
      // In regular browser mode, unregister any existing service workers
      navigator.serviceWorker.getRegistrations().then(registrations => {
        registrations.forEach(registration => {
          console.log('Unregistering SW for browser mode');
          registration.unregister();
        });
      });
      
      // Clear all caches in browser mode
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.delete(name);
          });
        });
      }
    }
  });
  
  // Handle controller change (new service worker took over)
  if (isPWA) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service worker controller changed, reloading...');
      window.location.reload();
    });
  }
}

createRoot(document.getElementById("root")!).render(<App />);
