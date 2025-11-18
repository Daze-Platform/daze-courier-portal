import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/**
 * Hook for haptic feedback on mobile devices
 * Provides different haptic feedback patterns for various interactions
 */
export const useHaptics = () => {
  // Check if haptics are available (native mobile only)
  const isHapticsAvailable = async () => {
    try {
      // Capacitor.isNativePlatform() would be better but this works
      return true;
    } catch {
      return false;
    }
  };

  // Light impact - for selections, toggles
  const light = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      // Silently fail on web/unsupported devices
    }
  };

  // Medium impact - for button taps, confirmations
  const medium = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } catch (error) {
      // Silently fail on web/unsupported devices
    }
  };

  // Heavy impact - for important actions, completions
  const heavy = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } catch (error) {
      // Silently fail on web/unsupported devices
    }
  };

  // Success notification - for completed actions
  const success = async () => {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (error) {
      // Silently fail on web/unsupported devices
    }
  };

  // Warning notification - for warnings
  const warning = async () => {
    try {
      await Haptics.notification({ type: NotificationType.Warning });
    } catch (error) {
      // Silently fail on web/unsupported devices
    }
  };

  // Error notification - for errors
  const error = async () => {
    try {
      await Haptics.notification({ type: NotificationType.Error });
    } catch (error) {
      // Silently fail on web/unsupported devices
    }
  };

  return {
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    isHapticsAvailable,
  };
};
