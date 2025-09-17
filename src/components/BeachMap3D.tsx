import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Sky } from '@react-three/drei';
import { MapPin, Umbrella } from 'lucide-react';
import * as THREE from 'three';
import ResortBuilding from './3d/ResortBuilding';
import SwimmingPool from './3d/SwimmingPool';
import BeachLoungers from './3d/BeachLoungers';
import PalmTrees from './3d/PalmTrees';
import RealisticTerrain from './3d/RealisticTerrain';

interface BeachMap3DProps {
  destination?: string;
  onUmbrellaSelect?: (umbrellaId: string) => void;
  showTokenInput?: boolean;
}

// Loading component
const LoadingFallback = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#cccccc" />
  </mesh>
);

// Destination Marker Component
const DestinationMarker = ({ position, label }: { position: [number, number, number]; label: string }) => (
  <group position={position}>
    <mesh position={[0, 2, 0]}>
      <coneGeometry args={[0.4, 1.5, 8]} />
      <meshStandardMaterial color="#ef4444" />
    </mesh>
    <mesh position={[0, 0.3, 0]}>
      <sphereGeometry args={[0.3]} />
      <meshStandardMaterial color="#ef4444" />
    </mesh>
  </group>
);

const BeachMap3D: React.FC<BeachMap3DProps> = ({ destination, onUmbrellaSelect }) => {
  const [selectedUmbrella, setSelectedUmbrella] = useState<string | null>(null);

  // Beach lounger positions arranged in realistic rows
  const umbrellas = [
    // Front row - closest to ocean
    { id: 'A1', position: [-15, 0, 8] as [number, number, number], type: 'standard' as const },
    { id: 'A2', position: [-10, 0, 8] as [number, number, number], type: 'premium' as const },
    { id: 'A3', position: [-5, 0, 8] as [number, number, number], type: 'standard' as const },
    { id: 'A4', position: [0, 0, 8] as [number, number, number], type: 'premium' as const },
    { id: 'A5', position: [5, 0, 8] as [number, number, number], type: 'standard' as const },
    { id: 'A6', position: [10, 0, 8] as [number, number, number], type: 'premium' as const },
    { id: 'A7', position: [15, 0, 8] as [number, number, number], type: 'standard' as const },
    
    // Second row
    { id: 'B1', position: [-12, 0, 3] as [number, number, number], type: 'premium' as const },
    { id: 'B2', position: [-6, 0, 3] as [number, number, number], type: 'standard' as const },
    { id: 'B3', position: [0, 0, 3] as [number, number, number], type: 'premium' as const },
    { id: 'B4', position: [6, 0, 3] as [number, number, number], type: 'standard' as const },
    { id: 'B5', position: [12, 0, 3] as [number, number, number], type: 'premium' as const },
    
    // Third row - near pool area
    { id: 'C1', position: [-8, 0, -2] as [number, number, number], type: 'standard' as const },
    { id: 'C2', position: [-3, 0, -2] as [number, number, number], type: 'premium' as const },
    { id: 'C3', position: [3, 0, -2] as [number, number, number], type: 'standard' as const },
    { id: 'C4', position: [8, 0, -2] as [number, number, number], type: 'premium' as const },
  ];

  const handleUmbrellaSelect = (umbrellaId: string) => {
    setSelectedUmbrella(umbrellaId);
    onUmbrellaSelect?.(umbrellaId);
  };

  // Find destination umbrella position
  const destinationUmbrella = destination ? umbrellas.find(u => u.id === destination.replace('Beach - Umbrella ', '')) : null;

  useEffect(() => {
    if (destination) {
      const umbrellaId = destination.replace('Beach - Umbrella ', '');
      setSelectedUmbrella(umbrellaId);
    }
  }, [destination]);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-200 to-blue-400">
      <Canvas
        camera={{ 
          position: [30, 25, 40], 
          fov: 50 
        }}
        shadows={{
          enabled: true,
          type: THREE.PCFSoftShadowMap
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          {/* Enhanced Lighting for CAD-like rendering */}
          <ambientLight intensity={0.3} />
          <directionalLight
            position={[50, 50, 25]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={4096}
            shadow-mapSize-height={4096}
            shadow-camera-far={100}
            shadow-camera-left={-50}
            shadow-camera-right={50}
            shadow-camera-top={50}
            shadow-camera-bottom={-50}
          />
          <hemisphereLight 
            args={["#87CEEB", "#F4E4BC", 0.4]} 
          />

          {/* Environment and Sky */}
          <Sky 
            sunPosition={[100, 20, 100]}
            turbidity={0.1}
            rayleigh={0.5}
          />
          <Environment preset="sunset" />

          {/* Scene Components */}
          <RealisticTerrain />
          <ResortBuilding />
          <SwimmingPool />
          <PalmTrees />

          {/* Beach Loungers */}
          {umbrellas.map((umbrella) => (
            <BeachLoungers
              key={umbrella.id}
              umbrellaId={umbrella.id}
              position={umbrella.position}
              type={umbrella.type}
              onSelect={handleUmbrellaSelect}
              isSelected={selectedUmbrella === umbrella.id}
            />
          ))}

          {/* Destination marker */}
          {destinationUmbrella && (
            <DestinationMarker
              position={[
                destinationUmbrella.position[0],
                destinationUmbrella.position[1] + 4,
                destinationUmbrella.position[2]
              ]}
              label={destination || ''}
            />
          )}

          {/* Enhanced Camera Controls for CAD-like navigation */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={15}
            maxDistance={80}
            minPolarAngle={Math.PI / 8}
            maxPolarAngle={Math.PI / 2.2}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlays */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
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

      <div className="absolute bottom-4 right-4 text-xs text-white/70">
        Click and drag to rotate • Scroll to zoom • Click loungers to select
      </div>
    </div>
  );
};

export default BeachMap3D;