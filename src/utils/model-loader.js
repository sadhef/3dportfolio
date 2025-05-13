"use client";

import { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';

// Custom hook for safely loading 3D models in Next.js
export const useModelLoader = (modelPath) => {
  const [isClient, setIsClient] = useState(false);
  const [loadError, setLoadError] = useState(null);
  
  // Only load models on the client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Only attempt to load the model when we're on the client
  const { scene, nodes, materials, animations } = isClient 
    ? useGLTF(modelPath, undefined, (e) => setLoadError(e))
    : { scene: null, nodes: null, materials: null, animations: null };
  
  return {
    scene,
    nodes,
    materials,
    animations,
    isLoaded: isClient && !!scene && !loadError,
    loadError
  };
};

// Preload all models - can be called from components 
export const preloadModels = (modelPaths) => {
  if (typeof window === 'undefined') return;
  modelPaths.forEach(path => useGLTF.preload(path));
};

// Export model paths as constants for consistency
export const MODEL_PATHS = {
  DESKTOP_PC: "/desktop_pc/scene.gltf",
  EARTH: "/planet/scene.gltf"
};