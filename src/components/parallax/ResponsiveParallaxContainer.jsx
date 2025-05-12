import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * ResponsiveParallaxContainer - A flexible container that adds parallax scrolling effects
 * to its children, with responsive behavior and performance optimizations.
 */
const ResponsiveParallaxContainer = ({
  children,
  className = "",
  speed = 0.2, // Default parallax speed (0-1)
  direction = "vertical", // "vertical" or "horizontal"
  overflow = "hidden", // CSS overflow property
  as = "div", // HTML element to render
  maxOffset = 100, // Maximum pixel offset
  ease = [0.1, 0.25, 0.3, 1], // Easing function for smooth parallax
  disabled = false, // Manually disable parallax
  childrenAsLayer = false, // Treat children as parallax layer
  zIndex = 0,
  ...props // Additional props to pass to container
}) => {
  const containerRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [containerPosition, setContainerPosition] = useState({ top: 0, height: 0 });
  const [windowHeight, setWindowHeight] = useState(0);
  
  // Device and preference detection
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Check device type
    const checkDevice = () => {
      const isMobileDevice = window.innerWidth < 768 || 
                             /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
      setWindowHeight(window.innerHeight);
      
      // Update container position and dimensions
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerPosition({
          top: rect.top + window.scrollY,
          height: rect.height
        });
      }
    };
    
    // Initial check
    checkDevice();
    
    // Set up listeners
    window.addEventListener("resize", checkDevice);
    const motionListener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", motionListener);
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", checkDevice);
      mediaQuery.removeEventListener("change", motionListener);
    };
  }, []);
  
  // Parallax scrolling setup
  const { scrollY } = useScroll();
  
  // Should we disable parallax effects?
  const shouldDisableEffects = disabled || prefersReducedMotion || isMobile;
  
  // Calculate parallax transform
  const calculateTransform = () => {
    if (shouldDisableEffects) return { x: 0, y: 0 };
    
    // Calculate scroll boundaries
    const start = Math.max(0, containerPosition.top - windowHeight);
    const end = containerPosition.top + containerPosition.height;
    
    // Apply transforms based on direction
    if (direction === "horizontal") {
      const x = useTransform(
        scrollY,
        [start, end],
        [maxOffset * speed, -maxOffset * speed],
        { ease }
      );
      return { x, y: 0 };
    } else {
      const y = useTransform(
        scrollY,
        [start, end],
        [maxOffset * speed, -maxOffset * speed],
        { ease }
      );
      return { x: 0, y };
    }
  };
  
  const { x, y } = calculateTransform();
  
  // Create appropriate component based on 'as' prop
  const Component = motion[as] || motion.div;
  
  return (
    <Component
      ref={containerRef}
      className={`relative ${overflow === "hidden" ? "overflow-hidden" : ""} ${className}`}
      style={{ zIndex }}
      {...props}
    >
      {childrenAsLayer ? (
        <motion.div
          style={{ x: shouldDisableEffects ? 0 : x, y: shouldDisableEffects ? 0 : y }}
          className="w-full h-full"
          transition={{ type: "tween", ease, duration: 0.5 }}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </Component>
  );
};

export default ResponsiveParallaxContainer;