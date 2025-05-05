import { useState, useRef, Suspense, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

// Highly optimized Stars component with memory management
const StarsPoints = ({ count = 1000, depth = 50 }) => {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(true);
  
  // Generate stars only once with useMemo and appropriate size based on device
  const sphere = useMemo(() => {
    // Detect device capabilities
    const isLowEnd = navigator.hardwareConcurrency <= 4 || 
                     /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Adjust count based on device capabilities
    const adjustedCount = isLowEnd ? Math.floor(count * 0.5) : count;
    
    return random.inSphere(new Float32Array(adjustedCount * 3), { radius: 1.2 });
  }, [count]);
  
  // Throttle animation frames for better performance
  useFrame((state, delta) => {
    // Skip frames based on delta to maintain consistent speed across devices
    if (!ref.current || delta > 0.1) return;
    
    ref.current.rotation.x -= delta * 0.02; // Slow rotation
    ref.current.rotation.y -= delta * 0.03;
  });

  // Visibility observer for performance
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    const container = document.querySelector('.stars-canvas-container');
    if (container) {
      observer.observe(container);
    }
    
    return () => {
      if (container) {
        observer.unobserve(container);
      }
    };
  }, []);
  
  // Don't render if not visible
  if (!isVisible) return null;

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points 
        ref={ref} 
        positions={sphere} 
        stride={3} 
        frustumCulled={true}
        // Only update when necessary
        matrixAutoUpdate={false}
        onAfterRender={(renderer) => {
          ref.current.updateMatrix();
        }}
      >
        <PointMaterial
          transparent
          color='#f5f5f5'
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false}
          toneMapped={false} // Better performance
        />
      </Points>
    </group>
  );
};

// WebGL detector
const hasWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
};

// Main component with comprehensive fallbacks
const StarsCanvas = () => {
  const [webGLSupported] = useState(hasWebGL());
  const [loaded, setLoaded] = useState(false);
  const [hasReducedMotion] = useState(
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
  
  useEffect(() => {
    // Only load stars after critical content is rendered
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Don't render anything if user prefers reduced motion
  if (hasReducedMotion) {
    return (
      <div className="fixed inset-0 z-[-1] static-stars-bg">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)]" 
             style={{backgroundSize: "40px 40px"}}></div>
      </div>
    );
  }
  
  // Static fallback if WebGL not supported
  if (!webGLSupported) {
    return (
      <div className="fixed inset-0 z-[-1] static-stars-bg">
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)]" 
             style={{backgroundSize: "40px 40px"}}></div>
      </div>
    );
  }
  
  // Don't render until ready
  if (!loaded) return null;
  
  return (
    <div className='w-full h-full fixed inset-0 z-[-1] pointer-events-none stars-canvas-container'>
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        dpr={[0.6, 1.5]} // Dynamic resolution based on device
        frameloop="demand" // Only render when needed
        gl={{ 
          powerPreference: "default", 
          antialias: false, 
          stencil: false,
          depth: false,
          alpha: true,
        }}
        style={{ background: 'transparent' }}
        performance={{ min: 0.5 }} // Allow performance scaling
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