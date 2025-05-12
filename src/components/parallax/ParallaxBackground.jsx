import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const ParallaxBackground = ({ children, layers = 3, mobileDisabled = true }) => {
  const containerRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [clientHeight, setClientHeight] = useState(0);
  
  // Handle device and preference detection
  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Check if device is mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      setClientHeight(window.innerHeight);
    };
    
    // Run initial checks
    checkMobile();
    
    // Set up listeners
    const handleReducedMotionChange = (e) => setPrefersReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleReducedMotionChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleReducedMotionChange);
    }
    
    window.addEventListener("resize", checkMobile);
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleReducedMotionChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleReducedMotionChange);
      }
      window.removeEventListener("resize", checkMobile);
    };
  }, []);
  
  // Should disable parallax effects?
  const disableEffects = prefersReducedMotion || (mobileDisabled && isMobile);
  
  // Function to create background layers with different parallax speeds
  const renderLayers = () => {
    if (disableEffects) {
      // Return simplified background for disabled effects
      return (
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-black" />
          <div 
            className="absolute inset-0"
            style={{
              opacity: 0.05,
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />
        </div>
      );
    }
    
    // Otherwise, create multiple layers with different properties
    return Array.from({ length: layers }).map((_, index) => {
      // Calculate properties for this layer
      const opacity = 0.05 + (index * 0.01);
      const size = 30 - (index * 5);
      const speed = 0.2 + (index * 0.1);
      
      return (
        <motion.div
          key={`bg-layer-${index}`}
          className="absolute inset-0 w-full h-full"
          animate={{ 
            y: [0, speed * 10, 0],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 8 + index * 4,
            ease: "easeInOut"
          }}
          style={{
            zIndex: -100 + index,
            opacity: opacity,
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,${opacity}) 1px, transparent 1px)`,
            backgroundSize: `${size}px ${size}px`,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        />
      );
    });
  };
  
  return (
    <div ref={containerRef} className="relative w-full">
      {/* Parallax Background Layers */}
      <div className="fixed inset-0 bg-black -z-50">
        {renderLayers()}
      </div>
      
      {/* Main Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default ParallaxBackground;