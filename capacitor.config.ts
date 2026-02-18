import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dazeapp.courier',
  appName: 'Daze Courier',
  webDir: 'dist',
  server: {
    // In production, serve from bundled files (no remote URL)
    // For dev, uncomment and set to your local/dev server:
    // url: 'http://localhost:8080',
    // cleartext: true,
  },
  plugins: {
    Geolocation: {
      // iOS: request "always" permission for background tracking
      // This enables continuous location updates while delivering
    },
  },
  ios: {
    // iOS-specific configuration
    contentInset: 'automatic',
    scheme: 'Daze Courier',
    backgroundColor: '#1e3a5f',
  },
};

export default config;
