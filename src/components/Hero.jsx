import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { styles } from "../styles";
import { fadeIn } from "../utils/motion";

// Optimized Hero component with better animations and SEO
const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const controls = useAnimation();
  
  useEffect(() => {
    setLoaded(true);
    // Start animations when component mounts
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    });
  }, [controls]);
  
  // Detect reduced motion preference
  const prefersReducedMotion = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  
  // Use simpler animations if reduced motion is preferred
  const animations = prefersReducedMotion ? {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.5 }
  } : {
    initial: "hidden",
    animate: "show",
    variants: fadeIn("down", "tween", 0.2, 1)
  };

  return (
    <section 
      id="home"
      className="relative w-full h-screen mx-auto flex items-center justify-center overflow-hidden"
      aria-label="Introduction - Mohammed Sadhef, Full Stack Developer"
    >
      {/* Background gradient effect - static for better performance */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent to-black opacity-80 z-0" />
      
      {/* Remove animated spotlight for better performance */}
      <div className="absolute w-full max-w-lg h-96 rounded-full blur-[120px] opacity-[0.03] bg-white z-0" />
      
      <div className="container relative z-10 px-6 mx-auto flex flex-col items-center">
        <div className="flex flex-col items-center justify-center text-center">
          {/* SEO-optimized header structure */}
          <motion.div 
            {...animations}
            className="flex items-center mb-4"
          >
            <div className="h-[1px] w-6 bg-white-100 mr-2 opacity-60" />
            <span className="text-white-100 text-sm tracking-widest uppercase font-light">
              Full Stack Developer
            </span>
            <div className="h-[1px] w-6 bg-white-100 ml-2 opacity-60" />
          </motion.div>
          
          {/* Name with proper heading and SEO structure */}
          <motion.h1 
            {...animations}
            className={`${styles.heroHeadText} text-white mb-2 text-center`}
          >
            Mohammed <span className="text-white relative inline-block after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-white after:opacity-30">Sadhef</span>
          </motion.h1>
          
          {/* SEO-optimized subtitle with keywords and schema */}
          <motion.p 
            {...animations}
            className="text-secondary text-lg max-w-2xl text-center leading-relaxed font-light mt-3"
            itemProp="description"
          >
            Full Stack Developer specializing in MERN stack 
            (MongoDB, Express.js, React.js, Node.js), Python, JavaScript and AI integration. 
            Building responsive web applications and providing custom solutions
            for modern businesses.
          </motion.p>
          
          {/* CTA buttons with proper ARIA labels */}
          <motion.div 
            {...animations}
            className="flex flex-wrap justify-center gap-4 mt-8"
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
          
          {/* Tech keywords for SEO */}
          <motion.div 
            {...animations}
            className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-12 max-w-xl"
            itemProp="keywords"
          >
            {["React.js", "Node.js", "Express.js", "MongoDB", "PostgreSQL", "Docker", "Python", "Redux", "TailwindCSS"].map((tech, index) => (
              <span key={index} className="text-white text-opacity-50 text-sm">
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Simplified scroll indicator with better performance */}
      {!prefersReducedMotion && (
        <div className="absolute xs:bottom-10 bottom-16 w-full flex justify-center items-center">
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
        </div>
      )}
    </section>
  );
};

export default Hero;