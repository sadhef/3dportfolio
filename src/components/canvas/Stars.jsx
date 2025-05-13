// src/components/canvas/Stars.jsx
import { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

const Stars = ({ count = 1000 }) => {
  const ref = useRef();
  const { performanceTier } = window.deviceCapabilities || { performanceTier: 2 };
  
  // Reduce star count based on device performance
  const starCount = useMemo(() => {
    switch (performanceTier) {
      case 0: return Math.floor(count * 0.25);
      case 1: return Math.floor(count * 0.5);
      case 2: return Math.floor(count * 0.75);
      default: return count;
    }
  }, [count, performanceTier]);
  
  // Generate stars only once
  const sphere = useMemo(() => {
    return random.inSphere(new Float32Array(starCount * 3), { radius: 1.2 });
  }, [starCount]);
  
  // Optimized frame handling
  const frameCount = useRef(0);
  const frameSkip = performanceTier < 2 ? 3 : 1;
  
  useFrame(() => {
    frameCount.current += 1;
    if (frameCount.current % frameSkip !== 0) return;
    
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

// Static fallback for low-end devices
const StaticStarsBg = () => (
  <div className="fixed inset-0 z-[-1] bg-black">
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)]" 
         style={{backgroundSize: "20px 20px"}}></div>
  </div>
);

const StarsCanvas = () => {
  const [shouldRender3D, setShouldRender3D] = useState(false);
  const { performanceTier, prefersReducedMotion } = window.deviceCapabilities || { performanceTier: 2, prefersReducedMotion: false };
  
  useEffect(() => {
    // Only render 3D stars on capable devices
    setShouldRender3D(performanceTier >= 2 && !prefersReducedMotion);
  }, [performanceTier, prefersReducedMotion]);
  
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