import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Responsive styles with mobile-first approach
const styles = {
  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-16 py-10",

  heroHeadText:
    "font-black text-white text-[40px] xs:text-[50px] sm:text-[60px] lg:text-[80px] leading-[60px] xs:leading-[70px] sm:leading-[85px] lg:leading-[98px] mt-2",
  heroSubText:
    "text-[#d1d1d1] font-medium text-[16px] xs:text-[20px] sm:text-[26px] lg:text-[30px] leading-[25px] xs:leading-[30px] sm:leading-[35px] lg:leading-[40px]"
};

// Animation variants
const fadeIn = (direction, type, delay, duration) => {
  return {
    hidden: {
      x: direction === "left" ? 100 : direction === "right" ? -100 : 0,
      y: direction === "up" ? 100 : direction === "down" ? -100 : 0,
      opacity: 0,
    },
    show: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: {
        type: type,
        delay: delay,
        duration: duration,
        ease: "easeOut",
      },
    },
  };
};

const Hero = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    // Check for reduced motion preference
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      );
    }
  }, []);
  
  // Use simpler animations if reduced motion is preferred
  const getAnimations = () => {
    if (prefersReducedMotion) {
      return {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.5 }
      };
    } else {
      return {
        initial: "hidden",
        animate: "show",
        variants: fadeIn("down", "tween", 0.2, 1)
      };
    }
  };

  return (
    <section 
      id="home"
      className="relative w-full h-screen mx-auto overflow-hidden flex items-center"
      aria-label="Introduction - Mohammed Sadhef, Full Stack Developer"
    >
      {/* Container for main hero content - improved responsive design */}
      <div className={`absolute z-10 inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-4 md:gap-5`}>
        {/* Left side vertical line with dot */}
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white" />
          <div className="w-1 sm:h-80 h-40 gray-gradient" />
        </div>

        {/* Right side main content - improved responsive layout */}
        <div className="z-10 max-w-full">
          {/* Title with decorative lines - adjusted for small screens */}
          <motion.div 
            {...getAnimations()}
            className="flex items-center mb-2 sm:mb-4"
          >
            <div className="h-[1px] w-4 sm:w-6 bg-white mr-2 opacity-60" />
            <span className="text-white text-xs sm:text-sm tracking-widest uppercase font-light whitespace-nowrap">
              Full Stack Developer
            </span>
            <div className="h-[1px] w-4 sm:w-6 bg-white ml-2 opacity-60" />
          </motion.div>
          
          {/* Name with sophisticated underline effect - better mobile scaling */}
          <motion.h1 
            {...getAnimations()}
            className={`${styles.heroHeadText} text-white mb-2`}
          >
            Hi, I'm <span className="text-white font-black block sm:inline">Mohammed</span>
            <span className="text-white relative inline-block after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-white after:opacity-30"> Sadhef</span>
          </motion.h1>
          
          {/* Detailed description with keywords - responsive text sizing */}
          <motion.p 
            {...getAnimations()}
            className={`${styles.heroSubText} mt-2 sm:mt-3 text-[#d1d1d1] max-w-2xl`}
            itemProp="description"
          >
            Full Stack Developer specializing in MERN stack 
            (MongoDB, Express.js, React.js, Node.js), Python, JavaScript and AI integration. 
            <span className="hidden xs:inline"><br /></span> Building responsive web applications and providing custom solutions
            for modern businesses.
          </motion.p>
          
          {/* CTA buttons - improved mobile layout */}
          <motion.div 
            {...getAnimations()}
            className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8"
          >
            <a 
              href="#contact" 
              className="bg-white py-2 sm:py-3 px-5 sm:px-8 rounded-xl outline-none w-fit text-black font-bold shadow-md hover:bg-gray-200 transition-all duration-300 text-sm sm:text-base"
              aria-label="Contact Mohammed Sadhef"
            >
              <span className="z-10 relative">Get In Touch</span>
            </a>
            <a 
              href="#projects" 
              className="py-2 sm:py-3 px-5 sm:px-8 rounded-xl outline-none w-fit text-white font-bold border border-white shadow-md hover:bg-white hover:bg-opacity-10 transition-all duration-300 text-sm sm:text-base"
              aria-label="View Mohammed Sadhef's projects"
            >
              <span className="z-10 relative">View Projects</span>
            </a>
          </motion.div>
          
          {/* Tech keywords - better mobile layout */}
          <motion.div 
            {...getAnimations()}
            className="flex flex-wrap gap-x-3 gap-y-1 sm:gap-x-4 sm:gap-y-2 mt-8 sm:mt-12 max-w-xl"
            itemProp="keywords"
          >
            {["React.js", "Node.js", "Express.js", "MongoDB", "PostgreSQL", "Docker", "Python", "Redux", "TailwindCSS"].map((tech, index) => (
              <span key={index} className="text-[#a9a9a9] text-xs sm:text-sm">
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator - resized for mobile */}
      {!prefersReducedMotion && (
        <div className="absolute xs:bottom-10 bottom-20 w-full flex justify-center items-center">
          <a href="#about" aria-label="Scroll to About section">
            <div className="w-[30px] h-[54px] xs:w-[35px] xs:h-[64px] rounded-3xl border-4 border-white border-opacity-50 flex justify-center items-start p-2">
              <motion.div
                animate={{
                  y: [0, 24, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="w-2 h-2 xs:w-3 xs:h-3 rounded-full bg-white mb-1"
              />
            </div>
          </a>
        </div>
      )}

      {/* Add this CSS class to your global CSS */}
      <style jsx>{`
        .gray-gradient {
          background: #ffffff;
          background: linear-gradient(-90deg, #ffffff 0%, rgba(60, 60, 60, 0) 100%);
          background: -webkit-linear-gradient(-90deg, #ffffff 0%, rgba(60, 60, 60, 0) 100%);
        }
      `}</style>
    </section>
  );
};

export default Hero;