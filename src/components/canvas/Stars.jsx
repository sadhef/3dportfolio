"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

const Stars = ({ count = 10000 }) => {
  const ref = useRef();
  
  // Create stars only once using useMemo for performance
  const sphere = useMemo(() => {
    return random.inSphere(new Float32Array(count * 3), { radius: 1.5 });
  }, [count]);
  
  // Slow, smooth rotation for the star field
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x -= 0.0005;
      ref.current.rotation.y -= 0.00015;
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

const StarsCanvas = () => {
  return (
    <div className="w-full h-full fixed inset-0 z-[-1]">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
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