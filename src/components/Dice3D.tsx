
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * THREE from 'three';

interface DiceProps {
  isSpinning: boolean;
}

function DiceMesh({ isSpinning }: DiceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const currentRotation = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (isSpinning) {
      // Random target rotation for spinning effect
      targetRotation.current = {
        x: Math.PI * 2 * (1 + Math.random()),
        y: Math.PI * 2 * (1 + Math.random()),
        z: Math.PI * 2 * (1 + Math.random())
      };
    }
  }, [isSpinning]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    if (isSpinning) {
      // Smooth rotation animation
      const speed = 3; // Adjust speed as needed
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * delta * speed;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * delta * speed;
      currentRotation.current.z += (targetRotation.current.z - currentRotation.current.z) * delta * speed;

      meshRef.current.rotation.x = currentRotation.current.x;
      meshRef.current.rotation.y = currentRotation.current.y;
      meshRef.current.rotation.z = currentRotation.current.z;
    }
  });

  // Create dice geometry with rounded edges
  const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2);

  // Create materials for each face with dots
  const createDotTexture = (dotCount: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    // Blue gradient background
    const gradient = ctx.createLinearGradient(0, 0, 256, 256);
    gradient.addColorStop(0, '#60A5FA'); // Light blue
    gradient.addColorStop(1, '#3B82F6'); // Darker blue
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    // Draw dots
    ctx.fillStyle = 'white';
    const dotSize = 20;
    const positions = [
      // 1 dot (center)
      [[128, 128]],
      // 2 dots (diagonal)
      [[80, 80], [176, 176]],
      // 3 dots (diagonal)
      [[64, 64], [128, 128], [192, 192]],
      // 4 dots (corners)
      [[80, 80], [176, 80], [80, 176], [176, 176]],
      // 5 dots (corners + center)
      [[64, 64], [192, 64], [128, 128], [64, 192], [192, 192]],
      // 6 dots (two columns)
      [[80, 64], [80, 128], [80, 192], [176, 64], [176, 128], [176, 192]]
    ];

    const dots = positions[dotCount - 1] || positions[0];
    dots.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, dotSize, 0, Math.PI * 2);
      ctx.fill();
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
    return texture;
  };

  const materials = [
    new THREE.MeshPhongMaterial({ map: createDotTexture(1) }), // Right
    new THREE.MeshPhongMaterial({ map: createDotTexture(6) }), // Left
    new THREE.MeshPhongMaterial({ map: createDotTexture(3) }), // Top
    new THREE.MeshPhongMaterial({ map: createDotTexture(4) }), // Bottom
    new THREE.MeshPhongMaterial({ map: createDotTexture(5) }), // Front
    new THREE.MeshPhongMaterial({ map: createDotTexture(2) }), // Back
  ];

  return (
    <mesh ref={meshRef} geometry={geometry} material={materials} scale={2.5}>
      <meshPhongMaterial attach="material" />
    </mesh>
  );
}

export default function Dice3D({ isSpinning }: DiceProps) {
  return (
    <div className="w-32 h-32">
      <Canvas camera={{ position: [2, 2, 3], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 5, 5]} intensity={0.5} />
        <DiceMesh isSpinning={isSpinning} />
      </Canvas>
    </div>
  );
}
