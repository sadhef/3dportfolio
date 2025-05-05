import React, { useState, useEffect, useMemo, useRef } from "react";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { motion, useAnimation } from "framer-motion";

// Optimized TechIcon component for better performance and accessibility
const TechIcon = ({ icon, name, index, isVisible }) => {
  // Optimize animation based on device capabilities
  const isMobile = window.innerWidth < 768;
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  
  // Calculate delay based on index (shorter on mobile)
  const delay = isMobile ? index * 0.03 : index * 0.05;
  
  // Use simplified animation for reduced motion or mobile
  const animation = useMemo(() => {
    if (prefersReducedMotion || isMobile) {
      return {
        initial: { opacity: 0 },
        animate: isVisible ? { opacity: 1 } : { opacity: 0 },
        transition: { duration: 0.3, delay: delay * 0.5 }
      };
    }
    
    return {
      initial: { opacity: 0, y: 10 },
      animate: isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
      transition: { duration: 0.5, delay }
    };
  }, [delay, isVisible, isMobile, prefersReducedMotion]);

  return (
    <motion.div 
      className="flex flex-col items-center m-3"
      {...animation}
    >
      <div 
        className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-2"
        style={{ boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}
      >
        <img 
          src={icon} 
          alt={`${name} icon`} 
          className="w-12 h-12 object-contain filter grayscale"
          loading="lazy"
          width="48"
          height="48"
        />
      </div>
      <p className="text-sm text-white-100 text-center font-light">{name}</p>
    </motion.div>
  );
};

// Main Tech component with performance optimizations
const Tech = () => {
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  // Use chunking for improved rendering performance
  const [renderCount, setRenderCount] = useState(6); // Initial render count
  
  // Split technologies into chunks for better initial load
  const visibleTechnologies = useMemo(() => {
    return technologies.slice(0, renderCount);
  }, [renderCount]);
  
  // Use Intersection Observer to trigger animations and progressive loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");
          
          // Load remaining technologies progressively
          const timer = setTimeout(() => {
            setRenderCount(technologies.length);
          }, 300);
          
          return () => clearTimeout(timer);
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
  }, [controls]);
  
  return (
    <section 
      ref={sectionRef}
      className="relative py-10"
      aria-labelledby="tech-section-title"
    >
      <h2 
        id="tech-section-title" 
        className="text-center text-3xl font-bold mb-10 sr-only"
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
        className="flex flex-row flex-wrap justify-center gap-5 mt-10"
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
      
      {/* Load indicator for remaining technologies */}
      {renderCount < technologies.length && isVisible && (
        <div className="text-center mt-4">
          <div className="inline-block w-6 h-6 border-t-2 border-white rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Add schema markup for SEO */}
      <div itemScope itemType="https://schema.org/ItemList" className="hidden">
        <meta itemProp="name" content="Technologies and Skills" />
        <meta itemProp="description" content="Technologies and programming languages used by Mohammed Sadhef" />
        {technologies.map((tech, index) => (
          <div key={index} itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
            <meta itemProp="position" content={index + 1} />
            <div itemScope itemType="https://schema.org/Thing" itemProp="item">
              <meta itemProp="name" content={tech.name} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionWrapper(Tech, "");