"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

const Stars = ({ count = 200 }) => {
  const ref = useRef();
  
  // Create stars only once using useMemo for performance
  const sphere = useMemo(() => {
    return random.inSphere(new Float32Array(count * 3), { radius: 1.5 });
  }, [count]);
  
  // Slow, smooth rotation for the star field (no unnecessary re-renders)
  useFrame(() => {
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

const StarsCanvas = () => {
  // Reduce the number of renders in case the canvas is resized or if unnecessary re-renders are happening
  const resizeListener = useRef();

  useEffect(() => {
    // Optimized resize event listener to minimize performance loss due to resizing
    const handleResize = () => {
      const canvas = document.querySelector("canvas");
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="w-full h-full fixed inset-0 z-[-1]">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{
          antialias: false,  // Turn off anti-aliasing for performance
          powerPreference: "high-performance",
          stencil: false,
          depth: false,
          preserveDrawingBuffer: false, // Helps to improve performance (optional)
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000); // Set a dark background to improve performance
        }}
      >
        <Stars />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
