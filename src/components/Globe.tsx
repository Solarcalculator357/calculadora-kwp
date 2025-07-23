import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const EarthSphere = ({ heading }: { heading: number | null }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const compassArrowRef = useRef<THREE.Group>(null);

  // Create earth texture using a simple gradient approach since we can't load external textures easily
  const createEarthTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d');
    
    if (context) {
      // Create a simple earth-like texture
      const gradient = context.createLinearGradient(0, 0, 512, 256);
      gradient.addColorStop(0, '#1e40af'); // Ocean blue
      gradient.addColorStop(0.3, '#059669'); // Land green
      gradient.addColorStop(0.6, '#d97706'); // Desert orange
      gradient.addColorStop(0.8, '#1e40af'); // Ocean blue
      gradient.addColorStop(1, '#1e40af'); // Ocean blue
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 512, 256);
      
      // Add some land masses (simplified)
      context.fillStyle = '#22c55e';
      context.fillRect(100, 80, 120, 60);
      context.fillRect(300, 100, 100, 80);
      context.fillRect(50, 160, 80, 40);
      context.fillRect(400, 50, 60, 100);
    }
    
    return new THREE.CanvasTexture(canvas);
  };

  const earthTexture = createEarthTexture();

  useFrame((state) => {
    if (meshRef.current) {
      // Slow rotation for the earth
      meshRef.current.rotation.y += 0.002;
    }
    
    if (compassArrowRef.current && heading !== null) {
      // Update compass arrow based on device heading
      compassArrowRef.current.rotation.y = THREE.MathUtils.degToRad(-heading);
    }
  });

  return (
    <group>
      {/* Earth sphere */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2, 32, 32]} />
        <meshPhongMaterial map={earthTexture} />
      </mesh>
      
      {/* Compass arrow on top of the globe */}
      <group ref={compassArrowRef} position={[0, 2.5, 0]}>
        <mesh>
          <coneGeometry args={[0.1, 0.4, 8]} />
          <meshPhongMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
          <meshPhongMaterial color="#ef4444" />
        </mesh>
      </group>

      {/* Orbit rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.01, 16, 100]} />
        <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, Math.PI / 4]}>
        <torusGeometry args={[2.4, 0.01, 16, 100]} />
        <meshBasicMaterial color="#3b82f6" opacity={0.2} transparent />
      </mesh>
    </group>
  );
};

interface GlobeProps {
  heading: number | null;
}

const Globe: React.FC<GlobeProps> = ({ heading }) => {
  return (
    <div className="w-full h-96 rounded-xl overflow-hidden bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 relative">
      <Canvas
        camera={{ position: [5, 2, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade />
        
        <EarthSphere heading={heading} />
        
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={4}
          maxDistance={10}
          autoRotate={false}
        />
      </Canvas>
      
      {/* Heading overlay */}
      {heading !== null && (
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
          <div className="text-sm font-medium">Direção</div>
          <div className="text-lg font-bold">{Math.round(heading)}°</div>
        </div>
      )}
    </div>
  );
};

export default Globe;