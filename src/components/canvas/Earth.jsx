"use client";

import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload } from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../Loader";
import { useModelLoader, MODEL_PATHS } from "@/utils/model-loader";

const Earth = () => {
  const earthRef = useRef();
  const { scene, isLoaded } = useModelLoader(MODEL_PATHS.EARTH);


  // Slow rotation
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  if (!isLoaded) return null;

  return (
    <mesh ref={earthRef}>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive object={scene} scale={2.5} position-y={0} rotation-y={0} />
    </mesh>
  );
};

const EarthCanvas = () => {
  return (
    <Canvas
      shadows
      frameloop='demand'
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [-4, 3, 6],
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

// Preload models
export const preloadEarthModel = () => {
  if (typeof window !== 'undefined') {
    // This will be called on the client side only
    import('@/utils/model-loader').then(({ preloadModels, MODEL_PATHS }) => {
      preloadModels([MODEL_PATHS.EARTH]);
    });
  }
};

export default EarthCanvas;