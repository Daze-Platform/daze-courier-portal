import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface SpringHillHotelProps {
  onUmbrellaClick?: (id: string) => void;
  selectedUmbrella?: string;
}

const SpringHillHotel: React.FC<SpringHillHotelProps> = ({ onUmbrellaClick, selectedUmbrella }) => {
  const hotelRef = useRef<THREE.Group>(null);
  const poolWaterRef = useRef<THREE.Mesh>(null);

  // Animate pool water
  useFrame((state) => {
    if (poolWaterRef.current && poolWaterRef.current.material) {
      const material = poolWaterRef.current.material as THREE.MeshStandardMaterial;
      if (material.opacity !== undefined) {
        material.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      }
    }
  });

  // Pool umbrellas and loungers
  const poolUmbrellas = useMemo(() => [
    { id: 'P1', position: [-15, 0, 25] as [number, number, number], type: 'premium' },
    { id: 'P2', position: [-8, 0, 25] as [number, number, number], type: 'standard' },
    { id: 'P3', position: [-1, 0, 25] as [number, number, number], type: 'premium' },
    { id: 'P4', position: [6, 0, 25] as [number, number, number], type: 'standard' },
    { id: 'P5', position: [13, 0, 25] as [number, number, number], type: 'premium' },
    { id: 'P6', position: [-12, 0, 18] as [number, number, number], type: 'standard' },
    { id: 'P7', position: [-4, 0, 18] as [number, number, number], type: 'premium' },
    { id: 'P8', position: [4, 0, 18] as [number, number, number], type: 'standard' },
    { id: 'P9', position: [12, 0, 18] as [number, number, number], type: 'premium' },
  ], []);

  // Beach umbrellas
  const beachUmbrellas = useMemo(() => [
    { id: 'B1', position: [-20, 0, 45] as [number, number, number], type: 'standard' },
    { id: 'B2', position: [-12, 0, 45] as [number, number, number], type: 'premium' },
    { id: 'B3', position: [-4, 0, 45] as [number, number, number], type: 'standard' },
    { id: 'B4', position: [4, 0, 45] as [number, number, number], type: 'premium' },
    { id: 'B5', position: [12, 0, 45] as [number, number, number], type: 'standard' },
    { id: 'B6', position: [20, 0, 45] as [number, number, number], type: 'premium' },
    { id: 'B7', position: [-16, 0, 52] as [number, number, number], type: 'standard' },
    { id: 'B8', position: [-8, 0, 52] as [number, number, number], type: 'premium' },
    { id: 'B9', position: [0, 0, 52] as [number, number, number], type: 'standard' },
    { id: 'B10', position: [8, 0, 52] as [number, number, number], type: 'premium' },
    { id: 'B11', position: [16, 0, 52] as [number, number, number], type: 'standard' },
  ], []);

  const UmbrellaSet: React.FC<{ id: string; position: [number, number, number]; type: string }> = ({ id, position, type }) => {
    const isSelected = selectedUmbrella === id;
    const umbrellaColor = type === 'premium' ? '#FF6B35' : '#4A90E2';
    
    return (
      <group 
        position={position} 
        onClick={() => onUmbrellaClick?.(id)}
        onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
        onPointerOut={(e) => { e.stopPropagation(); document.body.style.cursor = 'auto'; }}
      >
        {/* Umbrella pole */}
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 3, 8]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        
        {/* Umbrella canopy */}
        <mesh position={[0, 3.2, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[2.2, 1.2, 12]} />
          <meshStandardMaterial 
            color={umbrellaColor} 
            transparent 
            opacity={0.9}
          />
        </mesh>
        
        {/* Loungers */}
        <mesh position={[-1.5, 0.3, 0]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.8, 0.1, 2]} />
          <meshStandardMaterial color="#F5F5DC" />
        </mesh>
        <mesh position={[1.5, 0.3, 0]} rotation={[-0.1, 0, 0]}>
          <boxGeometry args={[0.8, 0.1, 2]} />
          <meshStandardMaterial color="#F5F5DC" />
        </mesh>
        
        {/* Selection indicator */}
        {isSelected && (
          <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.5, 3, 32]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
          </mesh>
        )}
        
        {/* ID label */}
        <Text
          position={[0, 4, 0]}
          fontSize={0.4}
          color="#333"
          anchorX="center"
          anchorY="middle"
        >
          {id}
        </Text>
      </group>
    );
  };

  return (
    <group ref={hotelRef}>
      {/* Main hotel building - 12 floors, blue and white */}
      <group position={[0, 0, 0]}>
        {/* Ground floor - lobby and amenities */}
        <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[35, 5, 20]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        
        {/* Main tower - 11 floors above ground */}
        <mesh position={[0, 22, -2]} castShadow receiveShadow>
          <boxGeometry args={[28, 38, 16]} />
          <meshStandardMaterial color="#E8F4FD" roughness={0.3} />
        </mesh>
        
        {/* Blue accent bands */}
        {Array.from({ length: 12 }).map((_, floor) => (
          <mesh key={floor} position={[0, 5 + floor * 3.2, 8.5]} castShadow>
            <boxGeometry args={[30, 0.4, 1]} />
            <meshStandardMaterial color="#1E90FF" roughness={0.2} />
          </mesh>
        ))}
        
        {/* Balconies with glass railings */}
        {Array.from({ length: 11 }).map((_, floor) => 
          Array.from({ length: 8 }).map((_, unit) => (
            <group key={`balcony-${floor}-${unit}`} position={[-12 + (unit * 3.5), 6.5 + floor * 3.2, 6]}>
              {/* Balcony floor */}
              <mesh castShadow receiveShadow>
                <boxGeometry args={[2.8, 0.2, 2]} />
                <meshStandardMaterial color="#E0E0E0" />
              </mesh>
              {/* Glass railing */}
              <mesh position={[0, 1, 1]}>
                <boxGeometry args={[2.9, 1.2, 0.1]} />
                <meshStandardMaterial 
                  color="#B0E0FF" 
                  transparent 
                  opacity={0.3}
                  roughness={0.1}
                />
              </mesh>
            </group>
          ))
        )}
        
        {/* Windows */}
        {Array.from({ length: 11 }).map((_, floor) =>
          Array.from({ length: 8 }).map((_, unit) => (
            <mesh key={`window-${floor}-${unit}`} position={[-12 + (unit * 3.5), 7.5 + floor * 3.2, 6.2]}>
              <boxGeometry args={[2.2, 2.4, 0.1]} />
              <meshStandardMaterial 
                color="#87CEEB" 
                transparent 
                opacity={0.7}
                roughness={0.1}
                metalness={0.2}
              />
            </mesh>
          ))
        )}
        
        {/* Hotel signage */}
        <mesh position={[0, 6, 10.5]} castShadow>
          <boxGeometry args={[20, 2, 0.3]} />
          <meshStandardMaterial color="#1E40AF" />
        </mesh>
        
        <Text
          position={[0, 6, 10.8]}
          fontSize={1.2}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          SPRINGHILL SUITES
        </Text>
      </group>

      {/* Ground level pool complex */}
      <group position={[0, 0, 20]}>
        {/* Pool deck */}
        <mesh position={[0, 0.2, 10]} receiveShadow>
          <boxGeometry args={[50, 0.4, 35]} />
          <meshStandardMaterial color="#D4D4AA" roughness={0.4} />
        </mesh>
        
        {/* Main infinity pool - curved shape */}
        <group position={[0, 0.8, 15]}>
          <mesh ref={poolWaterRef} receiveShadow>
            <boxGeometry args={[25, 1, 12]} />
            <meshStandardMaterial 
              color="#4A90E2" 
              transparent 
              opacity={0.8}
              roughness={0.1}
            />
          </mesh>
          
          {/* Pool edge */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[27, 0.2, 14]} />
            <meshStandardMaterial color="#F5F5F5" />
          </mesh>
        </group>
        
        {/* Lazy river section */}
        <mesh position={[-8, 0.6, 5]} receiveShadow>
          <boxGeometry args={[12, 0.8, 6]} />
          <meshStandardMaterial 
            color="#4A90E2" 
            transparent 
            opacity={0.8}
            roughness={0.1}
          />
        </mesh>
        
        {/* Spa/hot tub */}
        <mesh position={[15, 0.8, 8]} receiveShadow>
          <cylinderGeometry args={[3, 3, 1, 16]} />
          <meshStandardMaterial 
            color="#FF6B35" 
            transparent 
            opacity={0.8}
            roughness={0.1}
          />
        </mesh>
        
        {/* Tiki bar structure */}
        <group position={[-18, 0, 12]}>
          {/* Bar counter */}
          <mesh position={[0, 1.2, 0]}>
            <boxGeometry args={[8, 0.3, 3]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          
          {/* Tiki roof */}
          <mesh position={[0, 3, 0]}>
            <coneGeometry args={[5, 2.5, 8]} />
            <meshStandardMaterial color="#DEB887" />
          </mesh>
          
          {/* Support posts */}
          {[-3, -1, 1, 3].map((x, i) => (
            <mesh key={i} position={[x, 1.5, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 3, 8]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
          ))}
        </group>
      </group>

      {/* Beach area */}
      <mesh position={[0, 0.1, 50]} receiveShadow>
        <boxGeometry args={[60, 0.2, 25]} />
        <meshStandardMaterial color="#F4A460" roughness={0.8} />
      </mesh>

      {/* Pool umbrellas and loungers */}
      {poolUmbrellas.map((umbrella) => (
        <UmbrellaSet
          key={umbrella.id}
          id={umbrella.id}
          position={umbrella.position}
          type={umbrella.type}
        />
      ))}

      {/* Beach umbrellas and loungers */}
      {beachUmbrellas.map((umbrella) => (
        <UmbrellaSet
          key={umbrella.id}
          id={umbrella.id}
          position={umbrella.position}
          type={umbrella.type}
        />
      ))}

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[50, 100, 50]} 
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
    </group>
  );
};

export default SpringHillHotel;