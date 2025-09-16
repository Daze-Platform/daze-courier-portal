import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.13e8cc90fc934ab8b494e393b796253a',
  appName: 'resort-runner-pro',
  webDir: 'dist',
  server: {
    url: "https://13e8cc90-fc93-4ab8-b494-e393b796253a.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;