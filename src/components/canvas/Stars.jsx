import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

const Stars = (props) => {
  const ref = useRef();
  // Significantly reduced star count (2500 instead of 10000)
  const [sphere] = useState(() => random.inSphere(new Float32Array(2500), { radius: 1.5 }));

  // Reduce update frequency with throttling
  useFrame((state, delta) => {
    if (ref.current) {
      // Slower rotation speed to reduce CPU usage
      ref.current.rotation.x -= delta / 30;
      ref.current.rotation.y -= delta / 40;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points 
        ref={ref} 
        positions={sphere} 
        stride={3} 
        frustumCulled={true} 
        {...props}
      >
        <PointMaterial
          transparent
          color='#ffffff'
          size={0.004}  // Slightly larger to maintain visibility with fewer stars
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  return (
    <div className='w-full h-full fixed inset-0 z-[-1]'>
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        style={{ background: 'linear-gradient(to bottom, #000000, #050505)' }}
        // Adding performance optimizations
        frameloop="demand"
        dpr={[1, 1.5]} // Lower resolution on high-DPI screens
        gl={{ 
          powerPreference: "high-performance",
          antialias: false, 
          stencil: false,
          depth: false 
        }}
        performance={{ min: 0.5 }} // Allow ThreeJS to optimize rendering
      >
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default StarsCanvas;