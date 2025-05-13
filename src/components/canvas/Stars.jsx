"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

const Stars = ({ count = 1000 }) => {
  const ref = useRef();
  
  // Create stars only once
  const sphere = useMemo(() => {
    return random.inSphere(new Float32Array(count * 3), { radius: 1.2 });
  }, [count]);
  
  // Optimized frame handling
  const frameCount = useRef(0);
  
  useFrame(() => {
    frameCount.current += 1;
    if (frameCount.current % 2 !== 0) return;
    
    if (ref.current) {
      ref.current.rotation.x -= 0.0001;
      ref.current.rotation.y -= 0.0001;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled>
        <PointMaterial
          transparent
          color="#f5f5f5"
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

// Create a static fallback for low-end devices
const StaticStarsBg = () => (
  <div className="fixed inset-0 z-[-1] bg-black">
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)]" 
         style={{backgroundSize: "20px 20px"}}></div>
  </div>
);

const StarsCanvas = () => {
  const [shouldRender3D, setShouldRender3D] = useState(true);
  
  useEffect(() => {
    // Check device capabilities
    const checkCapabilities = () => {
      const isLowEndDevice = 
        (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      const prefersReducedMotion = 
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      setShouldRender3D(!isLowEndDevice && !prefersReducedMotion);
    };
    
    if (typeof window !== 'undefined') {
      checkCapabilities();
      
      // Listen for changes
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleMediaChange = (e) => setShouldRender3D(!e.matches);
      mediaQuery.addEventListener('change', handleMediaChange);
      
      return () => mediaQuery.removeEventListener('change', handleMediaChange);
    }
  }, []);

  if (!shouldRender3D) {
    return <StaticStarsBg />;
  }

  return (
    <div className="w-full h-full fixed inset-0 z-[-1]">
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        dpr={[0.5, 1.0]}
        gl={{ 
          powerPreference: "default",
          antialias: false,
          stencil: false,
          depth: false
        }}
      >
        <Stars />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;