import React from 'react';
import * as THREE from 'three';

interface BeachLoungersProps {
  umbrellaId: string;
  position: [number, number, number];
  type: 'standard' | 'premium';
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const BeachLoungers: React.FC<BeachLoungersProps> = ({ 
  umbrellaId, 
  position, 
  type, 
  isSelected, 
  onSelect 
}) => {
  const umbrellaColor = type === 'premium' ? '#ff6b35' : '#4a90e2';
  const loungerColor = '#f5deb3';

  return (
    <group 
      position={position}
      onClick={() => onSelect?.(umbrellaId)}
    >
      {/* Umbrella pole */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 3]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>

      {/* Umbrella canopy */}
      <mesh position={[0, 3.2, 0]} castShadow>
        <coneGeometry args={[2, 1.2, 12]} />
        <meshStandardMaterial 
          color={umbrellaColor}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Umbrella ribs */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 1.5;
        const z = Math.sin(angle) * 1.5;
        return (
          <mesh 
            key={i} 
            position={[x * 0.5, 3, z * 0.5]}
            rotation={[0, angle, Math.PI / 6]}
            castShadow
          >
            <cylinderGeometry args={[0.02, 0.02, 1.5]} />
            <meshStandardMaterial color="#2c2c2c" />
          </mesh>
        );
      })}

      {/* Beach loungers */}
      {Array.from({ length: 2 }).map((_, i) => (
        <group key={i} position={[i === 0 ? -1.2 : 1.2, 0.2, 0]}>
          {/* Lounger frame */}
          <mesh castShadow>
            <boxGeometry args={[2, 0.1, 0.6]} />
            <meshStandardMaterial color={loungerColor} />
          </mesh>
          
          {/* Lounger backrest */}
          <mesh position={[-0.6, 0.3, 0]} rotation={[0, 0, -0.3]} castShadow>
            <boxGeometry args={[0.8, 0.1, 0.6]} />
            <meshStandardMaterial color={loungerColor} />
          </mesh>
          
          {/* Lounger legs */}
          {Array.from({ length: 4 }).map((_, legIndex) => {
            const legX = legIndex < 2 ? -0.8 : 0.8;
            const legZ = legIndex % 2 === 0 ? -0.25 : 0.25;
            return (
              <mesh key={legIndex} position={[legX, -0.1, legZ]} castShadow>
                <cylinderGeometry args={[0.03, 0.03, 0.3]} />
                <meshStandardMaterial color="#8b4513" />
              </mesh>
            );
          })}
        </group>
      ))}

      {/* Selection indicator */}
      {isSelected && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.5, 3, 32]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.6} />
        </mesh>
      )}

      {/* Umbrella shadow */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.2]} />
        <meshBasicMaterial 
          color="#000000" 
          transparent 
          opacity={0.2}
        />
      </mesh>

      {/* ID label */}
      <mesh position={[0, 4, 0]}>
        <planeGeometry args={[0.8, 0.3]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Text would go here - simplified for performance */}
    </group>
  );
};

export default BeachLoungers;