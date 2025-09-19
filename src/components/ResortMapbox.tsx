import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Umbrella, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface ResortMapboxProps {
  destination?: string;
  onUmbrellaSelect?: (umbrellaId: string) => void;
  showTokenInput?: boolean;
  courierPosition?: { lat: number; lng: number };
}

const ResortMapbox: React.FC<ResortMapboxProps> = ({ 
  destination, 
  onUmbrellaSelect, 
  showTokenInput = false,
  courierPosition 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [tokenSaved, setTokenSaved] = useState(false);
  const courierMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null);

  // Resort location coordinates (example: Four Seasons Resort in Naples, FL)
  const resortCenter: [number, number] = [-81.8081, 26.2347];
  
  // Resort building GeoJSON
  const resortBuilding = {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: { type: 'main-building', name: 'Pelican Beach Resort' },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[
            [-81.8088, 26.2352],
            [-81.8076, 26.2352],
            [-81.8076, 26.2340],
            [-81.8088, 26.2340],
            [-81.8088, 26.2352]
          ]]
        }
      }
    ]
  };

  // Pool deck GeoJSON
  const poolDeck = {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: { type: 'pool', name: 'Main Pool' },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[
            [-81.8084, 26.2348],
            [-81.8078, 26.2348],
            [-81.8078, 26.2344],
            [-81.8084, 26.2344],
            [-81.8084, 26.2348]
          ]]
        }
      },
      {
        type: 'Feature' as const,
        properties: { type: 'pool-deck', name: 'Pool Deck' },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[
            [-81.8086, 26.2350],
            [-81.8076, 26.2350],
            [-81.8076, 26.2342],
            [-81.8086, 26.2342],
            [-81.8086, 26.2350]
          ]]
        }
      }
    ]
  };

  // Beach area GeoJSON
  const beachArea = {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: { type: 'beach', name: 'Private Beach' },
        geometry: {
          type: 'Polygon' as const,
          coordinates: [[
            [-81.8090, 26.2355],
            [-81.8074, 26.2355],
            [-81.8074, 26.2340],
            [-81.8090, 26.2340],
            [-81.8090, 26.2355]
          ]]
        }
      }
    ]
  };

  // Beach umbrella locations
  const beachUmbrellas = {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: { id: 'A1', type: 'standard', area: 'beach' },
        geometry: { type: 'Point' as const, coordinates: [-81.8085, 26.2350] }
      },
      {
        type: 'Feature' as const,
        properties: { id: 'A2', type: 'premium', area: 'beach' },
        geometry: { type: 'Point' as const, coordinates: [-81.8083, 26.2349] }
      },
      {
        type: 'Feature' as const,
        properties: { id: 'A3', type: 'standard', area: 'beach' },
        geometry: { type: 'Point' as const, coordinates: [-81.8081, 26.2348] }
      }
    ]
  };

  // Pool umbrellas locations
  const poolUmbrellas = {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        properties: { id: 'P1', type: 'premium', area: 'pool' },
        geometry: { type: 'Point' as const, coordinates: [-81.8082, 26.2347] }
      },
      {
        type: 'Feature' as const,
        properties: { id: 'P2', type: 'standard', area: 'pool' },
        geometry: { type: 'Point' as const, coordinates: [-81.8080, 26.2346] }
      },
      {
        type: 'Feature' as const,
        properties: { id: 'P3', type: 'premium', area: 'pool' },
        geometry: { type: 'Point' as const, coordinates: [-81.8078, 26.2345] }
      }
    ]
  };

  // Load token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox-token');
    if (savedToken) {
      setMapboxToken(savedToken);
      setTokenSaved(true);
    }
  }, []);

  // Initialize map when token is available
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !tokenSaved) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/standard',
        center: resortCenter,
        zoom: 18,
        pitch: 45,
        bearing: 0,
        antialias: true
      });

      map.current.on('load', () => {
        if (!map.current) return;

        // Configure Standard style for resort view
        map.current.setConfigProperty('basemap', 'lightPreset', 'dusk');
        map.current.setConfigProperty('basemap', 'show3dObjects', true);
        
        // Add resort building source and layer
        map.current.addSource('resort-building', {
          type: 'geojson',
          data: resortBuilding
        });
        
        map.current.addLayer({
          id: 'resort-building-layer',
          type: 'fill',
          source: 'resort-building',
          paint: {
            'fill-color': '#8B4513',
            'fill-opacity': 0.8,
            'fill-outline-color': '#654321'
          }
        });

        // Add beach area source and layer
        map.current.addSource('beach-area', {
          type: 'geojson',
          data: beachArea
        });
        
        map.current.addLayer({
          id: 'beach-area-layer',
          type: 'fill',
          source: 'beach-area',
          paint: {
            'fill-color': '#F4A460',
            'fill-opacity': 0.6
          }
        });

        // Add pool deck source and layers
        map.current.addSource('pool-deck', {
          type: 'geojson',
          data: poolDeck
        });
        
        map.current.addLayer({
          id: 'pool-deck-layer',
          type: 'fill',
          source: 'pool-deck',
          filter: ['==', 'type', 'pool-deck'],
          paint: {
            'fill-color': '#D2B48C',
            'fill-opacity': 0.7
          }
        });
        
        map.current.addLayer({
          id: 'pool-layer',
          type: 'fill',
          source: 'pool-deck',
          filter: ['==', 'type', 'pool'],
          paint: {
            'fill-color': '#4169E1',
            'fill-opacity': 0.8
          }
        });

        // Add beach umbrella sources and layers
        map.current.addSource('beach-umbrellas', {
          type: 'geojson',
          data: beachUmbrellas
        });
        
        map.current.addLayer({
          id: 'beach-umbrellas-layer',
          type: 'circle',
          source: 'beach-umbrellas',
          paint: {
            'circle-radius': [
              'case',
              ['==', ['get', 'type'], 'premium'], 8,
              6
            ],
            'circle-color': [
              'case',
              ['==', ['get', 'type'], 'premium'], '#FF6B35',
              '#4A90E2'
            ],
            'circle-stroke-color': '#FFFFFF',
            'circle-stroke-width': 2
          }
        });

        // Add pool umbrella sources and layers
        map.current.addSource('pool-umbrellas', {
          type: 'geojson',
          data: poolUmbrellas
        });
        
        map.current.addLayer({
          id: 'pool-umbrellas-layer',
          type: 'circle',
          source: 'pool-umbrellas',
          paint: {
            'circle-radius': [
              'case',
              ['==', ['get', 'type'], 'premium'], 8,
              6
            ],
            'circle-color': [
              'case',
              ['==', ['get', 'type'], 'premium'], '#FF6B35',
              '#4A90E2'
            ],
            'circle-stroke-color': '#FFFFFF',
            'circle-stroke-width': 2
          }
        });

        // Add click handlers for umbrellas
        map.current.on('click', 'beach-umbrellas-layer', (e) => {
          if (e.features && e.features[0]) {
            const umbrellaId = e.features[0].properties?.id;
            if (umbrellaId) {
              onUmbrellaSelect?.(umbrellaId);
            }
          }
        });

        map.current.on('click', 'pool-umbrellas-layer', (e) => {
          if (e.features && e.features[0]) {
            const umbrellaId = e.features[0].properties?.id;
            if (umbrellaId) {
              onUmbrellaSelect?.(umbrellaId);
            }
          }
        });

        // Change cursor on hover
        map.current.on('mouseenter', 'beach-umbrellas-layer', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        
        map.current.on('mouseleave', 'beach-umbrellas-layer', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });

        map.current.on('mouseenter', 'pool-umbrellas-layer', () => {
          if (map.current) map.current.getCanvas().style.cursor = 'pointer';
        });
        
        map.current.on('mouseleave', 'pool-umbrellas-layer', () => {
          if (map.current) map.current.getCanvas().style.cursor = '';
        });

        // Add destination marker if specified
        if (destination) {
          // Check both beach and pool umbrellas for destination
          const allUmbrellas = [
            ...beachUmbrellas.features,
            ...poolUmbrellas.features
          ];
          
          const destUmbrella = allUmbrellas.find(u => 
            destination.includes(u.properties?.id || '') || 
            destination.toLowerCase().includes('beach') ||
            destination.toLowerCase().includes('pool')
          );
          
          if (destUmbrella) {
            const destEl = document.createElement('div');
            destEl.innerHTML = `
              <div class="destination-marker bg-red-500 w-10 h-10 rounded-full border-3 border-white shadow-xl flex items-center justify-center animate-bounce">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
              </div>
            `;
            
            destinationMarkerRef.current = new mapboxgl.Marker(destEl)
              .setLngLat(destUmbrella.geometry.coordinates as [number, number])
              .addTo(map.current!);
          }
        }
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add scale control
      map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

    } catch (error) {
      console.error('Error initializing Mapbox:', error);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, tokenSaved, destination]);

  // Update courier position
  useEffect(() => {
    if (!map.current || !courierPosition) return;

    if (courierMarkerRef.current) {
      courierMarkerRef.current.setLngLat([courierPosition.lng, courierPosition.lat]);
    } else {
      const courierEl = document.createElement('div');
      courierEl.innerHTML = `
        <div class="courier-marker bg-blue-600 w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
          </svg>
        </div>
        <div class="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-30"></div>
      `;
      
      courierMarkerRef.current = new mapboxgl.Marker(courierEl)
        .setLngLat([courierPosition.lng, courierPosition.lat])
        .addTo(map.current!);
    }
  }, [courierPosition]);

  const handleTokenSave = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox-token', mapboxToken.trim());
      setTokenSaved(true);
    }
  };

  const handleTokenChange = () => {
    setTokenSaved(false);
    localStorage.removeItem('mapbox-token');
  };

  // Show token input if no token is saved and showTokenInput is true
  if (showTokenInput && !tokenSaved) {
    return (
      <div className="flex items-center justify-center h-full bg-muted/20">
        <Card className="p-6 max-w-md mx-4">
          <div className="text-center mb-4">
            <Settings className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <h3 className="font-semibold text-lg mb-2">Setup Required</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your Mapbox public token to view the resort map
            </p>
          </div>
          
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSI..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              className="font-mono text-xs"
            />
            <Button 
              onClick={handleTokenSave}
              disabled={!mapboxToken.trim()}
              className="w-full"
            >
              Save Token
            </Button>
          </div>
          
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Get your token at{' '}
            <a 
              href="https://account.mapbox.com/access-tokens/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              mapbox.com
            </a>
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Resort info overlay */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <Umbrella className="h-4 w-4 text-blue-500" />
          <span className="font-semibold text-sm">Pelican Beach Resort</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Standard Loungers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Premium Loungers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-600 rounded"></div>
            <span>Resort Building</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span>Swimming Pool</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-600 rounded"></div>
            <span>Beach Area</span>
          </div>
        </div>
      </div>

      {/* Destination info */}
      {destination && (
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">Delivery to: {destination}</span>
          </div>
        </div>
      )}

      {/* Token management button */}
      {tokenSaved && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleTokenChange}
          className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm"
        >
          <Settings className="h-4 w-4" />
        </Button>
      )}

      {/* Map instructions */}
      <div className="absolute bottom-4 right-4 text-xs text-white/70 bg-black/50 rounded px-2 py-1">
        Click loungers to select • Drag to pan • Scroll to zoom
      </div>
    </div>
  );
};

export default ResortMapbox;