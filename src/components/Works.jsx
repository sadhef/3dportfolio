import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { textVariant } from "../utils/motion";
import ParallaxProjectCard from "./parallax/ParallaxProjectCard";

// Enhanced Works component with improved performance and parallax effects
const Works = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef(null);
  
  // For parallax scrolling effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  // Transform values for parallax elements
  const headerY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  
  // Check device capabilities
  useEffect(() => {
    // Check if user prefers reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial checks
    checkMobile();
    
    // Force component to update once mounted
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    // Listen for changes
    window.addEventListener('resize', checkMobile);
    const motionListener = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', motionListener);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      mediaQuery.removeEventListener('change', motionListener);
    };
  }, []);
  
  // Should disable parallax effects?
  const disableParallax = prefersReducedMotion || isMobile;

  return (
    <div className="works-section" ref={sectionRef}>
      {/* Header with parallax effect */}
      <motion.div
        style={{ 
          y: disableParallax ? 0 : headerY,
          opacity: disableParallax ? 1 : headerOpacity
        }}
        className="mb-12"
      >
        {/* Standard header with accessibility improvements */}
        <h2 className="sr-only">Projects</h2>
        <p className={`${styles.sectionSubText} text-center`}>My work</p>
        <h3 className={`${styles.sectionHeadText} text-center`}>Projects.</h3>
        <motion.p 
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px] mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Following projects showcase my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </motion.p>
      </motion.div>

      {/* Responsive grid with proper semantic structure and optimized rendering */}
      {isLoaded && (
        <div 
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 lg:px-8"
          role="list"
          aria-label="Project portfolio"
        >
          {projects.map((project, index) => (
            <article key={`project-${index}`} role="listitem" className="h-full">
              <ParallaxProjectCard
                index={index}
                {...project}
              />
            </article>
          ))}
        </div>
      )}
      
      {/* Add a rich structured data for SEO */}
      <div itemScope itemType="https://schema.org/Collection" className="hidden">
        <meta itemProp="name" content="Mohammed Sadhef's Portfolio Projects" />
        <meta itemProp="description" content="Collection of web development projects by Mohammed Sadhef" />
        {projects.map((project, index) => (
          <div key={index} itemScope itemType="https://schema.org/CreativeWork" itemProp="hasPart">
            <meta itemProp="name" content={project.name} />
            <meta itemProp="description" content={project.description} />
            <meta itemProp="url" content={project.source_code_link} />
            <meta itemProp="image" content={project.image} />
            <meta itemProp="keywords" content={project.tags.map(tag => tag.name).join(',')} />
          </div>
        ))}
      </div>
    </div>
  );
};

// Create a universal wrapper that matches other section sizes
const ConsistentSectionWrapper = (Component, idName) => {
  return function HOC() {
    return (
      <section 
        className="consistent-section relative w-full mx-auto z-10" 
        id={idName}
      >
        {/* Match the padding and margin with other sections */}
        <div className={`${styles.padding} max-w-7xl mx-auto relative`}>
          <span className="hash-span" id={idName}>&nbsp;</span>
          <Component />
        </div>
      </section>
    );
  };
};

export default ConsistentSectionWrapper(Works, "projects");