// src/components/Tech.jsx - Performance optimized
import React, { useState, useEffect, useMemo, useRef } from "react";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { motion, useAnimation } from "framer-motion";
import BallCanvas, { StaticBallCanvas } from "./canvas/Ball";

// Performance-optimized TechIcon component with lazy loading
const TechIcon = ({ icon, name, index, isVisible, useSimpleRenderer }) => {
  const [isInView, setIsInView] = useState(false);
  const iconRef = useRef(null);
  
  // Detect if device should use reduced motion
  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const performanceTier = window.performanceProfile?.performanceTier || 2;
  
  // Use intersection observer to only render visible items
  useEffect(() => {
    if (!iconRef.current) return;
    
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
  
  // Optimize animation based on device capabilities
  const animations = useMemo(() => {
    const shouldReduceMotion = prefersReducedMotion || performanceTier < 2;
    
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 0 },
        animate: isVisible ? { opacity: 1 } : { opacity: 0 },
        transition: { duration: 0.3, delay: index * 0.05 }
      };
    }
    
    return {
      initial: { opacity: 0, y: 10 },
      animate: isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
      transition: { duration: 0.5, delay: index * 0.1 }
    };
  }, [index, isVisible, prefersReducedMotion, performanceTier]);

  // Determine if we should use 3D or static rendering
  const shouldUseStatic = useSimpleRenderer || performanceTier < 2 || prefersReducedMotion;

  return (
    <motion.div 
      ref={iconRef}
      className="flex flex-col items-center m-3 w-28"
      {...animations}
    >
      {isInView ? (
        <>
          {shouldUseStatic ? (
            <StaticBallCanvas icon={icon} />
          ) : (
            <BallCanvas icon={icon} useSimpleRenderer={useSimpleRenderer} />
          )}
          <p className="text-sm text-white-100 text-center font-light mt-2">{name}</p>
        </>
      ) : (
        // Placeholder while loading
        <div className="w-20 h-20 rounded-full bg-gray-800 animate-pulse"></div>
      )}
    </motion.div>
  );
};

// Main Tech component with performance optimizations
const Tech = ({ useSimpleRenderer = false }) => {
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  // Progressive rendering for better performance
  const [visibleCount, setVisibleCount] = useState(6);
  const performanceTier = window.performanceProfile?.performanceTier || 2;
  
  // Calculate batch size based on performance tier
  const batchSize = performanceTier < 2 ? 3 : 6;
  
  // Use Intersection Observer to trigger animations and progressive loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");
          
          // Progressive loading of tech icons
          const timer = setInterval(() => {
            setVisibleCount(prev => {
              const newCount = prev + batchSize;
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
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [controls, batchSize]);
  
  // Only render the visible batch of icons
  const visibleTechnologies = useMemo(() => {
    return technologies.slice(0, visibleCount);
  }, [visibleCount]);
  
  return (
    <section 
      ref={sectionRef}
      className="relative py-10"
      aria-labelledby="tech-section-title"
    >
      <h2 
        id="tech-section-title" 
        className="text-center text-2xl font-bold mb-10"
      >
        Technologies
      </h2>
      
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
            useSimpleRenderer={useSimpleRenderer}
          />
        ))}
      </motion.div>
      
      {/* Loading indicator for remaining technologies */}
      {visibleCount < technologies.length && isVisible && (
        <div className="text-center mt-4">
          <div className="inline-block w-6 h-6 border-t-2 border-white rounded-full animate-spin"></div>
        </div>
      )}
    </section>
  );
};

export default SectionWrapper(Tech, "");