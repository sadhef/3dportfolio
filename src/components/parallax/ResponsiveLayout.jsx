import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * ResponsiveLayout - A container component that optimizes layout for different devices
 * and enhances the viewing experience with subtle parallax effects.
 */
const ResponsiveLayout = ({ 
  children, 
  className = "",
  parallaxEnabled = true,
  maxWidth = "7xl", // Tailwind max-width class: sm, md, lg, xl, 2xl, etc.
  padding = true,
  centered = true,
  as = "div", // HTML element to render
  id = "",
  style = {},
  ...rest
}) => {
  const containerRef = useRef(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [containerInView, setContainerInView] = useState(false);
  
  // Device detection
  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Check device type
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    // Initial check
    checkDeviceType();
    
    // Set up intersection observer to detect when container is in view
    const observer = new IntersectionObserver(
      ([entry]) => {
        setContainerInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    // Set up listeners for changes
    window.addEventListener("resize", checkDeviceType);
    const motionListener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", motionListener);
    
    // Clean up
    return () => {
      window.removeEventListener("resize", checkDeviceType);
      mediaQuery.removeEventListener("change", motionListener);
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  
  // Set up parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Should parallax be disabled?
  const disableParallax = !parallaxEnabled || prefersReducedMotion || isMobile;
  
  // Create subtle parallax effect on scroll
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    disableParallax ? [0, 0] : [20, -20]
  );
  
  // Apply different styles based on device type
  const getResponsiveStyles = () => {
    let baseStyles = {
      maxWidth: maxWidth ? `var(--tw-${maxWidth})` : "none",
      margin: centered ? "0 auto" : "0",
      padding: padding ? (isMobile ? "1rem" : isTablet ? "1.5rem" : "2rem") : "0",
      ...style
    };
    
    // Apply device-specific optimizations
    if (isMobile) {
      baseStyles = {
        ...baseStyles,
        overflowX: "hidden", // Prevent horizontal scroll on mobile
      };
    }
    
    return baseStyles;
  };
  
  // Combine all class names
  const combinedClassNames = [
    className,
    maxWidth ? `max-w-${maxWidth}` : "",
    padding ? "px-4 sm:px-6 lg:px-8" : "",
    centered ? "mx-auto" : "",
  ].filter(Boolean).join(" ");
  
  // Create entry animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0,
      y: 30
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] // cubic-bezier
      }
    }
  };
  
  // Use the appropriate motion component
  const Component = motion[as] || motion.div;
  
  return (
    <Component
      ref={containerRef}
      id={id}
      className={`relative ${combinedClassNames}`}
      style={{
        ...getResponsiveStyles(),
        y: disableParallax ? 0 : y,
        willChange: disableParallax ? "auto" : "transform"
      }}
      initial="hidden"
      animate={containerInView ? "visible" : "hidden"}
      variants={containerVariants}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default ResponsiveLayout;