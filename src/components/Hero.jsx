import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { fadeIn } from "../utils/motion";

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const heroRef = useRef(null);
  
  // Device capability detection
  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Run initial checks
    checkMobile();
    
    // Handle scroll events
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Set up event listeners
    window.addEventListener("resize", checkMobile);
    window.addEventListener("scroll", handleScroll);
    
    // Clean up
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  
  // Use simpler animations if reduced motion is preferred
  const disableEffects = prefersReducedMotion || isMobile;
  
  // Animations based on scroll position
  const calculateParallaxStyles = () => {
    if (disableEffects) return {};
    
    const opacity = 1 - Math.min(1, scrollY / 700);
    const translateY = scrollY * 0.4;
    
    return {
      container: {
        opacity: opacity,
        transform: `translateY(${translateY}px)`
      },
      tagline: {
        transform: `translateY(${scrollY * 0.1}px)`
      },
      title: {
        transform: `translateY(${scrollY * 0.2}px)`
      },
      subtitle: {
        transform: `translateY(${scrollY * 0.25}px)`
      },
      buttons: {
        transform: `translateY(${scrollY * 0.15}px)`
      },
      tags: {
        transform: `translateY(${scrollY * 0.3}px)`
      }
    };
  };
  
  const parallaxStyles = calculateParallaxStyles();
  
  return (
    <section 
      ref={heroRef}
      id="home"
      className="relative w-full h-screen mx-auto flex items-center justify-center overflow-hidden"
      aria-label="Introduction - Mohammed Sadhef, Full Stack Developer"
    >
      {/* Background gradient effect */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent to-black opacity-80 z-0" />
      
      {/* Container with parallax effects on scroll */}
      <div 
        className="container relative z-10 px-6 mx-auto flex flex-col items-center"
        style={disableEffects ? {} : parallaxStyles.container}
      >
        <div className="flex flex-col items-center justify-center text-center">
          {/* Tagline */}
          <motion.div 
            className="flex items-center mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={disableEffects ? {} : parallaxStyles.tagline}
          >
            <div className="h-[1px] w-6 bg-white-100 mr-2 opacity-60" />
            <span className="text-white-100 text-sm tracking-widest uppercase font-light">
              Full Stack Developer
            </span>
            <div className="h-[1px] w-6 bg-white-100 ml-2 opacity-60" />
          </motion.div>
          
          {/* Name */}
          <motion.h1 
            className={`${styles.heroHeadText} text-white mb-2 text-center`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={disableEffects ? {} : parallaxStyles.title}
          >
            Mohammed <span className="text-white relative inline-block after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-white after:opacity-30">Sadhef</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            className="text-secondary text-lg max-w-2xl text-center leading-relaxed font-light mt-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={disableEffects ? {} : parallaxStyles.subtitle}
          >
            Full Stack Developer specializing in MERN stack 
            (MongoDB, Express.js, React.js, Node.js), Python, JavaScript and AI integration. 
            Building responsive web applications and providing custom solutions
            for modern businesses.
          </motion.p>
          
          {/* CTA buttons */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={disableEffects ? {} : parallaxStyles.buttons}
          >
            <a 
              href="#contact" 
              className="btn-primary"
              aria-label="Contact Mohammed Sadhef"
            >
              <span className="z-10 relative">Get In Touch</span>
            </a>
            <a 
              href="#projects" 
              className="btn-secondary"
              aria-label="View Mohammed Sadhef's projects"
            >
              <span className="z-10 relative">View Projects</span>
            </a>
          </motion.div>
          
          {/* Tech keywords */}
          <motion.div 
            className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-12 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={disableEffects ? {} : parallaxStyles.tags}
          >
            {["React.js", "Node.js", "Express.js", "MongoDB", "PostgreSQL", "Docker", "Python", "Redux", "TailwindCSS"].map((tech, index) => (
              <span key={index} className="text-white text-opacity-50 text-sm tech-tag">
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator with fade out on scroll */}
      {!prefersReducedMotion && (
        <motion.div 
          className="absolute xs:bottom-10 bottom-16 w-full flex justify-center items-center"
          style={{ opacity: Math.max(0, 1 - scrollY / 300) }}
        >
          <a href="#about" className="flex flex-col items-center" aria-label="Scroll to About section">
            <motion.div
              animate={{
                y: [0, 12, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop"
              }}
              className="mb-1 w-6 h-10 rounded-full border-2 border-white border-opacity-20 flex justify-center pt-2"
            >
              <motion.div className="w-1.5 h-1.5 bg-white rounded-full" />
            </motion.div>
            <span className="text-white-100 text-opacity-50 text-xs uppercase tracking-widest">Scroll</span>
          </a>
        </motion.div>
      )}
    </section>
  );
};

export default Hero;