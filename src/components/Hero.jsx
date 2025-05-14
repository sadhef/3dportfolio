"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Safer animation calculation with fallbacks
const calculateMovement = (mouseX, mouseY, index, isClient) => {
  // Default values for server rendering
  const defaultWidth = 1920;
  const defaultHeight = 1080;
  
  // Get viewport dimensions (safely)
  const width = isClient ? window.innerWidth : defaultWidth;
  const height = isClient ? window.innerHeight : defaultHeight;
  
  // Calculate movement with fallbacks
  const moveX = mouseX ? (mouseX / width - 0.5) * 10 : 0;
  const moveY = mouseY ? (mouseY / height - 0.5) * 10 : 0;
  
  return {
    x: moveX * (index % 3) * 0.5,
    y: moveY * (index % 2) * 0.5,
    rotateY: moveX * 0.5, 
    rotateX: -moveY * 0.5,
    textShadow: `${moveX * 0.5}px ${moveY * 0.5}px 5px rgba(0, 0, 0, 0.3)`
  };
};

// 3D Character component with consistent parallax effect
const AnimatedCharacter = ({ character, index, mouseX, mouseY, isClient, animationEnabled }) => {
  // Calculate movement for each character
  const movement = calculateMovement(mouseX, mouseY, index, isClient);
  
  // Different animation delay for each character
  const delay = index * 0.05;
  
  return (
    <motion.span
      className="relative inline-block text-white"
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        // Only apply 3D effects if animations are enabled
        ...(animationEnabled ? {
          x: movement.x,
          y: movement.y,
          rotateY: movement.rotateY,
          rotateX: movement.rotateX,
        } : {})
      }}
      transition={{
        delay: delay,
        duration: 0.5,
        ease: "easeOut",
        x: { duration: 0.1, ease: "linear" },
        y: { duration: 0.1, ease: "linear" },
      }}
      style={{
        textShadow: animationEnabled ? movement.textShadow : '0px 2px 4px rgba(0, 0, 0, 0.3)',
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
      }}
    >
      {character}
    </motion.span>
  );
};

// Animation for floating dots with consistent behavior
const FloatingDots = ({ count = 25, isClient }) => {
  // Pre-compute random positions for consistency
  const randomPositions = useRef(Array.from({ length: count }, () => ({
    initialX: Math.random(),
    initialY: Math.random(),
    movementX: [Math.random(), Math.random(), Math.random()],
    movementY: [Math.random(), Math.random(), Math.random()],
    duration: 20 + Math.random() * 30
  }))).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {randomPositions.map((position, i) => {
        // Get viewport dimensions with fallbacks
        const width = isClient ? window.innerWidth : 1000;
        const height = isClient ? window.innerHeight : 800;
        
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            initial={{ 
              x: position.initialX * width, 
              y: position.initialY * height 
            }}
            animate={{ 
              x: [
                position.movementX[0] * width,
                position.movementX[1] * width,
                position.movementX[2] * width,
              ],
              y: [
                position.movementY[0] * height,
                position.movementY[1] * height,
                position.movementY[2] * height,
              ],
            }}
            transition={{ 
              duration: position.duration, 
              repeat: Infinity,
              ease: "linear" 
            }}
          />
        );
      })}
    </div>
  );
};

