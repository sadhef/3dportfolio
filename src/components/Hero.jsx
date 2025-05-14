"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Custom hook for mouse position tracking
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  return mousePosition;
};

// 3D Character component with parallax effect
const AnimatedCharacter = ({ character, index, mouseX, mouseY }) => {
  // Calculate movement based on mouse position
  const moveX = (mouseX / window.innerWidth - 0.5) * 10;
  const moveY = (mouseY / window.innerHeight - 0.5) * 10;
  
  // Different animation delay for each character
  const delay = index * 0.05;
  
  return (
    <motion.span
      className="relative inline-block text-white"
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        x: moveX * (index % 3) * 0.5, // Varying parallax intensity
        y: moveY * (index % 2) * 0.5,
        rotateY: moveX * 0.5,
        rotateX: -moveY * 0.5,
      }}
      transition={{
        delay: delay,
        duration: 0.5,
        ease: "easeOut",
        x: { duration: 0.1, ease: "linear" },
        y: { duration: 0.1, ease: "linear" },
      }}
      style={{
        textShadow: `${moveX * 0.5}px ${moveY * 0.5}px 5px rgba(0, 0, 0, 0.3)`,
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
      }}
    >
      {character}
    </motion.span>
  );
};

const Hero = () => {
  const { x, y } = useMousePosition();
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);
  const firstName = "Mohammed";
  const lastName = "Sadhef";
  
  // Role words that will animate in a typewriter effect
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const roles = ["Full Stack Developer", "MERN Specialist", "Python Developer"];
  
  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      );
    }
  }, []);
  
  useEffect(() => {
    if (prefersReducedMotion) return; // Skip animation if reduced motion is preferred
    
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
    }, isDeleting ? 50 : 100); // Type slower, delete faster
    
    return () => clearInterval(interval);
  }, [displayedText, isDeleting, roleIndex, roles, prefersReducedMotion]);
  
  // Observer for entry animation
  useEffect(() => {
    if (typeof window === 'undefined' || !heroRef.current) return;
    
    setIsVisible(true); // Immediately visible for better user experience
  }, []);

  return (
    <section 
      ref={heroRef}
      id="home"
      className="relative w-full h-screen mx-auto overflow-hidden flex items-center"
      aria-label="Introduction - Mohammed Sadhef, Full Stack Developer"
    >
      {/* Animated background dots - only if reduced motion is not preferred */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-20"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight 
              }}
              animate={{ 
                x: [
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                  Math.random() * window.innerWidth,
                ],
                y: [
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                  Math.random() * window.innerHeight,
                ],
              }}
              transition={{ 
                duration: 20 + Math.random() * 30, 
                repeat: Infinity,
                ease: "linear" 
              }}
            />
          ))}
        </div>
      )}
      
      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-16 text-center flex flex-col items-center">
        {/* Animated title */}
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
                mouseX={prefersReducedMotion ? 0 : x} 
                mouseY={prefersReducedMotion ? 0 : y} 
              />
            ))}
          </div>
          <span className="sm:hidden"><br /></span>
          <span className="hidden sm:inline">&nbsp;</span>
          {/* Last name with 3D effect */}
          <div className="inline-block">
            {lastName.split("").map((char, index) => (
              <AnimatedCharacter 
                key={`last-${index}`}
                character={char} 
                index={index + firstName.length} 
                mouseX={prefersReducedMotion ? 0 : x} 
                mouseY={prefersReducedMotion ? 0 : y}
              />
            ))}
          </div>
        </h1>
        
        {/* Animated role text (typewriter effect) */}
        <motion.div
          className="h-8 my-4 sm:my-6 text-white text-lg sm:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="font-light">I'm a </span>
          <span className="text-white font-bold relative">
            {prefersReducedMotion ? roles[0] : displayedText}
            {!prefersReducedMotion && (
              <span className="absolute right-0 top-0 h-full w-1 bg-white animate-blink"></span>
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
        
        {/* Call to action buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-4 sm:mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ delay: 1 }}
        >
          <motion.a
            href="#projects"
            className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-black font-medium rounded-full shadow-lg text-sm sm:text-base"
            whileHover={{ scale: 1.05, backgroundColor: "#f0f0f0" }}
            whileTap={{ scale: 0.98 }}
          >
            View Projects
          </motion.a>
          
          <motion.a
            href="#contact"
            className="px-6 sm:px-8 py-2 sm:py-3 border border-white text-white font-medium rounded-full text-sm sm:text-base"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            Contact Me
          </motion.a>
        </motion.div>
        
        {/* Tech tags */}
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
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
        
        {/* Scroll indicator */}
        {!prefersReducedMotion && (
          <motion.div
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: [0, 1, 0], y: [0, 10, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              delay: 2 
            }}
          >
            <div className="w-5 h-10 border-2 border-white rounded-full flex justify-center items-start p-2">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ 
                  repeat: Infinity,
                  duration: 1.5
                }}
                className="w-1 h-1 bg-white rounded-full"
              />
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Dynamic lighting effect that follows mouse - only if reduced motion is not preferred */}
      {!prefersReducedMotion && (
        <div 
          className="pointer-events-none absolute w-full h-full top-0 left-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${x}px ${y}px, transparent 0%, rgba(0,0,0,0.8) 70%)`,
          }}
        />
      )}
      
      {/* Add a stylized custom CSS animation */}
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        .text-5xl {
          font-size: 3rem;
          line-height: 1;
        }
        
        @media (max-width: 640px) {
          .text-5xl {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;