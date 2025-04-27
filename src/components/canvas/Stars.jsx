import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

const Stars = (props) => {
  const ref = useRef();
<<<<<<< HEAD
  // Significantly reduced star count from original 2500
  const [sphere] = useState(() => {
    // Check for mobile device to reduce stars even further
    const isMobile = window.innerWidth < 768;
    const starCount = isMobile ? 1200 : 2000; // Further reduced for mobile
    return random.inSphere(new Float32Array(starCount), { radius: 1.2 });
=======
  // Significantly reduced star count (2500 instead of 10000)
  const [sphere] = useState(() => random.inSphere(new Float32Array(2500), { radius: 1.5 }));

  // Reduce update frequency with throttling
  useFrame((state, delta) => {
    if (ref.current) {
      // Slower rotation speed to reduce CPU usage
      ref.current.rotation.x -= delta / 30;
      ref.current.rotation.y -= delta / 40;
    }
>>>>>>> 01c168e7088bcdcf53c803816d4c8d2a176e79c0
  });

  // Use a simple rotation with reduced frequency
  useFrame((state, delta) => {
    // Skip frames for better performance - only update every 3rd frame on mobile
    if (window.innerWidth < 768 && state.clock.elapsedTime % 3 > 0) return;
    
    if (ref.current) {
      // Much slower rotation to reduce CPU load
      ref.current.rotation.x -= delta / 50;
      ref.current.rotation.y -= delta / 70;
    }
  }, []);

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
<<<<<<< HEAD
          color='#f5f5f5'
          size={0.005}  // Slightly larger for visibility
=======
          color='#ffffff'
          size={0.004}  // Slightly larger to maintain visibility with fewer stars
>>>>>>> 01c168e7088bcdcf53c803816d4c8d2a176e79c0
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  const [shouldRender, setShouldRender] = useState(false);
  
  // Delay stars rendering until after initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 1500); // Delay stars rendering
    
    return () => clearTimeout(timer);
  }, []);
  
  // Don't render until we're ready
  if (!shouldRender) return null;
  
  return (
<<<<<<< HEAD
    <div className='w-full h-full fixed inset-0 z-[-1] pointer-events-none'>
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        style={{ background: 'linear-gradient(to bottom, #000000, #050505)' }}
        // Extreme performance optimizations
        frameloop="demand"
        dpr={[0.5, 1]} // Even lower resolution 
        gl={{ 
          powerPreference: "low-power", // Optimize for battery
          antialias: false, 
          stencil: false,
          depth: false,
          alpha: false // No transparency needed
        }}
        // Further reduce rendering quality if needed
        performance={{ min: 0.2 }}
=======
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
>>>>>>> 01c168e7088bcdcf53c803816d4c8d2a176e79c0
      >
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
<<<<<<< HEAD
        <Preload all />
=======
>>>>>>> 01c168e7088bcdcf53c803816d4c8d2a176e79c0
      </Canvas>
    </div>
  );
};

export default StarsCanvas;