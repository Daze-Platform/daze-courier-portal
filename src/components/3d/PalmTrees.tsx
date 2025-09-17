import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PalmTreeProps {
  position: [number, number, number];
  scale?: number;
}

const PalmTree: React.FC<PalmTreeProps> = ({ position, scale = 1 }) => {
  const treeRef = useRef<THREE.Group>(null);
  const leavesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (leavesRef.current) {
      // Gentle swaying motion
      leavesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={treeRef} position={position} scale={scale}>
      {/* Palm tree trunk */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.4, 6]} />
        <meshStandardMaterial 
          color="#8b4513" 
          roughness={0.8}
        />
      </mesh>

      {/* Palm leaves */}
      <group ref={leavesRef} position={[0, 6, 0]}>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle);
          const z = Math.sin(angle);
          
          return (
            <group 
              key={i} 
              position={[0, 0, 0]}
              rotation={[0, angle, -0.2]}
            >
              {/* Leaf stem */}
              <mesh position={[0, 0, 2]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 4]} />
                <meshStandardMaterial color="#228b22" />
              </mesh>
              
              {/* Leaf fronds */}
              {Array.from({ length: 12 }).map((_, j) => {
                const leafZ = (j - 6) * 0.3;
                const leafY = Math.abs(leafZ) * 0.1;
                
                return (
                  <mesh 
                    key={j}
                    position={[0, leafY, 2 + leafZ]}
                    rotation={[0, leafZ * 0.2, 0]}
                    castShadow
                  >
                    <boxGeometry args={[0.8, 0.02, 0.4]} />
                    <meshStandardMaterial 
                      color="#32cd32"
                      transparent
                      opacity={0.9}
                    />
                  </mesh>
                );
              })}
            </group>
          );
        })}
      </group>

      {/* Coconuts */}
      {Array.from({ length: 3 }).map((_, i) => {
        const angle = (i / 3) * Math.PI * 2;
        const x = Math.cos(angle) * 0.5;
        const z = Math.sin(angle) * 0.5;
        
        return (
          <mesh key={i} position={[x, 5.5, z]} castShadow>
            <sphereGeometry args={[0.15]} />
            <meshStandardMaterial color="#8b4513" />
          </mesh>
        );
      })}
    </group>
  );
};

const PalmTrees = () => {
  // Strategic palm tree positions around the resort
  const treePositions: Array<{ pos: [number, number, number]; scale: number }> = [
    { pos: [-15, 0, -5], scale: 1.2 },
    { pos: [15, 0, -3], scale: 1.0 },
    { pos: [-12, 0, 8], scale: 0.9 },
    { pos: [12, 0, 10], scale: 1.1 },
    { pos: [-20, 0, 2], scale: 1.3 },
    { pos: [18, 0, 5], scale: 1.0 },
    { pos: [-8, 0, 15], scale: 0.8 },
    { pos: [8, 0, 16], scale: 1.0 },
    { pos: [0, 0, 20], scale: 1.1 },
    { pos: [-25, 0, -10], scale: 1.4 },
    { pos: [25, 0, -8], scale: 1.2 },
  ];

  return (
    <group>
      {treePositions.map((tree, index) => (
        <PalmTree 
          key={index}
          position={tree.pos}
          scale={tree.scale}
        />
      ))}
    </group>
  );
};

export default PalmTrees;