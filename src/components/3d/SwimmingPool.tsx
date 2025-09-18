import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SwimmingPool = () => {
  const waterRef = useRef<THREE.Mesh>(null);
  const poolDeckRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (waterRef.current) {
      // Subtle water animation
      waterRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
    }
  });

  return (
    <group ref={poolDeckRef} position={[0, 0, -10]}>
      {/* Large resort-style pool deck */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[80, 0.3, 25]} />
        <meshStandardMaterial 
          color="#F5F5DC" 
          roughness={0.4}
          metalness={0.05}
        />
      </mesh>

      {/* Main infinity pool */}
      <mesh ref={waterRef} position={[0, 0.4, 2]} receiveShadow>
        <boxGeometry args={[50, 0.8, 15]} />
        <meshStandardMaterial 
          color="#4A90E2" 
          transparent 
          opacity={0.85}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>

      {/* Secondary lagoon pool */}
      <mesh ref={waterRef} position={[-25, 0.35, -5]} receiveShadow>
        <boxGeometry args={[20, 0.7, 10]} />
        <meshStandardMaterial 
          color="#40E0D0" 
          transparent 
          opacity={0.88}
          roughness={0.05}
          metalness={0.1}
        />
      </mesh>

      {/* Children's pool */}
      <mesh position={[25, 0.25, -5]} receiveShadow>
        <cylinderGeometry args={[8, 8, 0.5, 16]} />
        <meshStandardMaterial 
          color="#87CEEB" 
          transparent 
          opacity={0.9}
          roughness={0.05}
        />
      </mesh>

      {/* Premium pool borders */}
      <mesh position={[0, 0.15, 2]}>
        <boxGeometry args={[52, 0.15, 17]} />
        <meshStandardMaterial color="#E0E0E0" roughness={0.2} />
      </mesh>

      <mesh position={[-25, 0.1, -5]}>
        <boxGeometry args={[22, 0.15, 12]} />
        <meshStandardMaterial color="#E0E0E0" roughness={0.2} />
      </mesh>

      {/* Luxury pool steps with handrails */}
      {Array.from({ length: 4 }).map((_, i) => (
        <group key={i} position={[-24, 0.1 - (i * 0.15), -2 + (i * 0.5)]}>
          <mesh>
            <boxGeometry args={[2, 0.15, 1.2]} />
            <meshStandardMaterial color="#C0C0C0" roughness={0.3} />
          </mesh>
          {/* Handrails */}
          <mesh position={[0.9, 0.8, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 1.6]} />
            <meshStandardMaterial color="#B8860B" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Sophisticated swim-up bar */}
      <group position={[0, 0.6, 2]}>
        {/* Modern bar counter - curved design */}
        <mesh position={[0, 0.8, -7]}>
          <boxGeometry args={[25, 0.3, 3]} />
          <meshStandardMaterial color="#8B4513" roughness={0.3} metalness={0.2} />
        </mesh>
        
        {/* Bar top surface */}
        <mesh position={[0, 1.1, -7]}>
          <boxGeometry args={[25, 0.1, 3.5]} />
          <meshStandardMaterial color="#DDD5C0" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Underwater bar seating */}
        {Array.from({ length: 8 }).map((_, i) => (
          <group key={i} position={[-14 + (i * 4), -0.2, -6]}>
            <mesh>
              <cylinderGeometry args={[0.4, 0.4, 0.8]} />
              <meshStandardMaterial color="#8B7355" roughness={0.4} />
            </mesh>
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.5, 0.5, 0.1]} />
              <meshStandardMaterial color="#DDD5C0" roughness={0.3} />
            </mesh>
          </group>
        ))}

        {/* Modern canopy structure */}
        <mesh position={[0, 3.5, -7]}>
          <boxGeometry args={[28, 0.3, 6]} />
          <meshStandardMaterial color="#2C3E50" roughness={0.2} metalness={0.4} />
        </mesh>

        {/* Support columns */}
        {[-10, 0, 10].map((x, idx) => (
          <mesh key={idx} position={[x, 2, -7]}>
            <cylinderGeometry args={[0.3, 0.4, 4]} />
            <meshStandardMaterial color="#34495E" roughness={0.3} metalness={0.3} />
          </mesh>
        ))}
      </group>

      {/* Pool deck lounging areas */}
      <mesh position={[35, 0.15, 5]} receiveShadow>
        <boxGeometry args={[25, 0.2, 15]} />
        <meshStandardMaterial color="#F0E68C" roughness={0.5} />
      </mesh>

      <mesh position={[-35, 0.15, 5]} receiveShadow>
        <boxGeometry args={[25, 0.2, 15]} />
        <meshStandardMaterial color="#F0E68C" roughness={0.5} />
      </mesh>

      {/* Water features - fountains */}
      {Array.from({ length: 4 }).map((_, i) => (
        <group key={i} position={[-20 + (i * 13), 1.2, 2]}>
          <mesh>
            <cylinderGeometry args={[0.8, 1, 0.4]} />
            <meshStandardMaterial color="#708090" roughness={0.3} metalness={0.2} />
          </mesh>
          {/* Water jet effect */}
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.1, 0.2, 2]} />
            <meshStandardMaterial 
              color="#E0F6FF" 
              transparent 
              opacity={0.6}
            />
          </mesh>
        </group>
      ))}

      {/* Ambient pool lighting */}
      <pointLight
        position={[0, 2, 2]}
        intensity={0.8}
        color="#40E0D0"
        distance={25}
        castShadow
      />
      
      <pointLight
        position={[-25, 2, -5]}
        intensity={0.6}
        color="#4A90E2"
        distance={20}
      />
      
      <pointLight
        position={[25, 2, -5]}
        intensity={0.5}
        color="#87CEEB"
        distance={18}
      />
    </group>
  );
};

export default SwimmingPool;