
import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Box, OrbitControls } from '@react-three/drei';
import { Mesh } from 'three';

interface Dice3DProps {
  isSpinning: boolean;
}

const DiceBox = ({ isSpinning }: { isSpinning: boolean }) => {
  const meshRef = useRef<Mesh>(null);

  return (
    <Box
      ref={meshRef}
      args={[2, 2, 2]}
      rotation={isSpinning ? [Math.PI * 4, Math.PI * 4, Math.PI * 4] : [0.3, 0.3, 0]}
    >
      <meshStandardMaterial color="#3B82F6" roughness={0.1} metalness={0.1} />
      {/* Dice dots as small spheres */}
      {/* Face 1 - Center dot */}
      <mesh position={[0, 0, 1.01]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Face 2 - Two dots */}
      <mesh position={[-0.4, 0.4, -1.01]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.4, -0.4, -1.01]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      
      {/* Face 5 - Five dots */}
      <mesh position={[0, 0, 1.01]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.4, 0.4, 1.01]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.4, 0.4, 1.01]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.4, -0.4, 1.01]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.4, -0.4, 1.01]}>
        <sphereGeometry args={[0.1]} />
        <meshStandardMaterial color="white" />
      </mesh>
    </Box>
  );
};

const Dice3D: React.FC<Dice3DProps> = ({ isSpinning }) => {
  return (
    <div className="w-24 h-24">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <DiceBox isSpinning={isSpinning} />
      </Canvas>
    </div>
  );
};

export default Dice3D;
