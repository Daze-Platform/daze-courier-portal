import React, { useEffect, useRef, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from '@/hooks/use-mapbox-token';
import { 
  useDefaultResort, 
  useResortAmenities, 
  useDeliveryStations,
  parseDeliveryAddress,
  getAmenityCoordinates,
  type ResortAmenity,
  type DeliveryStation,
} from '@/hooks/use-resort-data';
import { Loader2, MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ResortMapProps {
  destination?: string;
  isDelivering?: boolean;
  focusArea?: 'pool' | 'beach' | 'overview';
  customerLocation?: { lng: number; lat: number; label?: string };
  courierLocation?: { lng: number; lat: number };
  onNavigateClick?: () => void;
  resortId?: string;
}

// Fallback coordinates if no resort data
const DEFAULT_CENTER = { lng: -85.8019, lat: 30.1766 };
const DEFAULT_BOUNDS: [[number, number], [number, number]] = [
  [-85.8035, 30.1755],
  [-85.8000, 30.1780],
];

// Amenity type to color mapping
const AMENITY_COLORS: Record<string, string> = {
  lounger: '#3b82f6', // blue
  umbrella: '#f59e0b', // amber
  cabana: '#8b5cf6', // violet
  pool: '#06b6d4', // cyan
  bar: '#ef4444', // red
  beach_zone: '#22c55e', // green
  walkway: '#6b7280', // gray
  entrance: '#ec4899', // pink
  restroom: '#64748b', // slate
};

const ResortMap: React.FC<ResortMapProps> = ({
  destination,
  isDelivering = false,
  focusArea = 'overview',
  customerLocation: customerLocationProp,
  courierLocation,
  onNavigateClick,
  resortId,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const customerMarker = useRef<mapboxgl.Marker | null>(null);
  const courierMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Fetch map token
  const { token, loading: tokenLoading, error: tokenError } = useMapboxToken();

  // Fetch resort data
  const { data: resort, isLoading: resortLoading } = useDefaultResort();
  const effectiveResortId = resortId || resort?.id;
  
  const { data: amenities = [] } = useResortAmenities(effectiveResortId);
  const { data: stations = [] } = useDeliveryStations(effectiveResortId, {
    servesArea: focusArea === 'beach' ? 'beach' : focusArea === 'pool' ? 'pool' : undefined,
  });

  // Derive customer location from destination and amenities
  const customerLocation = useMemo(() => {
    if (customerLocationProp) return customerLocationProp;
    
    if (destination && amenities.length > 0) {
      const { amenity } = parseDeliveryAddress(destination, amenities);
      if (amenity) {
        const coords = getAmenityCoordinates(amenity);
        if (coords) {
          return { ...coords, label: destination };
        }
      }
    }
    
    return null;
  }, [customerLocationProp, destination, amenities]);

  // Get map center and bounds from resort data
  const mapConfig = useMemo(() => {
    if (resort) {
      return {
        center: { lng: resort.center_lng, lat: resort.center_lat },
        bounds: resort.bounds as number[] | null,
        defaultZoom: resort.default_zoom,
        minZoom: resort.min_zoom,
        maxZoom: resort.max_zoom,
        style: resort.map_style,
      };
    }
    return {
      center: DEFAULT_CENTER,
      bounds: null,
      defaultZoom: 17.5,
      minZoom: 16,
      maxZoom: 21,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
    };
  }, [resort]);

  // Get focus coordinates based on area
  const getFocusCoordinates = () => {
    // Try to find a relevant amenity for the focus area
    if (focusArea === 'pool') {
      const poolAmenity = amenities.find(a => a.type === 'pool');
      if (poolAmenity) {
        const coords = getAmenityCoordinates(poolAmenity);
        if (coords) return { center: coords, zoom: 19 };
      }
    } else if (focusArea === 'beach') {
      const beachZone = amenities.find(a => a.type === 'beach_zone');
      if (beachZone) {
        const coords = getAmenityCoordinates(beachZone);
        if (coords) return { center: coords, zoom: 19 };
      }
    }
    
    return { center: mapConfig.center, zoom: mapConfig.defaultZoom };
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !token) return;

    mapboxgl.accessToken = token;

    const focusConfig = getFocusCoordinates();
    const boundsConfig = mapConfig.bounds 
      ? [[mapConfig.bounds[0], mapConfig.bounds[1]], [mapConfig.bounds[2], mapConfig.bounds[3]]] as [[number, number], [number, number]]
      : DEFAULT_BOUNDS;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapConfig.style,
      center: [focusConfig.center.lng, focusConfig.center.lat],
      zoom: focusConfig.zoom,
      pitch: 45,
      bearing: -17.6,
      maxBounds: boundsConfig,
      minZoom: mapConfig.minZoom,
      maxZoom: mapConfig.maxZoom,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
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
  }, [token, mapConfig]);

  // Render amenity markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Filter amenities based on focus area
    const filteredAmenities = amenities.filter(a => {
      if (focusArea === 'pool') {
        return a.section?.toLowerCase().includes('pool') || a.type === 'pool' || a.type === 'bar';
      }
      if (focusArea === 'beach') {
        return a.section?.toLowerCase().includes('beach') || a.type === 'beach_zone';
      }
      return true;
    });

    // Create markers for amenities (only loungers, umbrellas, bars for cleaner look)
    const markerTypes = ['lounger', 'umbrella', 'bar', 'cabana'];
    filteredAmenities
      .filter(a => markerTypes.includes(a.type))
      .forEach(amenity => {
        const coords = getAmenityCoordinates(amenity);
        if (!coords) return;

        const color = AMENITY_COLORS[amenity.type] || '#6b7280';
        
        const el = document.createElement('div');
        el.className = 'amenity-marker';
        el.innerHTML = `
          <div class="w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center text-[8px] font-bold text-white cursor-pointer transition-transform hover:scale-125" 
               style="background-color: ${color};" 
               title="${amenity.label}">
            ${amenity.label.replace(/[^A-Z0-9]/gi, '').slice(0, 2)}
          </div>
        `;

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([coords.lng, coords.lat])
          .addTo(map.current!);
        
        markersRef.current.push(marker);
      });

    // Add delivery station markers
    stations.forEach(station => {
      const coords = station.location.coordinates;
      
      const el = document.createElement('div');
      el.className = 'station-marker';
      el.innerHTML = `
        <div class="relative">
          <div class="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-lg border-2 border-white">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l-4.463 2.346.853-4.973L1.78 5.854l4.99-.726L9 .5l2.23 4.628 4.99.726-3.61 3.519.853 4.973z"/>
            </svg>
          </div>
          <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-accent text-white px-1.5 py-0.5 rounded text-[10px] font-medium shadow">
            ${station.name}
          </div>
        </div>
      `;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([coords[0], coords[1]])
        .addTo(map.current!);
      
      markersRef.current.push(marker);
    });
  }, [amenities, stations, mapLoaded, focusArea]);

  // Update customer marker
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    customerMarker.current?.remove();

    if (customerLocation) {
      const el = document.createElement('div');
      el.className = 'customer-marker';
      el.innerHTML = `
        <div class="relative">
          <div class="absolute -inset-3 bg-primary/30 rounded-full animate-ping"></div>
          <div class="relative w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
            </svg>
          </div>
          ${customerLocation.label ? `<div class="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-white px-2 py-1 rounded text-xs font-medium shadow-lg">${customerLocation.label}</div>` : ''}
        </div>
      `;

      customerMarker.current = new mapboxgl.Marker({ element: el })
        .setLngLat([customerLocation.lng, customerLocation.lat])
        .addTo(map.current);

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
  }, [focusArea, mapLoaded, amenities]);

  const isLoading = tokenLoading || resortLoading;

  if (isLoading) {
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
      
      {/* Map legend */}
      <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 shadow-lg text-xs">
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: AMENITY_COLORS.lounger }} />
            <span>Lounger</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: AMENITY_COLORS.umbrella }} />
            <span>Umbrella</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: AMENITY_COLORS.bar }} />
            <span>Bar</span>
          </div>
        </div>
      </div>
      
      {/* Destination info overlay */}
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
