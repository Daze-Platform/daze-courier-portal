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
const DEFAULT_CENTER = { lng: -85.83367, lat: 30.19191 };
const DEFAULT_BOUNDS: [[number, number], [number, number]] = [
  [-85.8360, 30.1900],
  [-85.8310, 30.1940],
];

// Digital Twin color palette - clean architectural style
const AMENITY_FILL_COLORS: Record<string, string> = {
  pool: '#0ea5e9',        // Sky blue for water
  lounger: '#94a3b8',     // Slate for seating
  umbrella: '#f8fafc',    // White for umbrellas
  cabana: '#e2e8f0',      // Light gray for structures
  bar: '#f97316',         // Orange for bars
  beach_zone: '#fef3c7',  // Sandy beige
  walkway: '#d1d5db',     // Gray paths
  entrance: '#a78bfa',    // Violet for entrances
  restroom: '#6b7280',    // Neutral gray
};

// Marker icon colors (more vibrant for visibility)
const MARKER_COLORS: Record<string, string> = {
  lounger: '#3b82f6',
  umbrella: '#f59e0b',
  cabana: '#8b5cf6',
  bar: '#ef4444',
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

  // Get map center and bounds from resort data - force Mapbox Standard for digital twin
  const mapConfig = useMemo(() => {
    if (resort) {
      return {
        center: { lng: resort.center_lng, lat: resort.center_lat },
        bounds: resort.bounds as number[] | null,
        defaultZoom: resort.default_zoom,
        minZoom: resort.min_zoom,
        maxZoom: resort.max_zoom,
        // Force Mapbox Standard style for digital twin look
        style: 'mapbox://styles/mapbox/standard',
      };
    }
    return {
      center: DEFAULT_CENTER,
      bounds: null,
      defaultZoom: 18,
      minZoom: 16,
      maxZoom: 21,
      style: 'mapbox://styles/mapbox/standard',
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

  // Initialize map with Mapbox Standard style
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
      pitch: 55,
      bearing: -20,
      maxBounds: boundsConfig,
      minZoom: mapConfig.minZoom,
      maxZoom: mapConfig.maxZoom,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    map.current.on('style.load', () => {
      if (!map.current) return;

      // Configure Mapbox Standard style for digital twin appearance
      // Set light preset for consistent daylight appearance
      map.current.setConfigProperty('basemap', 'lightPreset', 'day');
      
      // Enable 3D buildings
      map.current.setConfigProperty('basemap', 'show3dObjects', true);
      
      // Optionally hide POI labels for cleaner look
      map.current.setConfigProperty('basemap', 'showPointOfInterestLabels', false);
      map.current.setConfigProperty('basemap', 'showTransitLabels', false);

      setMapLoaded(true);
      
      // Add custom resort amenity layers after style loads
      addAmenityLayers();
    });

    return () => {
      map.current?.remove();
    };
  }, [token, mapConfig]);

  // Add GeoJSON layers for resort amenities
  const addAmenityLayers = () => {
    if (!map.current) return;

    // Create GeoJSON for pool areas
    const poolAmenities = amenities.filter(a => a.type === 'pool');
    if (poolAmenities.length > 0) {
      const poolFeatures = poolAmenities
        .filter(a => a.geometry?.type === 'Polygon')
        .map(a => ({
          type: 'Feature' as const,
          properties: { label: a.label, type: a.type },
          geometry: a.geometry,
        }));

      if (poolFeatures.length > 0 && !map.current.getSource('pool-areas')) {
        map.current.addSource('pool-areas', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: poolFeatures },
        });

        map.current.addLayer({
          id: 'pool-fill',
          type: 'fill',
          source: 'pool-areas',
          paint: {
            'fill-color': AMENITY_FILL_COLORS.pool,
            'fill-opacity': 0.7,
          },
        });

        map.current.addLayer({
          id: 'pool-outline',
          type: 'line',
          source: 'pool-areas',
          paint: {
            'line-color': '#0284c7',
            'line-width': 2,
          },
        });
      }
    }

    // Create GeoJSON for beach zones
    const beachAmenities = amenities.filter(a => a.type === 'beach_zone');
    if (beachAmenities.length > 0) {
      const beachFeatures = beachAmenities
        .filter(a => a.geometry?.type === 'Polygon')
        .map(a => ({
          type: 'Feature' as const,
          properties: { label: a.label, type: a.type },
          geometry: a.geometry,
        }));

      if (beachFeatures.length > 0 && !map.current.getSource('beach-areas')) {
        map.current.addSource('beach-areas', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: beachFeatures },
        });

        map.current.addLayer({
          id: 'beach-fill',
          type: 'fill',
          source: 'beach-areas',
          paint: {
            'fill-color': AMENITY_FILL_COLORS.beach_zone,
            'fill-opacity': 0.6,
          },
        });
      }
    }

    // Create GeoJSON for walkways
    const walkwayAmenities = amenities.filter(a => a.type === 'walkway');
    if (walkwayAmenities.length > 0) {
      const walkwayFeatures = walkwayAmenities
        .filter(a => a.geometry?.type === 'LineString')
        .map(a => ({
          type: 'Feature' as const,
          properties: { label: a.label, type: a.type },
          geometry: a.geometry,
        }));

      if (walkwayFeatures.length > 0 && !map.current.getSource('walkways')) {
        map.current.addSource('walkways', {
          type: 'geojson',
          data: { type: 'FeatureCollection', features: walkwayFeatures },
        });

        map.current.addLayer({
          id: 'walkway-line',
          type: 'line',
          source: 'walkways',
          paint: {
            'line-color': AMENITY_FILL_COLORS.walkway,
            'line-width': 4,
            'line-opacity': 0.8,
          },
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
        });
      }
    }
  };

  // Render amenity markers with refined digital twin styling
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    // Re-add GeoJSON layers if they don't exist
    addAmenityLayers();

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

    // Create refined markers for point amenities (loungers, umbrellas, bars, cabanas)
    const markerTypes = ['lounger', 'umbrella', 'bar', 'cabana'];
    filteredAmenities
      .filter(a => markerTypes.includes(a.type))
      .forEach(amenity => {
        const coords = getAmenityCoordinates(amenity);
        if (!coords) return;

        const color = MARKER_COLORS[amenity.type] || '#6b7280';
        const icon = getAmenityIcon(amenity.type);
        
        const el = document.createElement('div');
        el.className = 'amenity-marker';
        el.innerHTML = `
          <div class="group relative cursor-pointer">
            <div class="w-7 h-7 rounded-lg border-2 border-white/80 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:shadow-xl" 
                 style="background-color: ${color};">
              ${icon}
            </div>
            <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-white px-2 py-0.5 rounded text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              ${amenity.label}
            </div>
          </div>
        `;

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([coords.lng, coords.lat])
          .addTo(map.current!);
        
        markersRef.current.push(marker);
      });

    // Add delivery station markers with refined styling
    stations.forEach(station => {
      const coords = station.location.coordinates;
      
      const el = document.createElement('div');
      el.className = 'station-marker';
      el.innerHTML = `
        <div class="relative group cursor-pointer">
          <div class="absolute -inset-2 bg-orange-500/20 rounded-xl animate-pulse"></div>
          <div class="relative w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-xl border-2 border-white">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
            </svg>
          </div>
          <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-white px-2 py-1 rounded text-[10px] font-semibold shadow-lg">
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

  // Helper function to get SVG icon for amenity type
  const getAmenityIcon = (type: string): string => {
    switch (type) {
      case 'lounger':
        return `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"/>
        </svg>`;
      case 'umbrella':
        return `<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12h2a8 8 0 0116 0h2c0-5.523-4.477-10-10-10zm0 10v10h2V12h-2z"/>
        </svg>`;
      case 'bar':
        return `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
        </svg>`;
      case 'cabana':
        return `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>`;
      default:
        return `<svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4"/>
        </svg>`;
    }
  };

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
      
      {/* Refined map legend */}
      <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-xl text-xs border border-slate-200/50">
        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-2">Amenities</div>
        <div className="flex flex-wrap gap-x-3 gap-y-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: MARKER_COLORS.lounger }} />
            <span className="text-slate-700">Lounger</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: MARKER_COLORS.umbrella }} />
            <span className="text-slate-700">Umbrella</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: MARKER_COLORS.bar }} />
            <span className="text-slate-700">Bar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: AMENITY_FILL_COLORS.pool }} />
            <span className="text-slate-700">Pool</span>
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
