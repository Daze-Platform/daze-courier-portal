import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const ResortBuilding = () => {
  const buildingRef = useRef<THREE.Group>(null);

  return (
    <group ref={buildingRef} position={[0, 0, -30]}>
      {/* Main central building - 8 floors */}
      <mesh position={[0, 16, 0]} castShadow receiveShadow>
        <boxGeometry args={[45, 32, 18]} />
        <meshStandardMaterial 
          color="#F4E8D0" 
          roughness={0.2}
          metalness={0.05}
        />
      </mesh>

      {/* Left wing */}
      <mesh position={[-35, 12, 5]} castShadow receiveShadow>
        <boxGeometry args={[28, 24, 16]} />
        <meshStandardMaterial 
          color="#F0E4CC" 
          roughness={0.25}
          metalness={0.05}
        />
      </mesh>

      {/* Right wing */}
      <mesh position={[35, 12, 5]} castShadow receiveShadow>
        <boxGeometry args={[28, 24, 16]} />
        <meshStandardMaterial 
          color="#F0E4CC" 
          roughness={0.25}
          metalness={0.05}
        />
      </mesh>

      {/* Detailed floors with realistic spacing */}
      {Array.from({ length: 8 }).map((_, floor) => (
        <group key={floor}>
          {/* Floor separator bands */}
          <mesh position={[0, 2 + floor * 3.8, 9.5]} castShadow>
            <boxGeometry args={[47, 0.3, 1.2]} />
            <meshStandardMaterial color="#E8DCC0" roughness={0.4} />
          </mesh>
          
          {/* Central building balconies */}
          {Array.from({ length: 12 }).map((_, i) => (
            <group key={i} position={[-21 + (i * 3.5), 2.5 + floor * 3.8, 9]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[2.8, 0.2, 2.5]} />
                <meshStandardMaterial color="#DDD5C0" roughness={0.3} />
              </mesh>
              {/* Glass railings */}
              <mesh position={[0, 1.2, 1.25]}>
                <boxGeometry args={[2.9, 1.2, 0.1]} />
                <meshStandardMaterial 
                  color="#E0F6FF" 
                  transparent 
                  opacity={0.4}
                  roughness={0.1}
                  metalness={0.1}
                />
              </mesh>
            </group>
          ))}

          {/* Wing balconies */}
          {[-35, 35].map((wingX, wingIdx) => 
            Array.from({ length: 6 }).map((_, i) => (
              <group key={`wing-${wingIdx}-${i}`} position={[wingX + (-10 + i * 3.3), 2.5 + floor * 3.8, 13]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[2.5, 0.2, 2]} />
                  <meshStandardMaterial color="#DDD5C0" roughness={0.3} />
                </mesh>
                <mesh position={[0, 1.2, 1]}>
                  <boxGeometry args={[2.6, 1.2, 0.1]} />
                  <meshStandardMaterial 
                    color="#E0F6FF" 
                    transparent 
                    opacity={0.4}
                    roughness={0.1}
                  />
                </mesh>
              </group>
            ))
          )}
        </group>
      ))}

      {/* Realistic windows with detailed frames */}
      {Array.from({ length: 8 }).map((_, floor) =>
        Array.from({ length: 12 }).map((_, i) => (
          <group key={`window-${floor}-${i}`} position={[-21 + (i * 3.5), 3.5 + floor * 3.8, 9.2]}>
            {/* Window frame */}
            <mesh castShadow>
              <boxGeometry args={[2.2, 2.8, 0.15]} />
              <meshStandardMaterial color="#C4B89A" roughness={0.4} />
            </mesh>
            {/* Glass with reflections */}
            <mesh position={[0, 0, 0.08]}>
              <boxGeometry args={[2, 2.6, 0.05]} />
              <meshStandardMaterial 
                color="#87CEEB" 
                transparent 
                opacity={0.7}
                roughness={0.05}
                metalness={0.2}
              />
            </mesh>
          </group>
        ))
      )}

      {/* Wing windows */}
      {Array.from({ length: 8 }).map((_, floor) =>
        [-35, 35].map((wingX, wingIdx) => 
          Array.from({ length: 6 }).map((_, i) => (
            <group key={`wing-window-${floor}-${wingIdx}-${i}`} position={[wingX + (-10 + i * 3.3), 3.5 + floor * 3.8, 13.2]}>
              <mesh castShadow>
                <boxGeometry args={[2, 2.8, 0.15]} />
                <meshStandardMaterial color="#C4B89A" roughness={0.4} />
              </mesh>
              <mesh position={[0, 0, 0.08]}>
                <boxGeometry args={[1.8, 2.6, 0.05]} />
                <meshStandardMaterial 
                  color="#87CEEB" 
                  transparent 
                  opacity={0.7}
                  roughness={0.05}
                  metalness={0.2}
                />
              </mesh>
            </group>
          ))
        )
      )}

      {/* Rooftop terrace */}
      <mesh position={[0, 33, 0]} castShadow receiveShadow>
        <boxGeometry args={[42, 1.5, 16]} />
        <meshStandardMaterial color="#F5F5DC" roughness={0.3} />
      </mesh>

      {/* Rooftop infinity pool */}
      <mesh position={[0, 34.5, 0]} receiveShadow>
        <boxGeometry args={[25, 1.2, 8]} />
        <meshStandardMaterial 
          color="#4A90E2" 
          transparent 
          opacity={0.85}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>

      {/* Grand lobby - double height */}
      <mesh position={[0, 3, 12]} castShadow receiveShadow>
        <boxGeometry args={[30, 6, 8]} />
        <meshStandardMaterial color="#E8DCC0" roughness={0.2} />
      </mesh>

      {/* Entrance canopy */}
      <mesh position={[0, 6.5, 20]} castShadow>
        <boxGeometry args={[35, 0.8, 12]} />
        <meshStandardMaterial color="#C9B997" roughness={0.3} />
      </mesh>

      {/* Structural columns */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} position={[-15 + (i * 5), 3, 16]} castShadow>
          <cylinderGeometry args={[0.6, 0.8, 6, 12]} />
          <meshStandardMaterial color="#B8A082" roughness={0.4} />
        </mesh>
      ))}

      {/* Resort signage with modern design */}
      <mesh position={[0, 8, 22]} castShadow>
        <boxGeometry args={[25, 2.5, 0.5]} />
        <meshStandardMaterial color="#2C3E50" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Architectural details */}
      <mesh position={[0, 32.5, 9.5]} castShadow>
        <boxGeometry args={[47, 1.2, 1.5]} />
        <meshStandardMaterial color="#E0D4B8" roughness={0.3} />
      </mesh>

      {/* Resort text */}
      <Text
        position={[0, 8, 22.3]}
        fontSize={1.8}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#1A252F"
      >
        PELICAN BEACH RESORT
      </Text>
    </group>
  );
};

export default ResortBuilding;