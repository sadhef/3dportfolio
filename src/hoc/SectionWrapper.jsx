import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";

// Performance-optimized version of the staggerContainer animation
const getStaggerVariants = (isSimpleMode) => {
  if (isSimpleMode) {
    // Simplified animation for better performance
    return {
      hidden: {},
      show: {}
    };
  }
  
  // Full animation for capable devices
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };
};

const SectionWrapper = (Component, idName) => {
  function HOC(props) {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);
    
    // Get performance profile from window
    const performanceProfile = window.performanceProfile || { 
      performanceTier: 2, 
      prefersReducedMotion: false 
    };
    
    // Determine if we should use reduced animations
    const shouldReduceMotion = 
      performanceProfile.prefersReducedMotion || 
      performanceProfile.performanceTier < 2 || 
      window.innerWidth < 768;
    
    // Use intersection observer for more efficient animations
    useEffect(() => {
      if (!sectionRef.current) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Unobserve after becoming visible
            observer.unobserve(entry.target);
          }
        },
        {
          rootMargin: '0px 0px -10% 0px', // Trigger slightly before section comes into view
          threshold: 0.1 // 10% of section visible
        }
      );
      
      observer.observe(sectionRef.current);
      
      return () => {
        if (sectionRef.current) {
          observer.unobserve(sectionRef.current);
        }
      };
    }, []);
    
    // Use simpler version for better performance on lower-tier devices
    if (shouldReduceMotion) {
      return (
        <section
          ref={sectionRef}
          className={`${styles.padding} max-w-7xl mx-auto relative z-0 section-wrapper`}
        >
          <span className='hash-span' id={idName}>
            &nbsp;
          </span>
          <Component {...props} isVisible={isVisible} />
        </section>
      );
    }
    
    // Full animated version for higher-tier devices
    return (
      <motion.section
        ref={sectionRef}
        variants={getStaggerVariants(shouldReduceMotion)}
        initial='hidden'
        animate={isVisible ? 'show' : 'hidden'}
        className={`${styles.padding} max-w-7xl mx-auto relative z-0 section-wrapper`}
      >
        <span className='hash-span' id={idName}>
          &nbsp;
        </span>

        <Component {...props} isVisible={isVisible} />
      </motion.section>
    );
  }
  
  return HOC;
};

export default SectionWrapper;