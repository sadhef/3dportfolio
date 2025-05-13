// src/components/canvas/Ball.jsx - Performance optimized
import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Decal,
  Float,
  OrbitControls,
  Preload,
  useTexture,
} from "@react-three/drei";

import CanvasLoader from "../Loader";

// Performance-optimized ball component
const Ball = (props) => {
  const [decal] = useTexture([props.imgUrl]);
  const meshRef = useRef();
  const performanceTier = window.performanceProfile?.performanceTier || 2;
  
  // Simplified sphere geometry for better performance
  const sphereDetail = performanceTier < 2 ? 1 : 2; // Lower detail for slower devices
  
  // Optimize frame rate for different devices
  const frameSkip = useRef(0);
  const frameSkipCount = performanceTier < 2 ? 3 : 1; // Skip more frames on lower-end devices
  
  // Manually handle rotation with optimized frame rate
  useFrame(() => {
    frameSkip.current += 1;
    
    // Skip frames based on performance tier
    if (frameSkip.current % frameSkipCount !== 0) return;
    
    if (meshRef.current) {
      // Reduce rotation speed for better performance
      const rotationSpeed = performanceTier < 2 ? 0.001 : 0.002;
      meshRef.current.rotation.x += rotationSpeed;
      meshRef.current.rotation.y += rotationSpeed;
    }
    
    // Reset frame counter to prevent overflow
    if (frameSkip.current > 10000) frameSkip.current = 0;
  });

  return (
    <mesh ref={meshRef} castShadow={false} receiveShadow={false} scale={2.5}>
      <icosahedronGeometry args={[1, sphereDetail]} />
      {/* Use MeshBasicMaterial for better performance */}
      <meshBasicMaterial
        color='#f8f8f8'
        polygonOffset
        polygonOffsetFactor={-5}
        flatShading
      />
      <Decal
        position={[0, 0, 1]}
        rotation={[2 * Math.PI, 0, 6.25]}
        scale={1}
        map={decal}
        flatShading
      />
    </mesh>
  );
};

// Main tech icon canvas component
const BallCanvas = ({ icon, useSimpleRenderer = false }) => {
  const [isMounted, setIsMounted] = useState(false);
  const performanceTier = window.performanceProfile?.performanceTier || 2;
  
  // Only render after component mounts to prevent SSR issues
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Use static image fallback for very low-end devices or simple renderer mode
  if (useSimpleRenderer || performanceTier < 1) {
    return (
      <div className="flex flex-col items-center justify-center w-28 h-28">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
          <img 
            src={icon} 
            alt="technology icon" 
            className="w-10 h-10 object-contain grayscale" 
          />
        </div>
      </div>
    );
  }
  
  // Don't render until mounted (prevents SSR issues)
  if (!isMounted) return null;

  return (
    <Canvas
      frameloop={performanceTier < 2 ? 'demand' : 'always'}
      dpr={[0.5, 1.0]} // Lower resolution
      gl={{ 
        powerPreference: "default",
        antialias: false,
        stencil: false,
        depth: false
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.3}
          autoRotate={false} // Disable auto rotation in favor of manual control
        />
        <Ball imgUrl={icon} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

// Static version for extremely low-end devices
export const StaticBallCanvas = ({ icon }) => (
  <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center">
    <img 
      src={icon} 
      alt="technology icon" 
      className="w-12 h-12 object-contain grayscale" 
    />
  </div>
);

export default BallCanvas;