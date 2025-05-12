import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Reusable Parallax Section component
const ParallaxSection = ({ 
  children, 
  className = "", 
  speed = 0.5, // Speed of parallax effect (0-1)
  direction = "up", // "up", "down", "left", "right"
  zIndex = 0,
  disabled = false // For mobile or reduced motion preferences
}) => {
  const ref = useRef(null);
  const [elementTop, setElementTop] = useState(0);
  const [elementHeight, setElementHeight] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  
  // Update measurements on resize
  useEffect(() => {
    if (!ref.current) return;
    
    const handleResize = () => {
      if (ref.current) {
        const element = ref.current;
        const rect = element.getBoundingClientRect();
        setElementTop(rect.top + window.scrollY || window.pageYOffset);
        setElementHeight(rect.height);
        setClientHeight(window.innerHeight);
      }
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, [ref]);
  
  // Calculate the range for the parallax effect
  const { scrollY } = useScroll();
  
  // Calculate offset based on scroll position and speed
  const getRange = () => {
    const start = Math.max(0, elementTop - clientHeight);
    const end = elementTop + elementHeight;
    return [start, end];
  };
  
  // Get transform values based on direction
  const getTransformValues = () => {
    const range = elementHeight * speed;
    
    switch(direction) {
      case "up":
        return [range, -range];
      case "down":
        return [-range, range];
      case "left":
        return [range, -range];
      case "right":
        return [-range, range];
      default:
        return [range, -range];
    }
  };
  
  // Apply transform based on direction
  const transform = useTransform(
    scrollY, 
    getRange(), 
    getTransformValues()
  );
  
  const style = {
    position: "relative",
    zIndex,
    ...(direction === "up" || direction === "down" 
      ? { y: disabled ? 0 : transform } 
      : { x: disabled ? 0 : transform })
  };
  
  return (
    <motion.div 
      ref={ref}
      style={style}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxSection;