import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const ResortBuilding = () => {
  const buildingRef = useRef<THREE.Group>(null);

  return (
    <group ref={buildingRef} position={[0, 0, -15]}>
      {/* Main building - 6 floors */}
      <mesh position={[0, 6, 0]} castShadow receiveShadow>
        <boxGeometry args={[20, 12, 8]} />
        <meshStandardMaterial 
          color="#f5deb3" 
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Building floors */}
      {Array.from({ length: 6 }).map((_, floor) => (
        <group key={floor} position={[0, floor * 2 + 1, 0]}>
          {/* Balconies */}
          {Array.from({ length: 8 }).map((_, i) => (
            <group key={i} position={[-9 + (i * 2.5), 0, 4.1]}>
              <mesh castShadow>
                <boxGeometry args={[2, 0.1, 1]} />
                <meshStandardMaterial color="#e0e0e0" />
              </mesh>
              {/* Balcony railing */}
              <mesh position={[0, 0.5, 0.5]}>
                <boxGeometry args={[2, 1, 0.05]} />
                <meshStandardMaterial color="#ffffff" transparent opacity={0.8} />
              </mesh>
            </group>
          ))}

          {/* Windows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <mesh 
              key={i} 
              position={[-9 + (i * 2.5), 0, 4.01]}
              castShadow
            >
              <boxGeometry args={[1.5, 1.8, 0.02]} />
              <meshStandardMaterial 
                color="#87ceeb" 
                transparent 
                opacity={0.7}
                roughness={0.1}
                metalness={0.3}
              />
            </mesh>
          ))}
        </group>
      ))}

      {/* Rooftop pool deck */}
      <group position={[0, 12.5, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[18, 0.3, 6]} />
          <meshStandardMaterial color="#d2b48c" />
        </mesh>
        
        {/* Rooftop pool */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[12, 0.5, 4]} />
          <meshStandardMaterial 
            color="#40e0d0" 
            transparent 
            opacity={0.8}
            roughness={0.1}
            metalness={0.1}
          />
        </mesh>
      </group>

      {/* Ground floor lobby with glass */}
      <mesh position={[0, 1, 4.01]} castShadow>
        <boxGeometry args={[8, 2, 0.05]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.3}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Main entrance */}
      <mesh position={[0, 1, 4.1]} castShadow>
        <boxGeometry args={[3, 2.5, 0.2]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Resort sign */}
      <Text
        position={[0, 14, 4]}
        fontSize={1.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        PELICAN BEACH RESORT
      </Text>
    </group>
  );
};

export default ResortBuilding;