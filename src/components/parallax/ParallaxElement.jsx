import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// Utility component for creating parallax effects on any element
const ParallaxElement = ({
  children,
  className = '',
  offset = 100, // Amount of parallax movement
  direction = 'up', // 'up', 'down', 'left', 'right'
  scale = false, // Add scaling effect
  rotation = false, // Add rotation effect
  opacity = false, // Add opacity effect
  delay = 0, // Delay the effect
  easing = [0.42, 0, 0.58, 1], // Default easing
  disabled = false, // For mobile or reduced motion
  ...rest
}) => {
  const ref = useRef(null);
  const [elementTop, setElementTop] = useState(0);
  const [elementHeight, setElementHeight] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  
  // Detect if we should disable the effect
  const [shouldDisable, setShouldDisable] = useState(false);
  
  useEffect(() => {
    // Check for reduced motion preference and mobile devices
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    
    setShouldDisable(disabled || prefersReducedMotion || isMobile);
    
    // Update element measurements
    const element = ref.current;
    if (!element) return;
    
    const updateElementPosition = () => {
      const rect = element.getBoundingClientRect();
      setElementTop(rect.top + window.scrollY);
      setElementHeight(rect.height);
      setWindowHeight(window.innerHeight);
    };
    
    updateElementPosition();
    
    window.addEventListener('resize', updateElementPosition);
    return () => window.removeEventListener('resize', updateElementPosition);
  }, [disabled]);
  
  // Scroll tracking
  const { scrollY } = useScroll();
  
  // Calculate start and end points for the parallax effect
  const start = elementTop - windowHeight;
  const end = elementTop + elementHeight;
  
  // Create transform values based on direction
  const getTransformValues = () => {
    if (shouldDisable) return [0, 0];
    
    switch (direction) {
      case 'up':
        return [offset, -offset];
      case 'down':
        return [-offset, offset];
      case 'left':
        return [offset, -offset];
      case 'right':
        return [-offset, offset];
      default:
        return [0, 0];
    }
  };
  
  // Define transformations
  const y = useTransform(
    scrollY,
    [start, end],
    direction === 'up' || direction === 'down' ? getTransformValues() : [0, 0]
  );
  
  const x = useTransform(
    scrollY,
    [start, end],
    direction === 'left' || direction === 'right' ? getTransformValues() : [0, 0]
  );
  
  // Optional scaling effect
  const scaleValue = useTransform(
    scrollY,
    [start, end],
    scale ? [0.8, 1] : [1, 1]
  );
  
  // Optional rotation effect
  const rotateValue = useTransform(
    scrollY,
    [start, end],
    rotation ? [-5, 5] : [0, 0]
  );
  
  // Optional opacity effect
  const opacityValue = useTransform(
    scrollY,
    [start, end],
    opacity ? [0.5, 1] : [1, 1]
  );
  
  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y: shouldDisable ? 0 : y,
        x: shouldDisable ? 0 : x,
        scale: shouldDisable ? 1 : scaleValue,
        rotate: shouldDisable ? 0 : rotateValue,
        opacity: shouldDisable ? 1 : opacityValue,
        transition: {
          delay,
          ease: easing,
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxElement;