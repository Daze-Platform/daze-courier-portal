import React, { useState, useEffect } from 'react';
import springhillFrontAerial from '@/assets/springhill-front-aerial.jpg';
import luxuryPoolDeckHD from '@/assets/luxury-pool-deck-hd.jpg';
import luxuryBeachAerial4K from '@/assets/luxury-beach-aerial-4k.jpg';
import { MapPin, Navigation, Coffee, Waves, Umbrella } from 'lucide-react';

interface ResortImageViewProps {
  destination?: string;
  isDelivering?: boolean;
  focusArea?: 'beach' | 'pool' | 'room' | null;
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

  // Function to get customer position based on delivery address
  const getCustomerPosition = (address: string) => {
    if (address.toLowerCase().includes('beach')) {
      return { x: 60, y: 70 };
    } else if (address.toLowerCase().includes('pool') || address.toLowerCase().includes('cabana')) {
      return { x: 70, y: 45 };
    } else {
      return { x: 60, y: 70 }; // default position
    }
  };

  // Define key locations on the resort (updated for front aerial view)
  const locations: LocationPoint[] = [
    // Runner starting location (inside hotel/resort area)
    { id: 'start', x: 45, y: 35, type: 'runner-start', label: 'Delivery Station', icon: Navigation },
    
    // Points of interest (keeping for positioning but won't show labels)
    { id: 'pool-bar', x: 45, y: 40, type: 'pool-bar', label: 'Pool Bar', icon: Coffee },
    { id: 'tiki-hut', x: 65, y: 55, type: 'tiki-hut', label: 'Tiki Hut', icon: Umbrella },
    { id: 'beach-hut', x: 55, y: 80, type: 'beach-hut', label: 'Beach Hut', icon: Waves },
    
    // Customer location (dynamic based on destination)
    { id: 'customer', x: getCustomerPosition(destination || '').x, y: getCustomerPosition(destination || '').y, type: 'customer', label: destination || 'Customer Location', icon: MapPin },
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
      setZoomLevel(1.2);
      setPanX(-10);
      setPanY(-15);
    } else if (focusArea === 'pool') {
      setZoomLevel(1.15);
      setPanX(-5);
      setPanY(-10);
    } else if (focusArea === 'room') {
      setZoomLevel(1.3);
      setPanX(0);
      setPanY(10);
    } else {
      setZoomLevel(1);
      setPanX(0);
      setPanY(0);
    }
  }, [focusArea]);

  // Get the appropriate image based on focus area
  const getResortImage = () => {
    if (focusArea === 'pool') {
      return luxuryPoolDeckHD;
    } else if (focusArea === 'beach') {
      return luxuryBeachAerial4K;
    } else {
      return springhillFrontAerial;
    }
  };

  const resortImage = getResortImage();

  const getLocationStyle = (type: string) => {
    switch (type) {
      case 'runner-start': return 'bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-700 text-white shadow-lg';
      case 'customer': return 'bg-gradient-to-br from-rose-500 to-red-600 border-red-700 text-white shadow-xl animate-pulse';
      case 'pool-bar': return 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-700 text-white shadow-lg';
      case 'tiki-hut': return 'bg-gradient-to-br from-orange-400 to-orange-600 border-orange-700 text-white shadow-lg';
      case 'beach-hut': return 'bg-gradient-to-br from-cyan-400 to-cyan-600 border-cyan-700 text-white shadow-lg';
      default: return 'bg-gradient-to-br from-gray-400 to-gray-600 border-gray-700 text-white shadow-lg';
    }
  };

  // Calculate runner position along path
  const startLocation = locations.find(l => l.type === 'runner-start')!;
  const customerLocation = locations.find(l => l.type === 'customer')!;
  const runnerX = startLocation.x + (customerLocation.x - startLocation.x) * (runnerProgress / 100);
  const runnerY = startLocation.y + (customerLocation.y - startLocation.y) * (runnerProgress / 100);

  return (
    <div className="relative w-full h-full">
      {/* Resort Image with Pan/Zoom */}
      <div 
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          transform: `scale(${zoomLevel}) translate(${panX}%, ${panY}%)`
        }}
      >
        <img 
          src={resortImage} 
          alt={`SpringHill Suites Panama City Beach Resort - ${focusArea === 'pool' ? 'Pool Area' : focusArea === 'beach' ? 'Beach Area' : 'Front Aerial View'}`}
          className="block w-full h-full object-cover object-center"
          style={{ 
            width: '101%', 
            height: '101%', 
            margin: '-0.5%',
            padding: 0
          }}
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

      {/* Location Markers - Only show runner and customer */}
      <div className="absolute inset-0">
        {locations.map((location) => {
          const IconComponent = location.icon;
          const isCustomer = location.type === 'customer';
          const isRunner = location.type === 'runner-start';
          
          // Only show customer and runner start positions
          if (!isCustomer && !isRunner) return null;
          
          return (
            <div key={location.id}>
              {/* Enhanced marker with glow effect */}
              <div
                className={`absolute ${isCustomer ? 'w-10 h-10' : 'w-8 h-8'} rounded-full border-2 flex items-center justify-center ${
                  getLocationStyle(location.type)
                } transition-all duration-300 hover:scale-110`}
                style={{
                  left: `${location.x}%`,
                  top: `${location.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                title={location.label}
              >
                <IconComponent size={isCustomer ? 20 : 16} />
                {/* Glow effect for customer */}
                {isCustomer && (
                  <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-30" />
                )}
              </div>
              {/* Location label for customer only */}
              {isCustomer && destination && (
                <div 
                  className="absolute bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium shadow-lg border"
                  style={{
                    left: `${location.x}%`,
                    top: `${location.y + 8}%`,
                    transform: 'translate(-50%, 0)'
                  }}
                >
                  {destination}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Enhanced Moving Runner Indicator */}
      {isDelivering && runnerProgress > 0 && (
        <div
          className="absolute transition-all duration-500 ease-out"
          style={{
            left: `${runnerX}%`,
            top: `${runnerY}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Main runner icon */}
          <div className="relative w-10 h-10 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 border-3 border-orange-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
            <Navigation size={18} className="text-orange-900 font-bold" />
            {/* Outer pulse ring */}
            <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-40" />
            {/* Inner glow */}
            <div className="absolute inset-1 bg-yellow-300 rounded-full animate-pulse opacity-60" />
          </div>
          {/* Movement trail */}
          <div className="absolute -top-1 -left-1 w-12 h-12 border-2 border-yellow-400 rounded-full animate-spin opacity-30" />
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
    </div>
  );
};

export default ResortImageView;