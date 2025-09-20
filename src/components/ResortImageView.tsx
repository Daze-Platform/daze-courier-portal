import React, { useState, useEffect } from 'react';
import springhillFrontAerial from '@/assets/springhill-front-aerial.jpg';
import { MapPin, Navigation, Coffee, Waves, Umbrella } from 'lucide-react';

interface ResortImageViewProps {
  destination?: string;
  isDelivering?: boolean;
  focusArea?: 'beach' | 'pool' | 'hotel' | null;
}

interface LocationPoint {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  type: 'runner-start' | 'customer' | 'pool-bar' | 'tiki-hut' | 'beach-hut';
  label: string;
  icon: React.ComponentType<any>;
}

const ResortImageView: React.FC<ResortImageViewProps> = ({ 
  destination, 
  isDelivering = false,
  focusArea = null
}) => {
  const [runnerProgress, setRunnerProgress] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  // Define key locations on the resort (updated for front aerial view)
  const locations: LocationPoint[] = [
    // Runner starting location (hotel entrance/lobby)
    { id: 'start', x: 50, y: 15, type: 'runner-start', label: 'Delivery Station', icon: Navigation },
    
    // Points of interest
    { id: 'pool-bar', x: 45, y: 40, type: 'pool-bar', label: 'Pool Bar', icon: Coffee },
    { id: 'tiki-hut', x: 65, y: 55, type: 'tiki-hut', label: 'Tiki Hut', icon: Umbrella },
    { id: 'beach-hut', x: 55, y: 80, type: 'beach-hut', label: 'Beach Hut', icon: Waves },
    
    // Customer location (dynamic based on destination)
    { id: 'customer', x: 60, y: 70, type: 'customer', label: destination || 'Customer Location', icon: MapPin },
  ];

  // Animation for runner movement
  useEffect(() => {
    if (isDelivering) {
      const interval = setInterval(() => {
        setRunnerProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 100);

      return () => clearInterval(interval);
    } else {
      setRunnerProgress(0);
    }
  }, [isDelivering]);

  // Pan and zoom effect based on focus area
  useEffect(() => {
    if (focusArea === 'beach') {
      setZoomLevel(1.5);
      setPanX(-20);
      setPanY(-30);
    } else if (focusArea === 'pool') {
      setZoomLevel(1.3);
      setPanX(-10);
      setPanY(-15);
    } else {
      setZoomLevel(1);
      setPanX(0);
      setPanY(0);
    }
  }, [focusArea]);

  const getLocationStyle = (type: string) => {
    switch (type) {
      case 'runner-start': return 'bg-green-500 border-green-600 text-white';
      case 'customer': return 'bg-red-500 border-red-600 text-white';
      case 'pool-bar': return 'bg-blue-500 border-blue-600 text-white';
      case 'tiki-hut': return 'bg-orange-500 border-orange-600 text-white';
      case 'beach-hut': return 'bg-cyan-500 border-cyan-600 text-white';
      default: return 'bg-gray-500 border-gray-600 text-white';
    }
  };

  // Calculate runner position along path
  const startLocation = locations.find(l => l.type === 'runner-start')!;
  const customerLocation = locations.find(l => l.type === 'customer')!;
  const runnerX = startLocation.x + (customerLocation.x - startLocation.x) * (runnerProgress / 100);
  const runnerY = startLocation.y + (customerLocation.y - startLocation.y) * (runnerProgress / 100);

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Resort Image with Pan/Zoom */}
      <div 
        className="w-full h-full transition-all duration-1000 ease-out"
        style={{
          transform: `scale(${zoomLevel}) translate(${panX}%, ${panY}%)`
        }}
      >
        <img 
          src={springhillFrontAerial} 
          alt="SpringHill Suites Panama City Beach Resort - Front Aerial View"
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Delivery Route Path */}
      {isDelivering && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <line
            x1={`${startLocation.x}%`}
            y1={`${startLocation.y}%`}
            x2={`${customerLocation.x}%`}
            y2={`${customerLocation.y}%`}
            stroke="rgba(59, 130, 246, 0.6)"
            strokeWidth="3"
            strokeDasharray="10,5"
            className="animate-pulse"
          />
        </svg>
      )}

      {/* Location Markers */}
      <div className="absolute inset-0">
        {locations.map((location) => {
          const IconComponent = location.icon;
          return (
            <div
              key={location.id}
              className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg ${
                getLocationStyle(location.type)
              }`}
              style={{
                left: `${location.x}%`,
                top: `${location.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              title={location.label}
            >
              <IconComponent size={16} />
            </div>
          );
        })}
      </div>

      {/* Enhanced Moving Runner Indicator */}
      {isDelivering && runnerProgress > 0 && (
        <div
          className="absolute w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-orange-600 rounded-full flex items-center justify-center shadow-xl animate-bounce transition-all duration-300"
          style={{
            left: `${runnerX}%`,
            top: `${runnerY}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Navigation size={14} className="text-orange-900" />
          {/* Runner trail effect */}
          <div className="absolute inset-0 bg-yellow-300 rounded-full animate-ping opacity-30" />
        </div>
      )}

      {/* Customer highlight when focused */}
      {focusArea === 'beach' && (
        <div
          className="absolute w-16 h-16 border-4 border-red-400 rounded-full animate-pulse"
          style={{
            left: `${customerLocation.x}%`,
            top: `${customerLocation.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}

      {/* Delivery Status */}
      {isDelivering && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900">
            {runnerProgress < 100 ? 'Delivering...' : 'Delivered!'}
          </p>
          <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-300"
              style={{ width: `${runnerProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">
            {destination && `To: ${destination}`}
          </p>
        </div>
      )}

      {/* Location Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h3 className="text-sm font-semibold mb-2">Resort Locations</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <Navigation size={12} className="text-green-500" />
            <span>Delivery Station</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Coffee size={12} className="text-blue-500" />
            <span>Pool Bar</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Umbrella size={12} className="text-orange-500" />
            <span>Tiki Hut</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Waves size={12} className="text-cyan-500" />
            <span>Beach Hut</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <MapPin size={12} className="text-red-500" />
            <span>Customer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResortImageView;