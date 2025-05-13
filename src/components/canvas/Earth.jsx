// src/components/canvas/Earth.jsx - Performance optimized
import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../Loader";

// Get performance level from global settings or make conservative guess
const getPerformanceTier = () => {
  if (window.performanceProfile) {
    return window.performanceProfile.performanceTier;
  }
  
  // Fallback detection
  const isMobile = window.innerWidth < 768;
  const isLowEnd = 
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
    /low|mid/.test(navigator.userAgent.toLowerCase());
  
  if (isMobile || isLowEnd) return 1;
  return 2;
};

const Earth = ({ useSimpleRenderer = false }) => {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const earthRef = useRef();
  const performanceTier = getPerformanceTier();
  
  // Load higher or lower poly model based on device capability
  const modelPath = useSimpleRenderer || performanceTier < 2 
    ? "./planet/scene-optimized.gltf" // Lower poly count model
    : "./planet/scene.gltf";         // Regular model

  useEffect(() => {
    // Load model asynchronously
    const loadModel = async () => {
      try {
        const { scene } = await useGLTF.preload(modelPath);
        
        // Apply monochrome material to all meshes in the model
        scene.traverse((child) => {
          if (child.isMesh) {
            // Create a simpler material for better performance
            const material = new THREE.MeshStandardMaterial({
              color: 0xffffff,
              metalness: 0.3,  // Reduced from 0.5
              roughness: 0.7,  // Increased from 0.5 for better performance
              flatShading: performanceTier < 2 // Use flat shading on lower-end devices
            });
            
            // Simplify geometry if needed
            if (performanceTier < 2 && child.geometry) {
              // Reduce vertex count for better performance
              const simplifier = new THREE.BufferGeometryUtils.mergeVertices(child.geometry);
              child.geometry = simplifier;
            }
            
            child.material = material;
          }
        });
        
        setModel(scene);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading Earth model:", error);
        setIsLoading(false);
      }
    };
    
    loadModel();
  }, [modelPath, performanceTier]);

  // Use throttled rotation for better performance
  const lastUpdateTime = useRef(0);
  const updateInterval = performanceTier < 2 ? 100 : 16; // Milliseconds between updates

  useFrame((state) => {
    const currentTime = state.clock.getElapsedTime() * 1000;
    
    // Skip frames based on performance level
    if (currentTime - lastUpdateTime.current < updateInterval) return;
    
    if (earthRef.current) {
      // Use reduced rotation speed on low-end devices
      const rotationSpeed = performanceTier < 2 ? 0.0005 : 0.001;
      earthRef.current.rotation.y += rotationSpeed;
      lastUpdateTime.current = currentTime;
    }
  });

  if (isLoading) {
    return null;
  }

  return (
    <mesh ref={earthRef}>
      <hemisphereLight intensity={0.15} groundColor="black" />
      
      {/* Reduce light complexity for better performance */}
      {performanceTier >= 2 ? (
        <spotLight
          position={[-20, 50, 10]}
          angle={0.12}
          penumbra={1}
          intensity={1}
          castShadow={false} // Disable shadows for better performance
          shadow-mapSize={1024}
        />
      ) : (
        <directionalLight
          position={[-20, 50, 10]}
          intensity={0.8}
          castShadow={false}
        />
      )}
      
      <pointLight intensity={0.8} position={[0, 0, 5]} color="#ffffff" />
      
      {model && (
        <primitive 
          object={model} 
          scale={useSimpleRenderer ? 2.0 : 2.5}
          position-y={0} 
          rotation-y={0}
        />
      )}
    </mesh>
  );
};

const EarthCanvas = ({ useSimpleRenderer = false }) => {
  return (
    <Canvas
      shadows={false} // Disable shadows for better performance
      frameloop='demand'
      dpr={[0.5, 1.5]} // Adaptive resolution based on device
      gl={{ 
        preserveDrawingBuffer: true,
        powerPreference: "default",
        antialias: false, // Disable antialiasing for better performance
        stencil: false,
        depth: true,
        alpha: true
      }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
      style={{
        background: 'transparent'
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.5} // Slower rotation for smoother performance
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth useSimpleRenderer={useSimpleRenderer} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default EarthCanvas;