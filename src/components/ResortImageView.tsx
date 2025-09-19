import React, { useState } from 'react';
import springhillAerial3D from '@/assets/springhill-aerial-3d.jpg';

interface ResortImageViewProps {
  destination?: string;
  onUmbrellaSelect?: (umbrellaId: string) => void;
}

interface UmbrellaSpot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  type: 'pool' | 'beach' | 'lawn';
  label: string;
}

const ResortImageView: React.FC<ResortImageViewProps> = ({ 
  destination, 
  onUmbrellaSelect 
}) => {
  const [selectedUmbrella, setSelectedUmbrella] = useState<string | null>(null);

  // Define umbrella/delivery spots on the resort image
  const umbrellaSpots: UmbrellaSpot[] = [
    // Pool area spots (center of image)
    { id: 'P1', x: 45, y: 55, type: 'pool', label: 'Pool Deck P1' },
    { id: 'P2', x: 50, y: 58, type: 'pool', label: 'Pool Deck P2' },
    { id: 'P3', x: 55, y: 55, type: 'pool', label: 'Pool Deck P3' },
    { id: 'P4', x: 60, y: 60, type: 'pool', label: 'Pool Deck P4' },
    { id: 'P5', x: 42, y: 62, type: 'pool', label: 'Pool Deck P5' },
    { id: 'P6', x: 48, y: 65, type: 'pool', label: 'Pool Deck P6' },
    { id: 'P7', x: 53, y: 62, type: 'pool', label: 'Pool Deck P7' },
    { id: 'P8', x: 58, y: 68, type: 'pool', label: 'Pool Deck P8' },
    
    // Beach area spots (bottom portion of image)
    { id: 'B1', x: 25, y: 75, type: 'beach', label: 'Beach B1' },
    { id: 'B2', x: 35, y: 78, type: 'beach', label: 'Beach B2' },
    { id: 'B3', x: 45, y: 80, type: 'beach', label: 'Beach B3' },
    { id: 'B4', x: 55, y: 78, type: 'beach', label: 'Beach B4' },
    { id: 'B5', x: 65, y: 75, type: 'beach', label: 'Beach B5' },
    { id: 'B6', x: 75, y: 78, type: 'beach', label: 'Beach B6' },
    
    // Second row of beach spots
    { id: 'B7', x: 30, y: 85, type: 'beach', label: 'Beach B7' },
    { id: 'B8', x: 40, y: 88, type: 'beach', label: 'Beach B8' },
    { id: 'B9', x: 50, y: 87, type: 'beach', label: 'Beach B9' },
    { id: 'B10', x: 60, y: 85, type: 'beach', label: 'Beach B10' },
    { id: 'B11', x: 70, y: 88, type: 'beach', label: 'Beach B11' },
    
    // Lawn/deck area spots (right side)
    { id: 'L1', x: 75, y: 45, type: 'lawn', label: 'Deck Area L1' },
    { id: 'L2', x: 80, y: 50, type: 'lawn', label: 'Deck Area L2' },
    { id: 'L3', x: 85, y: 55, type: 'lawn', label: 'Deck Area L3' },
  ];

  const handleUmbrellaClick = (umbrellaId: string) => {
    setSelectedUmbrella(umbrellaId);
    onUmbrellaSelect?.(umbrellaId);
  };

  const getSpotColor = (type: string, isSelected: boolean) => {
    if (isSelected) return 'bg-yellow-400 border-yellow-600 shadow-lg shadow-yellow-400/50';
    
    switch (type) {
      case 'pool': return 'bg-blue-500 border-blue-600 hover:bg-blue-400';
      case 'beach': return 'bg-orange-500 border-orange-600 hover:bg-orange-400';
      case 'lawn': return 'bg-green-500 border-green-600 hover:bg-green-400';
      default: return 'bg-gray-500 border-gray-600 hover:bg-gray-400';
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      {/* Resort Image */}
      <img 
        src={springhillAerial3D} 
        alt="SpringHill Suites Panama City Beach Resort - Aerial 3D View"
        className="w-full h-full object-cover"
      />
      
      {/* Umbrella/Delivery Spots Overlay */}
      <div className="absolute inset-0">
        {umbrellaSpots.map((spot) => (
          <button
            key={spot.id}
            onClick={() => handleUmbrellaClick(spot.id)}
            className={`absolute w-6 h-6 rounded-full border-2 transition-all duration-300 transform hover:scale-110 ${
              getSpotColor(spot.type, selectedUmbrella === spot.id)
            }`}
            style={{
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            title={spot.label}
          >
            <span className="sr-only">{spot.label}</span>
          </button>
        ))}
      </div>

      {/* Selected Spot Info */}
      {selectedUmbrella && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-gray-900">
            Selected: {umbrellaSpots.find(s => s.id === selectedUmbrella)?.label}
          </p>
          <p className="text-xs text-gray-600">
            {destination && `Delivering to ${destination}`}
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h3 className="text-sm font-semibold mb-2">Delivery Areas</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Pool Deck</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Beach</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Lawn Area</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResortImageView;