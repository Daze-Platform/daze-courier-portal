import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SwimmingPool = () => {
  const waterRef = useRef<THREE.Mesh>(null);
  const poolDeckRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (waterRef.current) {
      // Subtle water animation
      waterRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
    }
  });

  return (
    <group ref={poolDeckRef} position={[0, 0, -8]}>
      {/* Pool deck */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[25, 0.2, 12]} />
        <meshStandardMaterial 
          color="#f0e68c" 
          roughness={0.6}
        />
      </mesh>

      {/* Main swimming pool */}
      <mesh ref={waterRef} position={[0, 0.3, 0]} receiveShadow>
        <boxGeometry args={[20, 0.4, 8]} />
        <meshStandardMaterial 
          color="#20b2aa" 
          transparent 
          opacity={0.9}
          roughness={0.1}
          metalness={0.1}
        />
      </mesh>

      {/* Pool border */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[21, 0.1, 9]} />
        <meshStandardMaterial color="#708090" />
      </mesh>

      {/* Pool steps */}
      {Array.from({ length: 3 }).map((_, i) => (
        <mesh key={i} position={[-9.5, 0.1 - (i * 0.1), -3 + (i * 0.3)]}>
          <boxGeometry args={[1, 0.1, 0.8]} />
          <meshStandardMaterial color="#708090" />
        </mesh>
      ))}

      {/* Pool bar structure */}
      <group position={[0, 0.5, 0]}>
        {/* Bar counter */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[3, 3, 0.2, 16]} />
          <meshStandardMaterial color="#8b4513" />
        </mesh>
        
        {/* Bar stools */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 4;
          const z = Math.sin(angle) * 4;
          return (
            <group key={i} position={[x, 0.3, z]}>
              <mesh>
                <cylinderGeometry args={[0.3, 0.3, 0.6]} />
                <meshStandardMaterial color="#654321" />
              </mesh>
              <mesh position={[0, 0.4, 0]}>
                <cylinderGeometry args={[0.4, 0.4, 0.1]} />
                <meshStandardMaterial color="#8b4513" />
              </mesh>
            </group>
          );
        })}

        {/* Bar roof */}
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[4, 4, 0.2, 16]} />
          <meshStandardMaterial color="#228b22" />
        </mesh>
      </group>

      {/* Pool lighting */}
      <pointLight
        position={[0, 1, 0]}
        intensity={0.5}
        color="#40e0d0"
        distance={15}
      />
    </group>
  );
};

export default SwimmingPool;