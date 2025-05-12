import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * ParallaxSectionWrapper - HOC (Higher Order Component) that adds parallax scrolling effects
 * to any section component with comprehensive responsive behavior.
 */
const ParallaxSectionWrapper = (Component, options = {}) => {
  // Default options
  const defaultOptions = {
    idName: "",
    className: "",
    speed: 0.2,
    direction: "up", // "up", "down", "left", "right"
    staggerChildren: 0.1,
    childrenDelay: 0.2,
    easing: [0.25, 0.1, 0.25, 1], // cubic-bezier
    overflow: "hidden",
    disableOnMobile: true,
    disableOnReducedMotion: true,
    zIndex: 0
  };
  
  // Merge provided options with defaults
  const mergedOptions = { ...defaultOptions, ...options };
  
  // Create the enhanced component
  const EnhancedComponent = (props) => {
    const sectionRef = useRef(null);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [sectionBounds, setSectionBounds] = useState({ top: 0, height: 0 });
    const [viewportHeight, setViewportHeight] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    
    // Device and preference detection
    useEffect(() => {
      // Check for reduced motion preference
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
      
      // Check device type and update measurements
      const updateMeasurements = () => {
        const isMobileDevice = window.innerWidth < 768;
        setIsMobile(isMobileDevice);
        setViewportHeight(window.innerHeight);
        
        if (sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          setSectionBounds({
            top: rect.top + window.scrollY,
            height: rect.height
          });
        }
      };
      
      // Set up intersection observer to detect when section is visible
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting);
        },
        { threshold: 0.1 }
      );
      
      if (sectionRef.current) {
        observer.observe(sectionRef.current);
      }
      
      // Run initial calculations
      updateMeasurements();
      
      // Set up event listeners
      window.addEventListener("resize", updateMeasurements);
      const motionListener = (e) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener("change", motionListener);
      
      // Clean up
      return () => {
        window.removeEventListener("resize", updateMeasurements);
        mediaQuery.removeEventListener("change", motionListener);
        if (sectionRef.current) {
          observer.unobserve(sectionRef.current);
        }
      };
    }, []);
    
    // Get scroll progress for this section
    const { scrollYProgress, scrollY } = useScroll({
      target: sectionRef,
      offset: ["start end", "end start"]
    });
    
    // Should parallax effects be disabled?
    const shouldDisableEffects = 
      (mergedOptions.disableOnMobile && isMobile) || 
      (mergedOptions.disableOnReducedMotion && prefersReducedMotion);
    
    // Calculate transform values based on direction
    const getOffsets = () => {
      const { direction, speed } = mergedOptions;
      const offset = Math.min(100, viewportHeight * speed * 0.15);
      
      switch (direction) {
        case "up":
          return { 
            start: offset,
            end: -offset,
            property: "y"
          };
        case "down":
          return { 
            start: -offset,
            end: offset,
            property: "y"
          };
        case "left":
          return { 
            start: offset,
            end: -offset,
            property: "x"
          };
        case "right":
          return { 
            start: -offset,
            end: offset,
            property: "x"
          };
        default:
          return { 
            start: offset,
            end: -offset,
            property: "y"
          };
      }
    };
    
    const { start, end, property } = getOffsets();
    
    // Create transform values
    const transformValue = useTransform(
      scrollYProgress,
      [0, 1],
      shouldDisableEffects ? [0, 0] : [start, end]
    );
    
    // Create opacity value for fade effect
    const opacityValue = useTransform(
      scrollYProgress,
      [0, 0.2, 0.8, 1],
      [0.6, 1, 1, 0.6]
    );
    
    // Style object for parallax effect
    const parallaxStyle = {
      ...(property === "y" ? { y: transformValue } : { x: transformValue }),
      opacity: shouldDisableEffects ? 1 : opacityValue,
      transition: {
        type: "tween",
        ease: mergedOptions.easing,
        duration: 0.5
      }
    };
    
    // Variants for staggered children animation
    const containerVariants = {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: mergedOptions.staggerChildren,
          delayChildren: mergedOptions.childrenDelay
        }
      }
    };
    
    return (
      <section
        ref={sectionRef}
        id={mergedOptions.idName}
        className={`relative ${mergedOptions.overflow === "hidden" ? "overflow-hidden" : ""} ${mergedOptions.className}`}
        style={{ zIndex: mergedOptions.zIndex }}
      >
        <span className="hash-span" id={mergedOptions.idName}>&nbsp;</span>
        
        <motion.div
          style={parallaxStyle}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          variants={containerVariants}
          className="w-full h-full"
        >
          <Component {...props} isVisible={isVisible} />
        </motion.div>
      </section>
    );
  };
  
  return EnhancedComponent;
};

export default ParallaxSectionWrapper;