import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapPin, Umbrella } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BeachMapProps {
  destination?: string;
  onUmbrellaSelect?: (umbrellaId: string) => void;
  showTokenInput?: boolean;
}

const BeachMap = ({ destination, onUmbrellaSelect, showTokenInput = true }: BeachMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [tokenSubmitted, setTokenSubmitted] = useState<boolean>(false);

  // Load saved token from localStorage on component mount
  useEffect(() => {
    const savedToken = localStorage.getItem('mapbox-token');
    console.log('BeachMap: Loading saved token:', savedToken ? 'Token found' : 'No token found');
    if (savedToken) {
      setMapboxToken(savedToken);
      setTokenSubmitted(true);
      console.log('BeachMap: Initializing map with saved token');
      // Initialize map immediately if token exists
      setTimeout(() => initializeMap(savedToken), 100);
    }
  }, []);

  // Pelican Beach Resort coordinates
  const RESORT_CENTER: [number, number] = [-86.4747922, 30.3844906];

  // Beach umbrella positions based on the screenshots
  const beachUmbrellas = [
    // Front row (closest to water)
    { id: 'A1', position: [-86.4749, 30.3843] as [number, number], color: 'blue', type: 'premium' },
    { id: 'A2', position: [-86.4748, 30.3843] as [number, number], color: 'blue', type: 'premium' },
    { id: 'A3', position: [-86.4747, 30.3843] as [number, number], color: 'yellow', type: 'premium' },
    { id: 'A4', position: [-86.4746, 30.3843] as [number, number], color: 'blue', type: 'premium' },
    { id: 'A5', position: [-86.4745, 30.3843] as [number, number], color: 'blue', type: 'premium' },
    
    // Second row
    { id: 'B1', position: [-86.4749, 30.3844] as [number, number], color: 'blue', type: 'standard' },
    { id: 'B2', position: [-86.4748, 30.3844] as [number, number], color: 'blue', type: 'standard' },
    { id: 'B3', position: [-86.4747, 30.3844] as [number, number], color: 'blue', type: 'standard' },
    { id: 'B4', position: [-86.4746, 30.3844] as [number, number], color: 'yellow', type: 'standard' },
    { id: 'B5', position: [-86.4745, 30.3844] as [number, number], color: 'blue', type: 'standard' },
    
    // Third row
    { id: 'C1', position: [-86.4749, 30.3845] as [number, number], color: 'blue', type: 'standard' },
    { id: 'C2', position: [-86.4748, 30.3845] as [number, number], color: 'blue', type: 'standard' },
    { id: 'C3', position: [-86.4747, 30.3845] as [number, number], color: 'blue', type: 'standard' },
    { id: 'C4', position: [-86.4746, 30.3845] as [number, number], color: 'blue', type: 'standard' },
    { id: 'C5', position: [-86.4745, 30.3845] as [number, number], color: 'yellow', type: 'standard' },
    
    // Fourth row
    { id: 'D1', position: [-86.4749, 30.3846] as [number, number], color: 'blue', type: 'standard' },
    { id: 'D2', position: [-86.4748, 30.3846] as [number, number], color: 'blue', type: 'standard' },
    { id: 'D3', position: [-86.4747, 30.3846] as [number, number], color: 'blue', type: 'standard' },
    { id: 'D4', position: [-86.4746, 30.3846] as [number, number], color: 'blue', type: 'standard' },
    { id: 'D5', position: [-86.4745, 30.3846] as [number, number], color: 'blue', type: 'standard' },
  ];

  const handleTokenSubmit = () => {
    if (mapboxToken.trim()) {
      // Save token to localStorage for persistence
      localStorage.setItem('mapbox-token', mapboxToken.trim());
      setTokenSubmitted(true);
      initializeMap(mapboxToken.trim());
    }
  };

  const initializeMap = (token: string) => {
    if (!mapContainer.current) {
      console.log('BeachMap: Map container not ready, skipping initialization');
      return;
    }

    console.log('BeachMap: Initializing map with token');
    mapboxgl.accessToken = token;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: RESORT_CENTER,
      zoom: 18,
      pitch: 45,
      bearing: -17.6,
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Add 3D buildings
      map.current.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'height']
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            0,
            15.05,
            ['get', 'min_height']
          ],
          'fill-extrusion-opacity': 0.6
        }
      });

      // Add beach umbrellas
      beachUmbrellas.forEach((umbrella) => {
        const umbrellaElement = document.createElement('div');
        umbrellaElement.className = 'beach-umbrella-marker';
        umbrellaElement.innerHTML = `
          <div class="umbrella-container">
            <div class="umbrella-shadow"></div>
            <div class="umbrella-pole"></div>
            <div class="umbrella-top ${umbrella.color}">
              <span class="umbrella-id">${umbrella.id}</span>
            </div>
          </div>
        `;
        
        umbrellaElement.addEventListener('click', () => {
          onUmbrellaSelect?.(umbrella.id);
        });

        new mapboxgl.Marker({
          element: umbrellaElement,
          anchor: 'bottom'
        })
        .setLngLat(umbrella.position)
        .addTo(map.current!);
      });

      // Add delivery destination marker if provided
      if (destination) {
        const destinationUmbrella = beachUmbrellas.find(u => 
          destination.toLowerCase().includes(u.id.toLowerCase()) ||
          destination.toLowerCase().includes('umbrella ' + u.id.toLowerCase())
        );
        
        if (destinationUmbrella) {
          const destinationMarker = document.createElement('div');
          destinationMarker.className = 'destination-marker';
          destinationMarker.innerHTML = `
            <div class="delivery-pin">
              <div class="pin-top"></div>
              <div class="pin-bottom"></div>
              <div class="pin-pulse"></div>
            </div>
          `;
          
          new mapboxgl.Marker({
            element: destinationMarker,
            anchor: 'bottom'
          })
          .setLngLat(destinationUmbrella.position)
          .addTo(map.current!);
        }
      }
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
  };

  useEffect(() => {
    // Add custom CSS for umbrella markers
    const style = document.createElement('style');
    style.textContent = `
      .beach-umbrella-marker {
        cursor: pointer;
        transition: transform 0.2s ease;
      }
      
      .beach-umbrella-marker:hover {
        transform: scale(1.1);
      }
      
      .umbrella-container {
        position: relative;
        width: 24px;
        height: 24px;
      }
      
      .umbrella-shadow {
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 18px;
        height: 6px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        filter: blur(2px);
      }
      
      .umbrella-pole {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 2px;
        height: 12px;
        background: #8b4513;
      }
      
      .umbrella-top {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 8px;
        font-weight: bold;
        color: white;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        border: 2px solid rgba(255,255,255,0.3);
      }
      
      .umbrella-top.blue {
        background: linear-gradient(135deg, #1e40af, #3b82f6);
      }
      
      .umbrella-top.yellow {
        background: linear-gradient(135deg, #ca8a04, #eab308);
        color: #1f2937;
      }
      
      .destination-marker {
        position: relative;
      }
      
      .delivery-pin {
        position: relative;
        width: 30px;
        height: 30px;
      }
      
      .pin-top {
        width: 20px;
        height: 20px;
        background: #ef4444;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        position: absolute;
        top: 0;
        left: 5px;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      
      .pin-bottom {
        position: absolute;
        top: 15px;
        left: 12px;
        width: 6px;
        height: 6px;
        background: white;
        border-radius: 50%;
      }
      
      .pin-pulse {
        position: absolute;
        top: -5px;
        left: 0;
        width: 30px;
        height: 30px;
        border: 2px solid #ef4444;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
      
      @keyframes pulse {
        0% {
          transform: scale(0.5);
          opacity: 1;
        }
        100% {
          transform: scale(1.5);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (map.current) {
        map.current.remove();
      }
      document.head.removeChild(style);
    };
  }, []);

  if (showTokenInput && !tokenSubmitted && !localStorage.getItem('mapbox-token')) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-card rounded-lg border border-border p-6">
        <Umbrella className="h-12 w-12 text-blue-500 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">Beach Map Setup</h3>
        <p className="text-muted-foreground text-center mb-6">
          To display the interactive beach map, please enter your Mapbox public token.
          <br />
          <a 
            href="https://mapbox.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Get your token from Mapbox →
          </a>
        </p>
        <div className="flex gap-2 w-full max-w-md">
          <Input
            type="text"
            placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSI..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleTokenSubmit} disabled={!mapboxToken.trim()}>
            Load Map
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-card rounded-lg border border-border overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Beach Info Overlay */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Umbrella className="h-4 w-4 text-blue-500" />
          <span className="font-semibold text-sm">Pelican Beach Resort</span>
        </div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Standard Umbrellas</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Premium Umbrellas</span>
          </div>
        </div>
      </div>

      {destination && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">Delivery to: {destination}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeachMap;