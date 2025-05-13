// src/components/canvas/Earth.jsx
import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../Loader";

const Earth = () => {
  const [mounted, setMounted] = useState(false);
  const earth = useGLTF("./planet/scene.gltf");
  const earthRef = useRef();

  useEffect(() => {
    setMounted(true);
    
    // Apply black and white shader material to all meshes in the model
    if (earth && earth.scene) {
      earth.scene.traverse((child) => {
        if (child.isMesh) {
          // Create a black and white shader material
          const material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.5,
            roughness: 0.5,
          });
          
          child.material = material;
        }
      });
    }
  }, [earth]);

  // Slow rotation
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  if (!mounted) return null;

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
      <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
    </mesh>
  );
};

const EarthCanvas = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) {
    return <StaticEarthImage />;
  }

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

// Static fallback component in case 3D fails
export const StaticEarthImage = () => (
  <div className="w-full h-full flex items-center justify-center">
    <img 
      src="./desktop_pc/static-computer.png" 
      alt="Earth" 
      className="max-w-full max-h-full object-contain filter grayscale"
    />
  </div>
);

export default EarthCanvas;