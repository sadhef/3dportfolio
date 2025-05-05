import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

// Optimized ProjectCard component with IntersectionObserver and performance improvements
const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  const controls = useAnimation();
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  
  // Detect high-end device for animation decisions
  const isHighEndDevice = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return (
      !prefersReducedMotion && 
      window.devicePixelRatio >= 2 && 
      (navigator.hardwareConcurrency || 0) >= 4
    );
  }, [prefersReducedMotion]);
  
  // Update mobile status on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Use IntersectionObserver to trigger animations when card becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");
          
          // Once it's been visible, we can stop observing
          if (cardRef.current) {
            observer.unobserve(cardRef.current);
          }
        }
      },
      {
        root: null,
        rootMargin: "50px",
        threshold: 0.1
      }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [controls]);
  
  // Handle image loading event
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  // Simplified animation variants based on device capabilities
  const cardVariants = useMemo(() => {
    if (prefersReducedMotion || isMobile) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
      };
    }
    
    if (!isHighEndDevice) {
      return {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: index * 0.1 } }
      };
    }
    
    return {
      hidden: { opacity: 0, y: 30 },
      visible: { 
        opacity: 1, 
        y: 0, 
        transition: { 
          type: "spring", 
          stiffness: 100, 
          damping: 12, 
          delay: index * 0.1 
        } 
      }
    };
  }, [prefersReducedMotion, isHighEndDevice, index, isMobile]);

  // Create shorter description for mobile
  const mobileDescription = description.length > 100 
    ? `${description.substring(0, 100)}...` 
    : description;

  return (
    <motion.div
      ref={cardRef}
      initial="hidden"
      animate={controls}
      variants={cardVariants}
      className="project-card w-full bg-tertiary p-4 sm:p-5 rounded-2xl h-full flex flex-col"
      whileHover={(!isMobile && isHighEndDevice) ? { y: -5, transition: { duration: 0.2 } } : undefined}
      itemScope
      itemType="https://schema.org/CreativeWork"
    >
      <meta itemProp="creator" content="Mohammed Sadhef" />
      <meta itemProp="keywords" content={tags.map(tag => tag.name).join(', ')} />
      
      <div className="relative w-full h-[180px] sm:h-[230px] overflow-hidden rounded-2xl">
        {/* Show skeleton loader while image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-2xl" />
        )}
        
        <img
          src={image}
          alt={`Screenshot of ${name} project`}
          className={`w-full h-full object-cover rounded-2xl transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
          onLoad={handleImageLoad}
          itemProp="image"
          width="400"
          height="230"
        />

        <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
          <div
            onClick={() => window.open(source_code_link, "_blank", "noopener noreferrer")}
            className="black-gradient w-8 h-8 sm:w-10 sm:h-10 rounded-full flex justify-center items-center cursor-pointer"
            aria-label={`View source code for ${name}`}
          >
            <img
              src={github}
              alt="GitHub repository"
              className="w-1/2 h-1/2 object-contain"
            />
          </div>
        </div>
      </div>

      <div className="mt-3 sm:mt-5 flex-grow">
        <h3 
          className="text-white font-bold text-xl sm:text-[24px]" 
          itemProp="name"
        >
          {name}
        </h3>
        <p 
          className="mt-2 text-secondary text-sm sm:text-[14px] project-description overflow-hidden"
          itemProp="description"
        >
          {isMobile ? mobileDescription : description}
        </p>
      </div>

      <div className="mt-3 sm:mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <p
            key={`${name}-${tag.name}`}
            className="text-xs sm:text-[14px] text-white"
          >
            #{tag.name}
          </p>
        ))}
      </div>
      
      <meta itemProp="url" content={source_code_link} />
    </motion.div>
  );
};

// Main Works component with optimization strategies
const Works = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const controls = useAnimation();
  const sectionRef = useRef(null);
  const [visibleProjects, setVisibleProjects] = useState([]);
  
  // Mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia?.(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  
  // Update mobile status on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Progressively load projects for better initial rendering
  useEffect(() => {
    // Force DOM update to ensure component renders
    const timer = setTimeout(() => {
      setIsLoaded(true);
      
      // Load projects in batches for smoother rendering
      const loadProjects = async () => {
        // On mobile, load fewer projects initially
        const initialBatch = isMobile ? 2 : 3;
        setVisibleProjects(projects.slice(0, initialBatch));
        
        // Load remaining projects after a slight delay
        if (projects.length > initialBatch) {
          await new Promise(resolve => setTimeout(resolve, 500));
          setVisibleProjects(projects);
        }
      };
      
      loadProjects();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isMobile]);
  
  // Use intersection observer to trigger animations when section is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
          
          // Once it's been visible, we can stop observing
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
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
  
  // Header animation variants - simplified for reduced motion
  const headerVariants = useMemo(() => {
    if (prefersReducedMotion || isMobile) {
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
      };
    }
    
    return textVariant();
  }, [prefersReducedMotion, isMobile]);

  return (
    <section 
      ref={sectionRef} 
      className="works-section w-full"
      id="projects"
      aria-labelledby="projects-heading"
      itemScope 
      itemType="https://schema.org/CollectionPage"
    >
      <meta itemProp="name" content="Mohammed Sadhef's Projects" />
      
      {/* Header with optimized animations */}
      <motion.div
        initial="hidden"
        animate={controls}
        variants={headerVariants}
      >
        <p className={styles.sectionSubText}>My work</p>
        <h2 id="projects-heading" className={styles.sectionHeadText}>Projects.</h2>
        <p className="mt-3 text-secondary text-sm sm:text-[17px] max-w-3xl leading-[24px] sm:leading-[30px]">
          Following projects showcases my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </p>
      </motion.div>

      {/* Render projects with optimized grid layout */}
      {isLoaded && (
        <div className="mt-10 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-7 safari-works-grid">
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={`project-${index}`}
              index={index}
              {...project}
            />
          ))}
        </div>
      )}
      
      {/* Loading indicator while projects are loading */}
      {isLoaded && visibleProjects.length < projects.length && (
        <div className="flex justify-center mt-6 sm:mt-10">
          <div className="w-6 h-6 sm:w-8 sm:h-8 border-t-2 border-white rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Schema.org markup for SEO */}
      <div itemScope itemType="https://schema.org/ItemList" className="hidden">
        <meta itemProp="numberOfItems" content={projects.length} />
        <meta itemProp="name" content="Web Development Portfolio Projects" />
        {projects.map((project, index) => (
          <div key={index} itemScope itemType="https://schema.org/ListItem" itemProp="itemListElement">
            <meta itemProp="position" content={index + 1} />
            <div itemScope itemType="https://schema.org/SoftwareApplication" itemProp="item">
              <meta itemProp="name" content={project.name} />
              <meta itemProp="description" content={project.description} />
              <meta itemProp="applicationCategory" content="WebApplication" />
              <meta itemProp="url" content={project.source_code_link} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Create a wrapper that uses unified section wrapper but adds additional optimizations
const OptimizedSectionWrapper = (Component, idName) => {
  function HOC() {
    return (
      <section 
        className="consistent-section relative w-full mx-auto z-10 safari-stacking-fix" 
        id={idName}
      >
        {/* Match the padding and margin with other sections */}
        <div className={`${styles.padding} max-w-7xl mx-auto relative`}>
          <span className="hash-span" id={idName}>&nbsp;</span>
          <Component />
        </div>
      </section>
    );
  }
  
  // Add display name for better debugging
  HOC.displayName = `OptimizedSectionWrapper(${getDisplayName(Component)})`;
  return HOC;
};

// Helper function to get component display name
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default OptimizedSectionWrapper(Works, "projects");