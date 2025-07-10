
import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface DiceProps {
  isSpinning: boolean;
  targetNumber: number;
}

function DiceMesh({ isSpinning, targetNumber }: DiceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const currentRotation = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    if (isSpinning) {
      // Define exact rotations for each dice face (1-6)
      const faceRotations = [
        { x: 0, y: 0, z: 0 },                    // Face 1
        { x: 0, y: Math.PI, z: 0 },              // Face 6 (opposite)
        { x: 0, y: Math.PI/2, z: 0 },            // Face 3
        { x: 0, y: -Math.PI/2, z: 0 },           // Face 4 (opposite)
        { x: -Math.PI/2, y: 0, z: 0 },           // Face 5
        { x: Math.PI/2, y: 0, z: 0 }             // Face 2 (opposite)
      ];
      
      // Pick the specific face based on target number and add spinning rotations
      const faceIndex = Math.max(0, Math.min(5, targetNumber - 1)); // Ensure valid range 0-5
      const selectedFace = faceRotations[faceIndex];
      const spins = Math.PI * 2 * (2 + Math.random() * 3); // 2-5 full rotations
      
      targetRotation.current = {
        x: selectedFace.x + spins,
        y: selectedFace.y + spins,
        z: selectedFace.z + spins
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
    <mesh ref={meshRef} geometry={geometry} material={materials} scale={3.2}>
      <meshPhongMaterial attach="material" />
    </mesh>
  );
}

export default function Dice3D({ isSpinning, targetNumber }: DiceProps) {
  return (
    <div className="w-48 h-48">
      <Canvas camera={{ position: [3, 3, 4], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, 5, 5]} intensity={0.5} />
        <DiceMesh isSpinning={isSpinning} targetNumber={targetNumber} />
      </Canvas>
    </div>
  );
}
