import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const RealisticTerrain = () => {
  const oceanRef = useRef<THREE.Mesh>(null);
  const waveRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (oceanRef.current) {
      const time = state.clock.elapsedTime;
      oceanRef.current.position.y = Math.sin(time * 0.3) * 0.1;
    }
    
    if (waveRef.current) {
      const time = state.clock.elapsedTime;
      waveRef.current.position.y = Math.sin(time * 0.8) * 0.05 + 0.1;
      waveRef.current.position.z = 25 + Math.sin(time * 0.5) * 2;
    }
  });

  return (
    <group>
      {/* Ocean */}
      <mesh 
        ref={oceanRef} 
        position={[0, -0.5, 30]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 100]} />
        <meshStandardMaterial 
          color="#006994" 
          transparent 
          opacity={0.9}
          roughness={0.1}
          metalness={0.3}
        />
      </mesh>

      {/* Animated waves */}
      <mesh 
        ref={waveRef}
        position={[0, 0.1, 25]} 
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[200, 5]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.6}
        />
      </mesh>

      {/* Beach sand - multiple layers for depth */}
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 60]} />
        <meshStandardMaterial 
          color="#f4e4bc" 
          roughness={0.9}
        />
      </mesh>

      {/* Wet sand near water */}
      <mesh position={[0, -0.25, 20]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 10]} />
        <meshStandardMaterial 
          color="#d2b48c" 
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Resort grounds - paved areas */}
      <mesh position={[0, -0.2, -10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 40]} />
        <meshStandardMaterial 
          color="#e0e0e0" 
          roughness={0.4}
        />
      </mesh>

      {/* Landscaping - grass areas */}
      <mesh position={[-30, -0.15, -10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial 
          color="#32cd32" 
          roughness={0.8}
        />
      </mesh>

      <mesh position={[30, -0.15, -10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial 
          color="#32cd32" 
          roughness={0.8}
        />
      </mesh>

      {/* Decorative rocks */}
      {Array.from({ length: 20 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 100;
        const z = Math.random() * 15 + 15;
        const scale = 0.5 + Math.random() * 1;
        
        return (
          <mesh 
            key={i}
            position={[x, scale * 0.3, z]}
            scale={scale}
            castShadow
          >
            <sphereGeometry args={[0.5, 8, 6]} />
            <meshStandardMaterial 
              color="#708090" 
              roughness={0.9}
            />
          </mesh>
        );
      })}

      {/* Beach debris - shells, driftwood */}
      {Array.from({ length: 30 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 150;
        const z = Math.random() * 20 + 5;
        const rotation = Math.random() * Math.PI * 2;
        
        return (
          <mesh 
            key={i}
            position={[x, 0.05, z]}
            rotation={[0, rotation, 0]}
            scale={0.1 + Math.random() * 0.2}
          >
            <boxGeometry args={[2, 0.2, 0.8]} />
            <meshStandardMaterial 
              color="#deb887" 
              roughness={0.8}
            />
          </mesh>
        );
      })}
    </group>
  );
};

export default RealisticTerrain;