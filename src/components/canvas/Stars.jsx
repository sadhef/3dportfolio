import { useState, useRef, Suspense, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

// Simplified Stars component that works reliably across browsers
const Stars = () => {
  const ref = useRef();
  
  // Detect mobile for performance optimization
  const isMobile = window.innerWidth < 768;
  
  // Generate stars only once with useMemo
  const sphere = useMemo(() => {
    // Reduce star count for better performance
    const starCount = isMobile ? 1000 : 1500;
    return random.inSphere(new Float32Array(starCount * 3), { radius: 1.2 });
  }, [isMobile]);

  // Simplified animation logic
  useFrame((state, delta) => {
    // Skip frames on mobile for better performance
    if (isMobile && state.clock.elapsedTime % 2 > 0) return;
    
    if (ref.current) {
      // Simple slow rotation
      ref.current.rotation.x -= delta / 50;
      ref.current.rotation.y -= delta / 75;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points 
        ref={ref} 
        positions={sphere} 
        stride={3} 
        frustumCulled
      >
        <PointMaterial
          transparent
          color='#f5f5f5'
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

// Main component with fallback
const StarsCanvas = () => {
  const [canvasSupported, setCanvasSupported] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Check for proper WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    // Set canvas support flag
    setCanvasSupported(!!gl);
    
    // Delay stars rendering to prioritize main content
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Don't render until ready
  if (!isLoaded) return null;
  
  // Use static fallback if WebGL not supported
  if (!canvasSupported) {
    return (
      <div className="fixed inset-0 z-[-1] static-stars-bg">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 opacity-30 stars-pattern"></div>
      </div>
    );
  }
  
  return (
    <div className='w-full h-full fixed inset-0 z-[-1] pointer-events-none universal-stars'>
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        style={{ background: 'black' }}
        frameloop="demand"
        dpr={[0.5, 1]} // Lower resolution for performance
        gl={{ 
          powerPreference: "default", 
          antialias: false, 
          stencil: false,
          depth: false
        }}
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