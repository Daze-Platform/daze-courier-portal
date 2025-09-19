import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Umbrella, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapboxThreeLayer } from './MapboxThreeLayer';

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
  const [selectedUmbrella, setSelectedUmbrella] = useState<string | undefined>();
  const courierMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const destinationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const threeLayerRef = useRef<MapboxThreeLayer | null>(null);

  // SpringHill Suites Panama City Beach coordinates
  const resortCenter: [number, number] = [-85.8764, 30.1766];

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
          map.current.setConfigProperty('basemap', 'lightPreset', 'day');
          map.current.setConfigProperty('basemap', 'show3dObjects', true);
          
          // Add custom 3D SpringHill hotel layer
          const handleUmbrellaClick = (umbrellaId: string) => {
            setSelectedUmbrella(umbrellaId);
            onUmbrellaSelect?.(umbrellaId);
          };

          threeLayerRef.current = new MapboxThreeLayer({
            id: 'springhill-3d',
            onUmbrellaClick: handleUmbrellaClick,
            selectedUmbrella: selectedUmbrella
          });

          map.current.addLayer(threeLayerRef.current);

          // Add destination marker if specified
          if (destination) {
            const destEl = document.createElement('div');
            destEl.innerHTML = `
              <div class="destination-marker bg-red-500 w-10 h-10 rounded-full border-3 border-white shadow-xl flex items-center justify-center animate-bounce">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
              </div>
            `;
            
            destinationMarkerRef.current = new mapboxgl.Marker(destEl)
              .setLngLat(resortCenter)
              .addTo(map.current!);
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
          <span className="font-semibold text-sm">SpringHill Suites</span>
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
            <div className="w-3 h-3 bg-blue-200 rounded"></div>
            <span>Hotel Building</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded"></div>
            <span>Swimming Pool</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-600 rounded"></div>
            <span>Beach Area</span>
          </div>
          {selectedUmbrella && (
            <div className="mt-2 pt-2 border-t">
              <div className="font-medium text-blue-600">
                Selected: {selectedUmbrella}
              </div>
            </div>
          )}
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