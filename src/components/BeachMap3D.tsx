import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import { MapPin, Umbrella } from 'lucide-react';
import * as THREE from 'three';

interface BeachMap3DProps {
  destination?: string;
  onUmbrellaSelect?: (umbrellaId: string) => void;
  showTokenInput?: boolean;
}

// 3D Umbrella Component
const UmbrellaModel = ({ 
  position, 
  umbrellaId, 
  type = 'standard', 
  onSelect, 
  isSelected = false 
}: {
  position: [number, number, number];
  umbrellaId: string;
  type?: 'standard' | 'premium';
  onSelect?: (id: string) => void;
  isSelected?: boolean;
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  const color = type === 'premium' ? '#fbbf24' : '#3b82f6';
  const poleColor = '#8b4513';

  return (
    <group
      ref={meshRef}
      position={position}
      onClick={() => onSelect?.(umbrellaId)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Umbrella Pole */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 2]} />
        <meshStandardMaterial color={poleColor} />
      </mesh>
      
      {/* Umbrella Top */}
      <mesh position={[0, 2.2, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[1.2, 0.8, 8]} />
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={isSelected ? 0.9 : 0.7}
        />
      </mesh>
      
      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, 0.1, 0]}>
          <ringGeometry args={[1.5, 1.8, 16]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.6} />
        </mesh>
      )}
      
      {/* Umbrella label */}
      <Text
        position={[0, 3, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="black"
      >
        {umbrellaId}
      </Text>
      
      {/* Hover effect */}
      {hovered && (
        <Html position={[0, 3.5, 0]} center>
          <div className="bg-black/80 text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none">
            {type === 'premium' ? 'Premium' : 'Standard'} - {umbrellaId}
          </div>
        </Html>
      )}
    </group>
  );
};

// Resort Building Component
const ResortBuilding = () => {
  return (
    <group position={[-8, 0, -5]}>
      {/* Main building */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[6, 4, 3]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 4.5, 0]}>
        <coneGeometry args={[4, 1.5, 4]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
      
      {/* Windows */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[
          -2 + (i % 4) * 1.3, 
          1.5 + Math.floor(i / 4) * 1, 
          1.51
        ]}>
          <boxGeometry args={[0.6, 0.8, 0.02]} />
          <meshStandardMaterial color="#87ceeb" />
        </mesh>
      ))}
      
      {/* Door */}
      <mesh position={[0, 1, 1.51]}>
        <boxGeometry args={[0.8, 2, 0.02]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      
      {/* Building label */}
      <Text
        position={[0, 5.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.03}
        outlineColor="black"
      >
        Pelican Beach Resort
      </Text>
    </group>
  );
};

// Ocean Component with animated waves
const Ocean = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -0.5, 5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 20]} />
      <meshStandardMaterial 
        color="#006994" 
        transparent 
        opacity={0.8}
        roughness={0.1}
        metalness={0.2}
      />
    </mesh>
  );
};

// Beach Terrain
const Beach = () => {
  return (
    <mesh position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 30]} />
      <meshStandardMaterial color="#f4e4bc" roughness={0.8} />
    </mesh>
  );
};

// Destination Marker
const DestinationMarker = ({ position, label }: { position: [number, number, number]; label: string }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 3) * 0.1;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {/* Pin */}
      <mesh position={[0, 1, 0]}>
        <coneGeometry args={[0.3, 1, 8]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      
      {/* Pin base */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>
      
      {/* Label */}
      <Html position={[0, 2, 0]} center>
        <div className="bg-red-500 text-white px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none">
          📍 {label}
        </div>
      </Html>
    </group>
  );
};

const BeachMap3D: React.FC<BeachMap3DProps> = ({ destination, onUmbrellaSelect }) => {
  const [selectedUmbrella, setSelectedUmbrella] = useState<string | null>(null);

  // Umbrella positions and types
  const umbrellas = [
    { id: 'A1', position: [-3, 0, -2] as [number, number, number], type: 'standard' as const },
    { id: 'A2', position: [-1, 0, -2] as [number, number, number], type: 'standard' as const },
    { id: 'A3', position: [1, 0, -2] as [number, number, number], type: 'premium' as const },
    { id: 'A4', position: [3, 0, -2] as [number, number, number], type: 'standard' as const },
    { id: 'B1', position: [-4, 0, 0] as [number, number, number], type: 'premium' as const },
    { id: 'B2', position: [-2, 0, 0] as [number, number, number], type: 'standard' as const },
    { id: 'B3', position: [0, 0, 0] as [number, number, number], type: 'premium' as const },
    { id: 'B4', position: [2, 0, 0] as [number, number, number], type: 'standard' as const },
    { id: 'B5', position: [4, 0, 0] as [number, number, number], type: 'premium' as const },
    { id: 'C1', position: [-3, 0, 2] as [number, number, number], type: 'standard' as const },
    { id: 'C2', position: [-1, 0, 2] as [number, number, number], type: 'premium' as const },
    { id: 'C3', position: [1, 0, 2] as [number, number, number], type: 'standard' as const },
    { id: 'C4', position: [3, 0, 2] as [number, number, number], type: 'premium' as const },
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
    <div className="relative w-full h-full bg-gradient-to-b from-sky-300 to-sky-500">
      <Canvas
        camera={{ position: [0, 8, 10], fov: 60 }}
        shadows
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 20, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.3} />

        {/* Scene Components */}
        <Beach />
        <Ocean />
        <ResortBuilding />

        {/* Umbrellas */}
        {umbrellas.map((umbrella) => (
          <UmbrellaModel
            key={umbrella.id}
            position={umbrella.position}
            umbrellaId={umbrella.id}
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
              destinationUmbrella.position[1] + 0.5,
              destinationUmbrella.position[2]
            ]}
            label={destination || ''}
          />
        )}

        {/* Camera Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
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

      <div className="absolute bottom-4 right-4 text-xs text-white/70">
        Click and drag to rotate • Scroll to zoom • Click umbrellas to select
      </div>
    </div>
  );
};

export default BeachMap3D;