import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const RealisticTerrain = () => {
  const oceanRef = useRef<THREE.Mesh>(null);
  const waveRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (oceanRef.current) {
      const time = state.clock.elapsedTime;
      oceanRef.current.position.y = Math.sin(time * 0.2) * 0.08;
    }
    
    if (waveRef.current) {
      const time = state.clock.elapsedTime;
      waveRef.current.position.y = Math.sin(time * 0.6) * 0.04 + 0.1;
      waveRef.current.position.z = 35 + Math.sin(time * 0.3) * 1.5;
    }
  });

  return (
    <group>
      {/* Expansive tropical ocean */}
      <mesh 
        ref={oceanRef} 
        position={[0, -0.8, 50]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[300, 150]} />
        <meshStandardMaterial 
          color="#1E6091" 
          transparent 
          opacity={0.92}
          roughness={0.05}
          metalness={0.4}
        />
      </mesh>

      {/* Dynamic wave system */}
      <mesh 
        ref={waveRef}
        position={[0, 0.05, 35]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[300, 8]} />
        <meshStandardMaterial 
          color="#FFFFFF" 
          transparent 
          opacity={0.7}
          roughness={0.1}
        />
      </mesh>

      {/* Premium beach sand with natural variation */}
      <mesh position={[0, -0.4, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 80]} />
        <meshStandardMaterial 
          color="#F4E4BC" 
          roughness={0.85}
          metalness={0.02}
        />
      </mesh>

      {/* Tidal zone - darker wet sand */}
      <mesh position={[0, -0.35, 25]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[300, 20]} />
        <meshStandardMaterial 
          color="#D2B48C" 
          roughness={0.4}
          metalness={0.15}
        />
      </mesh>

      {/* Resort grounds - luxury paving */}
      <mesh position={[0, -0.25, -15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 60]} />
        <meshStandardMaterial 
          color="#F5F5DC" 
          roughness={0.3}
          metalness={0.05}
        />
      </mesh>

      {/* Decorative walkways */}
      <mesh position={[0, -0.2, -15]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 50]} />
        <meshStandardMaterial 
          color="#E8E8E8" 
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* Tropical landscaping - lush gardens */}
      <mesh position={[-60, -0.18, -20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 80]} />
        <meshStandardMaterial 
          color="#228B22" 
          roughness={0.9}
        />
      </mesh>

      <mesh position={[60, -0.18, -20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 80]} />
        <meshStandardMaterial 
          color="#32CD32" 
          roughness={0.9}
        />
      </mesh>

      {/* Resort pathways */}
      <mesh position={[0, -0.15, 5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4, 50]} />
        <meshStandardMaterial 
          color="#DDD5C0" 
          roughness={0.3}
        />
      </mesh>

      {/* Natural coral formations */}
      {Array.from({ length: 15 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 200 + 30;
        const z = Math.random() * 20 + 25;
        const scale = 0.8 + Math.random() * 1.5;
        
        return (
          <mesh 
            key={`coral-${i}`}
            position={[x, scale * 0.4, z]}
            scale={[scale * 0.8, scale, scale * 0.6]}
            castShadow
          >
            <sphereGeometry args={[0.6, 12, 8]} />
            <meshStandardMaterial 
              color="#FF7F50" 
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
        );
      })}

      {/* Beach vegetation */}
      {Array.from({ length: 25 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 250;
        const z = Math.random() * 15 + 10;
        const scale = 0.3 + Math.random() * 0.8;
        
        return (
          <mesh 
            key={`vegetation-${i}`}
            position={[x, scale * 0.2, z]}
            scale={scale}
            castShadow
          >
            <sphereGeometry args={[0.4, 6, 4]} />
            <meshStandardMaterial 
              color="#90EE90" 
              roughness={0.9}
            />
          </mesh>
        );
      })}

      {/* Luxury resort features - decorative elements */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 45;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius - 15;
        
        return (
          <group key={`feature-${i}`} position={[x, 0, z]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.5, 0.8, 2]} />
              <meshStandardMaterial 
                color="#D2B48C" 
                roughness={0.4}
              />
            </mesh>
            <mesh position={[0, 1.5, 0]}>
              <sphereGeometry args={[0.8, 8, 6]} />
              <meshStandardMaterial 
                color="#228B22" 
                roughness={0.8}
              />
            </mesh>
          </group>
        );
      })}

      {/* Natural driftwood and beach details */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 200;
        const z = Math.random() * 25 + 8;
        const rotation = Math.random() * Math.PI;
        const scale = 0.2 + Math.random() * 0.5;
        
        return (
          <mesh 
            key={`driftwood-${i}`}
            position={[x, scale * 0.1, z]}
            rotation={[0, rotation, Math.random() * 0.2]}
            scale={scale}
          >
            <boxGeometry args={[3, 0.3, 0.8]} />
            <meshStandardMaterial 
              color="#DEB887" 
              roughness={0.9}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default RealisticTerrain;