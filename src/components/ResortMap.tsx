import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from '@/hooks/use-mapbox-token';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResortMapProps {
  destination?: string;
  isDelivering?: boolean;
  focusArea?: 'pool' | 'beach' | 'overview';
  customerLocation?: { lng: number; lat: number; label?: string };
  courierLocation?: { lng: number; lat: number };
  onNavigateClick?: () => void;
}

// SpringHill Suites Panama City Beach coordinates
const RESORT_CENTER = {
  lng: -85.8019,
  lat: 30.1766,
};

const RESORT_BOUNDS: [[number, number], [number, number]] = [
  [-85.8035, 30.1755], // Southwest
  [-85.8000, 30.1780], // Northeast
];

// Sample amenity locations for demo
const SAMPLE_AMENITIES = {
  poolBar: { lng: -85.8015, lat: 30.1768 },
  beachBar: { lng: -85.8012, lat: 30.1772 },
  poolDeck: { lng: -85.8018, lat: 30.1765 },
  beachZone: { lng: -85.8010, lat: 30.1775 },
};

const ResortMap: React.FC<ResortMapProps> = ({
  destination,
  isDelivering = false,
  focusArea = 'overview',
  customerLocation,
  courierLocation,
  onNavigateClick,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const customerMarker = useRef<mapboxgl.Marker | null>(null);
  const courierMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { token, loading: tokenLoading, error: tokenError } = useMapboxToken();

  // Get focus coordinates based on area
  const getFocusCoordinates = () => {
    switch (focusArea) {
      case 'pool':
        return { center: SAMPLE_AMENITIES.poolDeck, zoom: 19 };
      case 'beach':
        return { center: SAMPLE_AMENITIES.beachZone, zoom: 19 };
      default:
        return { center: RESORT_CENTER, zoom: 17.5 };
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;

    const focusConfig = getFocusCoordinates();

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [focusConfig.center.lng, focusConfig.center.lat],
      zoom: focusConfig.zoom,
      pitch: 45,
      bearing: -17.6,
      maxBounds: RESORT_BOUNDS,
      minZoom: 16,
      maxZoom: 21,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      setMapLoaded(true);

      // Add 3D buildings layer
      map.current?.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': 0.6,
        },
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [token]);

  // Update customer marker
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing marker
    customerMarker.current?.remove();

    if (customerLocation) {
      // Create pulsing marker element
      const el = document.createElement('div');
      el.className = 'customer-marker';
      el.innerHTML = `
        <div class="relative">
          <div class="absolute -inset-3 bg-primary/30 rounded-full animate-ping"></div>
          <div class="relative w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
            </svg>
          </div>
          ${customerLocation.label ? `<div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-background/90 px-2 py-0.5 rounded text-xs font-medium shadow">${customerLocation.label}</div>` : ''}
        </div>
      `;

      customerMarker.current = new mapboxgl.Marker({ element: el })
        .setLngLat([customerLocation.lng, customerLocation.lat])
        .addTo(map.current);

      // Fly to customer location when delivering
      if (isDelivering) {
        map.current.flyTo({
          center: [customerLocation.lng, customerLocation.lat],
          zoom: 19.5,
          pitch: 60,
          bearing: 0,
          duration: 1500,
        });
      }
    }
  }, [customerLocation, mapLoaded, isDelivering]);

  // Update courier marker
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    courierMarker.current?.remove();

    if (courierLocation) {
      const el = document.createElement('div');
      el.className = 'courier-marker';
      el.innerHTML = `
        <div class="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
      `;

      courierMarker.current = new mapboxgl.Marker({ element: el })
        .setLngLat([courierLocation.lng, courierLocation.lat])
        .addTo(map.current);
    }
  }, [courierLocation, mapLoaded]);

  // Update focus area
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const focusConfig = getFocusCoordinates();
    map.current.flyTo({
      center: [focusConfig.center.lng, focusConfig.center.lat],
      zoom: focusConfig.zoom,
      duration: 1000,
    });
  }, [focusArea, mapLoaded]);

  if (tokenLoading) {
    return (
      <div className="relative w-full h-full min-h-[300px] bg-muted rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-sm">Loading map...</span>
        </div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div className="relative w-full h-full min-h-[300px] bg-muted rounded-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-destructive">
          <MapPin className="w-8 h-8" />
          <span className="text-sm">Failed to load map</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[300px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map overlay with destination info */}
      {destination && (
        <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm font-medium">{destination}</span>
            </div>
            {onNavigateClick && (
              <Button size="sm" onClick={onNavigateClick} className="gap-1.5">
                <Navigation className="w-4 h-4" />
                Navigate
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Loading overlay while map initializes */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};

export default ResortMap;
