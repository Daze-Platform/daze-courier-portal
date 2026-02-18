/**
 * useCourierLocation — Native GPS tracking for food runners
 * 
 * Uses Capacitor Geolocation plugin for high-accuracy native GPS.
 * Falls back to browser Geolocation API when running in web/PWA.
 * 
 * Features:
 * - Continuous position watching (native GPS when available)
 * - High accuracy mode for beach/pool precision delivery
 * - Background tracking support (native only)
 * - Heading/speed for navigation UX
 * - Error handling with user-friendly messages
 * 
 * Usage:
 *   const { position, isTracking, error, startTracking, stopTracking } = useCourierLocation();
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { Geolocation, type Position, type WatchPositionCallback } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

export interface CourierPosition {
  lat: number;
  lng: number;
  accuracy: number;       // meters
  heading: number | null;  // degrees from north (0-360)
  speed: number | null;    // meters per second
  altitude: number | null;
  timestamp: number;
}

export interface UseCourierLocationReturn {
  position: CourierPosition | null;
  isTracking: boolean;
  isNative: boolean;
  error: string | null;
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown';
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  getCurrentPosition: () => Promise<CourierPosition | null>;
}

/**
 * Convert Capacitor Position to our CourierPosition interface
 */
const toPosition = (pos: Position): CourierPosition => ({
  lat: pos.coords.latitude,
  lng: pos.coords.longitude,
  accuracy: pos.coords.accuracy,
  heading: pos.coords.heading ?? null,
  speed: pos.coords.speed ?? null,
  altitude: pos.coords.altitude ?? null,
  timestamp: pos.timestamp,
});

export const useCourierLocation = (): UseCourierLocationReturn => {
  const [position, setPosition] = useState<CourierPosition | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const watchIdRef = useRef<string | null>(null);

  const isNative = Capacitor.isNativePlatform();

  /**
   * Check and request geolocation permissions
   */
  const checkPermissions = useCallback(async () => {
    try {
      const status = await Geolocation.checkPermissions();
      
      if (status.location === 'granted' || status.coarseLocation === 'granted') {
        setPermissionStatus('granted');
        return true;
      }

      if (status.location === 'denied') {
        setPermissionStatus('denied');
        setError('Location permission denied. Please enable in Settings to deliver orders.');
        return false;
      }

      // Need to request permission
      const requested = await Geolocation.requestPermissions();
      if (requested.location === 'granted' || requested.coarseLocation === 'granted') {
        setPermissionStatus('granted');
        return true;
      }

      setPermissionStatus('denied');
      setError('Location permission is required for deliveries. Please enable in Settings.');
      return false;
    } catch (err) {
      console.warn('[CourierLocation] Permission check failed:', err);
      // On web, permissions are handled by the browser prompt
      setPermissionStatus('prompt');
      return true;
    }
  }, []);

  /**
   * Get a single high-accuracy position fix
   */
  const getCurrentPosition = useCallback(async (): Promise<CourierPosition | null> => {
    try {
      const hasPermission = await checkPermissions();
      if (!hasPermission) return null;

      const pos = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });

      const courierPos = toPosition(pos);
      setPosition(courierPos);
      setError(null);
      return courierPos;
    } catch (err: any) {
      const message = err?.message || 'Unable to get location';
      console.error('[CourierLocation] getCurrentPosition error:', message);
      setError(message);
      return null;
    }
  }, [checkPermissions]);

  /**
   * Start continuous position watching
   * Uses native GPS on iOS, browser Geolocation on web
   */
  const startTracking = useCallback(async () => {
    if (isTracking) return;

    const hasPermission = await checkPermissions();
    if (!hasPermission) return;

    try {
      // Clear any existing watch
      if (watchIdRef.current) {
        await Geolocation.clearWatch({ id: watchIdRef.current });
      }

      const callback: WatchPositionCallback = (pos, err) => {
        if (err) {
          console.error('[CourierLocation] Watch error:', err);
          setError(err.message || 'Location tracking error');
          return;
        }
        if (pos) {
          const courierPos = toPosition(pos);
          setPosition(courierPos);
          setError(null);
        }
      };

      const id = await Geolocation.watchPosition(
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 3000, // Accept positions up to 3s old
        },
        callback
      );

      watchIdRef.current = id;
      setIsTracking(true);
      setError(null);

      console.log(`[CourierLocation] Tracking started (${isNative ? 'native GPS' : 'browser'}), watchId: ${id}`);
    } catch (err: any) {
      console.error('[CourierLocation] startTracking error:', err);
      setError(err?.message || 'Failed to start location tracking');
    }
  }, [isTracking, checkPermissions, isNative]);

  /**
   * Stop position watching
   */
  const stopTracking = useCallback(() => {
    if (watchIdRef.current) {
      Geolocation.clearWatch({ id: watchIdRef.current });
      watchIdRef.current = null;
    }
    setIsTracking(false);
    console.log('[CourierLocation] Tracking stopped');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        Geolocation.clearWatch({ id: watchIdRef.current });
      }
    };
  }, []);

  return {
    position,
    isTracking,
    isNative,
    error,
    permissionStatus,
    startTracking,
    stopTracking,
    getCurrentPosition,
  };
};
