"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";

import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

// Premium animated background particles
const FloatingParticle = ({ delay }) => {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-30"
      initial={{ x: Math.random() * window.innerWidth, y: window.innerHeight + 10 }}
      animate={{
        x: Math.random() * window.innerWidth,
        y: -10,
      }}
      transition={{
        duration: Math.random() * 10 + 15,
        delay: delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

// Enhanced TechIcon with premium interactions while maintaining original performance features
const TechIcon = ({ icon, name, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  const iconRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);
  
  // Use Intersection Observer to only render when visible (preserving original logic)
  useEffect(() => {
    if (typeof window === 'undefined' || !iconRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observer.observe(iconRef.current);
    return () => observer.disconnect();
  }, []);
  
  const handleMouseMove = (e) => {
    if (!iconRef.current) return;
    const rect = iconRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  // Simplified animation for better performance (preserving original concept)
  const animations = {
    initial: { opacity: 0, y: 20, scale: 0.9 },
    animate: isVisible ? { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.3, 
        delay: index * 0.05,
        type: "spring",
        bounce: 0.3
      }
    } : { opacity: 0 }
  };

  return (
    <motion.div 
      ref={iconRef}
      className="flex flex-col items-center m-3 relative group cursor-pointer"
      {...animations}
      whileHover={{ 
        scale: 1.1, 
        y: -10,
        transition: { duration: 0.3, type: "spring", bounce: 0.6 }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        mouseX.set(0);
        mouseY.set(0);
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
    >
      {isInView ? (
        <>
          {/* Glow effect background */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(circle at center, rgba(59, 130, 246, 0.3), rgba(147, 51, 234, 0.3), transparent 70%)`,
              filter: "blur(20px)",
              transform: "scale(1.8)"
            }}
          />
          
          {/* Enhanced main container */}
          <motion.div 
            className="w-20 h-20 rounded-full backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-2xl flex items-center justify-center mb-2 relative overflow-hidden"
            style={{
              boxShadow: isHovered 
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                : "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
            }}
          >
            {/* Animated gradient overlay */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
              style={{
                background: "linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981)",
                backgroundSize: "300% 300%"
              }}
              animate={{
                backgroundPosition: isHovered ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%"
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Icon with enhanced effects */}
            <motion.div 
              className="relative w-12 h-12 z-10"
              animate={{
                rotate: isHovered ? 360 : 0
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut"
              }}
            >
              <Image 
                src={icon} 
                alt={`${name} icon`}
                fill
                sizes="(max-width: 768px) 48px, 48px"
                className="object-contain drop-shadow-lg"
                priority={index < 6} // Only prioritize first few icons
              />
            </motion.div>
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
              animate={{
                x: isHovered ? ["-100%", "100%"] : "-100%"
              }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
                repeat: isHovered ? Infinity : 0,
                repeatDelay: 0.5
              }}
              style={{
                transform: "skewX(-20deg)"
              }}
            />
          </motion.div>
          
          {/* Enhanced text */}
          <motion.p 
            className="text-sm text-white-100 text-center font-light"
            animate={{
              color: isHovered ? "#60a5fa" : "#ffffff"
            }}
            transition={{ duration: 0.3 }}
          >
            {name}
          </motion.p>
          
          {/* Floating reflection */}
          <motion.div
            className="absolute top-full left-1/2 transform -translate-x-1/2 w-16 h-8 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
            style={{
              background: "linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)",
              filter: "blur(8px)",
              borderRadius: "50%"
            }}
          />
        </>
      ) : (
        // Placeholder while loading (preserving original)
        <div className="w-20 h-20 rounded-full bg-gray-800 animate-pulse"></div>
      )}
    </motion.div>
  );
};

// Main Tech component with enhanced visuals while preserving original performance optimizations
const Tech = () => {
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  // Progressive rendering for better performance (preserving original)
  const [visibleCount, setVisibleCount] = useState(6);
  
  // Use Intersection Observer to trigger animations and progressive loading (preserving original logic)
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");
          
          // Progressive loading of tech icons (preserving original timing)
          const timer = setInterval(() => {
            setVisibleCount(prev => {
              const newCount = prev + 3;
              if (newCount >= technologies.length) {
                clearInterval(timer);
                return technologies.length;
              }
              return newCount;
            });
          }, 200);
          
          return () => clearInterval(timer);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1
      }
    );
    
    observer.observe(sectionRef.current);
    
    return () => observer.unobserve(sectionRef.current);
  }, [controls]);
  
  // Only render the visible batch of icons (preserving original)
  const visibleTechnologies = useMemo(() => {
    return technologies.slice(0, visibleCount);
  }, [visibleCount]);
  
  return (
    <section 
      ref={sectionRef}
      className="relative py-10 overflow-hidden"
      aria-labelledby="tech-section-title"
      style={{
        background: "radial-gradient(ellipse at center, rgba(15, 23, 42, 0.1) 0%, rgba(2, 6, 23, 0.05) 50%, transparent 100%)"
      }}
    >
      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px"
        }}
      />
      
      {/* Enhanced title */}
      <motion.h2 
        id="tech-section-title" 
        className="text-center text-2xl font-bold mb-10 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
        style={{
          backgroundSize: "200% 200%"
        }}
      >
        Technologies
      </motion.h2>
      
      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.05 }
          }
        }}
        className="flex flex-wrap justify-center gap-5 mt-10"
      >
        {visibleTechnologies.map((technology, index) => (
          <TechIcon
            key={technology.name}
            icon={technology.icon}
            name={technology.name}
            index={index}
            isVisible={isVisible}
          />
        ))}
      </motion.div>
      
      {/* Enhanced loading indicator for remaining technologies */}
      {visibleCount < technologies.length && isVisible && (
        <motion.div 
          className="text-center mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="inline-flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default SectionWrapper(Tech, "");