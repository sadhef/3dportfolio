// src/components/canvas/Stars.jsx - Performance optimized
import { useState, useRef, Suspense, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";

// Highly optimized Stars component with performance tiers
const StarsPoints = ({ density = 'medium' }) => { 
  const ref = useRef();
  
  // Determine star count based on density parameter
  const getStarCount = (densityLevel) => {
    switch (densityLevel) {
      case 'ultra-low': return 100;
      case 'low': return 200;
      case 'medium': return 500;
      case 'high': return 1000;
      default: return 500;
    }
  };
  
  const count = getStarCount(density);
  
  // Generate stars only once with useMemo
  const sphere = useMemo(() => {
    return random.inSphere(new Float32Array(count * 3), { radius: 1.2 });
  }, [count]);
  
  // Optimize animation by calculating frame skips
  const frameCount = useRef(0);
  const frameSkip = useMemo(() => {
    // Skip more frames for lower density (already optimized setup)
    return density === 'high' ? 1 : density === 'medium' ? 2 : 3;
  }, [density]);
  
  // Optimized animation loop with frame skipping
  useFrame((state) => {
    frameCount.current += 1;
    
    // Skip frames based on performance tier
    if (frameCount.current % frameSkip !== 0) return;
    
    if (ref.current) {
      // Reduced rotation values for better performance
      ref.current.rotation.x -= 0.0002;
      ref.current.rotation.y -= 0.0002;
    }
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
const StarsCanvas = ({ density = 'medium' }) => {
  const [canRender, setCanRender] = useState(false);
  
  // Use a static fallback for browsers without WebGL
  const StaticStarsFallback = () => (
    <div className="fixed inset-0 z-[-1] static-stars-bg">
      <div className="absolute inset-0 bg-black"></div>
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)]" 
           style={{backgroundSize: "30px 30px"}}></div>
    </div>
  );
  
  useEffect(() => {
    // Check for WebGL support with proper capabilities
    const hasGoodWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) return false;
        
        // Check for minimum texture size capability
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        
        // Only render if we have decent texture support
        return maxTextureSize >= 2048;
      } catch (e) {
        return false;
      }
    };
    
    // Check if we should render stars based on device capabilities
    const checkRenderCapability = () => {
      // Get the globally set performance profile or calculate basic version
      const performanceProfile = window.performanceProfile || {
        performanceTier: hasGoodWebGL() ? 2 : 1,
        reduceMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false
      };
      
      // Only render stars on devices with decent WebGL support and no motion preferences
      const shouldRender = 
        performanceProfile.performanceTier >= 2 && 
        !performanceProfile.reduceMotion;
      
      setCanRender(shouldRender);
    };
    
    // Check device on mount
    checkRenderCapability();
  }, []);
  
  // Return static background if we can't render WebGL stars
  if (!canRender) {
    return <StaticStarsFallback />;
  }
  
  return (
    <div className='w-full h-full fixed inset-0 z-[-1] pointer-events-none'>
      <Canvas 
        camera={{ position: [0, 0, 1] }}
        dpr={[0.5, 1.0]} // Lower resolution for better performance
        frameloop="demand" // Only render when needed
        gl={{ 
          powerPreference: "default", 
          antialias: false, 
          stencil: false,
          depth: false,
          alpha: true
        }}
        style={{ background: '#000' }}
      >
        <Suspense fallback={null}>
          <StarsPoints density={density} />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;