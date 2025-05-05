import { useState, useRef, Suspense, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

// Highly optimized Stars component with memory management
const StarsPoints = ({ count = 500 }) => { // Reduced count for mobile
  const ref = useRef();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if device is mobile on mount
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Generate stars only once with useMemo and appropriate size based on device
  const sphere = useMemo(() => {
    // Reduce count significantly for mobile
    const adjustedCount = isMobile ? Math.min(250, count) : count;
    return random.inSphere(new Float32Array(adjustedCount * 3), { radius: 1.2 });
  }, [count, isMobile]);
  
  // Use a more efficient animation loop with rate limiting
  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Only update every other frame on mobile for better performance
    if (isMobile && state.clock.elapsedTime % 2 < 1) return;
    
    // Use smaller rotation values for more subtle effect
    ref.current.rotation.x -= delta * 0.01;
    ref.current.rotation.y -= delta * 0.01;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points 
        ref={ref} 
        positions={sphere} 
        stride={3} 
        frustumCulled={true}
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

// Main component with comprehensive fallbacks
const StarsCanvas = () => {
  const [canRender, setCanRender] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    // Check for WebGL support
    const hasWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
          (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    };
    
    // Check device capabilities
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Only render stars on non-mobile devices with WebGL support
      const shouldRender = hasWebGL() && !mobile;
      setCanRender(shouldRender);
    };
    
    // Check device on mount
    checkDevice();
    
    // Listen for resize events
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  // Don't render anything on mobile
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[-1] static-stars-bg">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)]" 
             style={{backgroundSize: "20px 20px"}}></div>
      </div>
    );
  }
  
  // Don't render if WebGL isn't supported
  if (!canRender) {
    return (
      <div className="fixed inset-0 z-[-1] static-stars-bg">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)]" 
             style={{backgroundSize: "30px 30px"}}></div>
      </div>
    );
  }
  
  return (
    <div className='w-full h-full fixed inset-0 z-[-1] pointer-events-none'>
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        dpr={[0.5, 1.5]} // Lower resolution for better performance
        frameloop="demand" // Only render when needed
        gl={{ 
          powerPreference: "default", 
          antialias: false, 
          stencil: false,
          depth: false
        }}
      >
        <Suspense fallback={null}>
          <StarsPoints />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;