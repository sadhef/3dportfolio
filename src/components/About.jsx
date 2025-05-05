import React, { useState, useEffect } from "react";
import Tilt from "react-parallax-tilt";
import { motion, useAnimation } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

// Optimized service card with lazy loading and better performance
const ServiceCard = ({ index, title, icon }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = React.useRef(null);
  
  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  
  // Use intersection observer to only animate cards when they become visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once it's been visible, we can stop observing
          if (cardRef.current) {
            observer.unobserve(cardRef.current);
          }
        }
      },
      {
        root: null,
        rootMargin: "0px",
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
  }, []);
  
  // Card motion variants - simpler if reduced motion is preferred
  const cardVariants = prefersReducedMotion 
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.5 } }
      }
    : fadeIn("right", "spring", index * 0.5, 0.75);

  return (
    <div ref={cardRef}>
      <Tilt 
        className='xs:w-[250px] w-full'
        // Disable tilt effect for users who prefer reduced motion
        tiltEnable={!prefersReducedMotion}
        tiltMaxAngleX={20}
        tiltMaxAngleY={20}
        transitionSpeed={400}
        scale={1.05}
        // Only enable gyroscope on mobile devices
        gyroscope={window.innerWidth < 768}
      >
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate={isVisible ? "show" : "hidden"}
          className='w-full p-[1px] rounded-[20px] shadow-card border border-gray-700'
        >
          <div
            className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
          >
            {/* Use webp format for better performance */}
            <img
              src={icon}
              alt={`${title} icon`}
              className='w-16 h-16 object-contain filter grayscale'
              loading="lazy" // Add lazy loading
              width="64" // Explicit width for better layout stability
              height="64" // Explicit height for better layout stability
            />

            <h3 className='text-white text-[20px] font-bold text-center'>
              {title}
            </h3>
          </div>
        </motion.div>
      </Tilt>
    </div>
  );
};

// Main About component with optimized content and rich SEO structure
const About = () => {
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = React.useRef(null);

  // Use intersection observer to only animate content when it becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("show");
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

  return (
    <div ref={sectionRef}>
      {/* Use schema.org markup for SEO */}
      <section itemScope itemType="https://schema.org/ProfilePage">
        <meta itemProp="name" content="About Mohammed Sadhef" />
        
        <motion.div 
          variants={textVariant()} 
          initial="hidden" 
          animate={controls}
        >
          <p className={styles.sectionSubText}>Introduction</p>
          <h2 className={styles.sectionHeadText}>Overview.</h2>
        </motion.div>

        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          initial="hidden"
          animate={controls}
          className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
          itemProp="description"
        >
          {/* SEO-optimized content with schema markup */}
          <span itemProp="about">
            I am a highly motivated self-starter Full Stack Developer with experience in dynamic 
            and fast-paced environments. My expertise spans the MERN stack (MongoDB, Express.js, 
            React.js, and Node.js) with proficiency in PostgreSQL for relational database management.
          </span>{" "}
          
          <span itemProp="knowsAbout">
            I've integrated Python-based data science, AI, and machine learning capabilities
            and have hands-on experience with Docker for containerization and deployment 
            across multiple environments.
          </span>
          
          <span itemProp="skills">
            Additionally, I've developed cross-platform mobile applications using React Native, 
            leveraging RESTful APIs and managing state with Redux/Context API. My technical proficiency, 
            combined with my focus on delivering high-quality, optimized code, helps me create 
            efficient and user-friendly solutions that solve real-world problems.
          </span>{" "}
          
          I'm eager to contribute to an organization that values technical excellence and fosters professional growth.
        </motion.p>

        <div className='mt-20 flex flex-wrap justify-center gap-10'>
          {services.map((service, index) => (
            <ServiceCard key={`service-${index}`} index={index} {...service} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default SectionWrapper(About, "about");