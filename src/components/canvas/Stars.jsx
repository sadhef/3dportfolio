import { useState, useRef, Suspense, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

const Stars = (props) => {
  const ref = useRef();
  const isMobile = window.innerWidth < 768;
  
  // Use useMemo to generate star positions only once
  const sphere = useMemo(() => {
    // Drastically reduced star count for mobile
    const starCount = isMobile ? 800 : 1800;
    return random.inSphere(new Float32Array(starCount * 3), { radius: 1.2 });
  }, [isMobile]);

  // Drastically reduced animation frequency
  useFrame((state, delta) => {
    // Skip most frames for mobile - only update every 10th frame
    if (isMobile && Math.floor(state.clock.elapsedTime * 10) % 10 !== 0) return;
    
    if (ref.current) {
      // Even slower rotation
      ref.current.rotation.x -= delta / 80;
      ref.current.rotation.y -= delta / 100;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points 
        ref={ref} 
        positions={sphere} 
        stride={3} 
        frustumCulled
        {...props}
      >
        <PointMaterial
          transparent
          color='#f5f5f5'
          size={0.003}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

// Create a simplified version for mobile
const MobileStars = () => {
  return (
    <div className="fixed inset-0 z-[-1]">
      <div className="absolute inset-0 bg-[url('/src/assets/stars-bg.png')] bg-repeat opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
    </div>
  );
};

const StarsCanvas = () => {
  const [shouldRender, setShouldRender] = useState(false);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  // Skip heavy rendering for older mobile devices
  const isLowEndDevice = isMobile && (
    /iPhone\s(5|6|7|8|SE)|Android.*\s(4|5|6)\./i.test(navigator.userAgent)
  );
  
  // Delay stars rendering until after initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, isMobile ? 2500 : 1500); // Even longer delay for mobile
    
    return () => clearTimeout(timer);
  }, [isMobile]);
  
  // Don't render until we're ready, and use static version for low-end devices
  if (!shouldRender) return null;
  if (isLowEndDevice) return <MobileStars />;
  
  return (
    <div className='w-full h-full fixed inset-0 z-[-1] pointer-events-none stars-canvas'>
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        frameloop={isMobile ? "demand" : "always"}
        dpr={isMobile ? 0.5 : [0.5, 1]} // Lower resolution for mobile
        gl={{ 
          powerPreference: "low-power",
          antialias: false, 
          stencil: false,
          depth: false,
          alpha: true
        }}
        performance={{ min: isMobile ? 0.1 : 0.5 }}
      >
        <Suspense fallback={null}>
          <Stars />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;