// Main Hero component with consistent animations across devices
const Hero = () => {
  // State for client detection & animation control
  const [isClient, setIsClient] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [isHighEndDevice, setIsHighEndDevice] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  
  // References & constants
  const heroRef = useRef(null);
  const firstName = "Mohammed";
  const lastName = "Sadhef";
  
  // Typewriter effect state
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const roles = ["Full Stack Developer", "MERN Specialist", "Python Developer"];
  
  // Initialize client-side functionality
  useEffect(() => {
    setIsClient(true);
    setIsVisible(true);
    
    // Performance detection - try to identify low-end devices
    const detectPerformance = () => {
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      
      // Simple device capability check
      const isLowEnd = 
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && 
        (navigator.deviceMemory < 4 || navigator.hardwareConcurrency < 4);
      
      // Set animation state based on device capability
      setAnimationEnabled(!prefersReducedMotion && !isLowEnd);
      setIsHighEndDevice(!isLowEnd);
    };
    
    // Mouse tracking with performance throttling
    let lastMoveTime = 0;
    const moveThreshold = isHighEndDevice ? 5 : 50; // ms threshold between updates
    
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastMoveTime > moveThreshold) {
        setMousePosition({
          x: e.clientX,
          y: e.clientY
        });
        lastMoveTime = now;
      }
    };
    
    // Set up event listeners
    detectPerformance();
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isHighEndDevice]);
  
  // Typewriter effect with performance considerations
  useEffect(() => {
    if (!isClient || !animationEnabled) return;
    
    const typingSpeed = isHighEndDevice ? 100 : 150; // slower on low-end devices
    const deletingSpeed = isHighEndDevice ? 50 : 80;
    
    const interval = setInterval(() => {
      const currentRole = roles[roleIndex];
      
      if (!isDeleting) {
        // Typing forward
        setDisplayedText(currentRole.substring(0, displayedText.length + 1));
        
        if (displayedText.length === currentRole.length) {
          // Finished typing, wait before deleting
          clearInterval(interval);
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        // Deleting
        setDisplayedText(currentRole.substring(0, displayedText.length - 1));
        
        if (displayedText.length === 0) {
          // Finished deleting, move to next role
          setIsDeleting(false);
          setRoleIndex((roleIndex + 1) % roles.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);
    
    return () => clearInterval(interval);
  }, [displayedText, isDeleting, roleIndex, roles, animationEnabled, isClient, isHighEndDevice]);

  return (
    <section 
      ref={heroRef}
      id="home"
      className="relative w-full h-screen mx-auto overflow-hidden flex items-center justify-center"
      aria-label="Introduction - Mohammed Sadhef, Full Stack Developer"
    >
      {/* Animated background - conditionally rendered but always present */}
      {isClient && <FloatingDots isClient={isClient} count={isHighEndDevice ? 25 : 15} />}
      
      {/* Main content wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-16 text-center flex flex-col items-center">
        {/* Welcome text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4 inline-block"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-8 bg-white mr-3 opacity-60" />
            <span className="text-white text-sm tracking-widest uppercase font-light">
              Welcome to my portfolio
            </span>
            <div className="h-px w-8 bg-white ml-3 opacity-60" />
          </div>
        </motion.div>
        
        {/* Name with 3D effect */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-2 tracking-tight leading-none">
          <div className="inline-block">
            {firstName.split("").map((char, index) => (
              <AnimatedCharacter 
                key={`first-${index}`}
                character={char} 
                index={index} 
                mouseX={mousePosition.x} 
                mouseY={mousePosition.y} 
                isClient={isClient}
                animationEnabled={animationEnabled}
              />
            ))}
          </div>
          <span className="sm:hidden"><br /></span>
          <span className="hidden sm:inline">&nbsp;</span>
          <div className="inline-block">
            {lastName.split("").map((char, index) => (
              <AnimatedCharacter 
                key={`last-${index}`}
                character={char} 
                index={index + firstName.length} 
                mouseX={mousePosition.x} 
                mouseY={mousePosition.y}
                isClient={isClient}
                animationEnabled={animationEnabled}
              />
            ))}
          </div>
        </h1>
        
        {/* Role text - with consistent typewriter effect */}
        <motion.div
          className="h-8 my-4 sm:my-6 text-white text-lg sm:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="font-light">I'm a </span>
          <span className="text-white font-bold relative">
            {!isClient || !animationEnabled ? roles[0] : displayedText}
            {isClient && animationEnabled && (
              <span className="absolute -right-1 top-0 h-full w-1 bg-white animate-blink"></span>
            )}
          </span>
        </motion.div>
        
        {/* Description */}
        <motion.p
          className="max-w-2xl mx-auto text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ delay: 0.8 }}
        >
          Specializing in creating modern web applications with MERN stack,
          Python, and JavaScript. Integrating AI solutions for innovative digital experiences.
        </motion.p>
        
        {/* CTA buttons with consistent hover effects */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-4 sm:mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ delay: 1 }}
        >
          <motion.a
            href="#projects"
            className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-black font-medium rounded-full shadow-lg text-sm sm:text-base"
            whileHover={animationEnabled ? { scale: 1.05, backgroundColor: "#f0f0f0" } : {}}
            whileTap={animationEnabled ? { scale: 0.98 } : {}}
          >
            View Projects
          </motion.a>
          
          <motion.a
            href="#contact"
            className="px-6 sm:px-8 py-2 sm:py-3 border border-white text-white font-medium rounded-full text-sm sm:text-base"
            whileHover={animationEnabled ? { scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" } : {}}
            whileTap={animationEnabled ? { scale: 0.98 } : {}}
          >
            Contact Me
          </motion.a>
        </motion.div>
        
        {/* Tech tags with simplified animations for consistency */}
        <motion.div
          className="flex flex-wrap justify-center gap-x-3 gap-y-2 sm:gap-x-4 mt-8 sm:mt-12 max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 1.2 }}
        >
          {["React", "Node.js", "MongoDB", "Express", "Python", "JavaScript", "Docker"].map((tech, index) => (
            <motion.span
              key={index}
              className="px-2 sm:px-3 py-1 bg-gray-800 bg-opacity-50 rounded-full text-xs sm:text-sm text-gray-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 + index * 0.1 }}
              whileHover={animationEnabled ? { scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" } : {}}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
        
        {/* Scroll indicator - optimized for performance */}
        {isClient && animationEnabled && (
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isHighEndDevice ? [0, 1, 0] : 1,
              y: isHighEndDevice ? [0, 10, 0] : 0
            }}
            transition={{ 
              repeat: isHighEndDevice ? Infinity : 0, 
              duration: 2,
              delay: 2 
            }}
          >
            <div className="w-5 h-10 border-2 border-white rounded-full flex justify-center items-start p-2">
              <motion.div
                animate={{ y: isHighEndDevice ? [0, 12, 0] : [0, 8, 0] }}
                transition={{ 
                  repeat: Infinity,
                  duration: isHighEndDevice ? 1.5 : 2
                }}
                className="w-1 h-1 bg-white rounded-full"
              />
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Dynamic lighting effect - optimized version */}
      {isClient && animationEnabled && isHighEndDevice && (
        <div 
          className="pointer-events-none absolute w-full h-full top-0 left-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, transparent 0%, rgba(0,0,0,0.8) 70%)`,
          }}
        />
      )}
      
      {/* Fallback lighting for lower-end devices */}
      {isClient && animationEnabled && !isHighEndDevice && (
        <div 
          className="pointer-events-none absolute w-full h-full top-0 left-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 30%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.8) 70%)`,
          }}
        />
      )}
      
      {/* Styles with better cross-browser compatibility */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        /* More stable text sizing */
        .text-5xl {
          font-size: 3rem;
          line-height: 1;
        }
        
        @media (max-width: 640px) {
          .text-5xl {
            font-size: 2.5rem;
          }
        }
        
        /* Fix for Safari */
        @supports (-webkit-touch-callout: none) {
          .hero-text {
            -webkit-text-fill-color: #ffffff;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;