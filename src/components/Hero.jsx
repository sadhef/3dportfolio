import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// Monochrome styles
const styles = {
  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-16 py-10",

  heroHeadText:
    "font-black text-white lg:text-[80px] sm:text-[60px] xs:text-[50px] text-[40px] lg:leading-[98px] mt-2",
  heroSubText:
    "text-[#d1d1d1] font-medium lg:text-[30px] sm:text-[26px] xs:text-[20px] text-[16px] lg:leading-[40px]"
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
      className="relative w-full h-screen mx-auto overflow-hidden"
      aria-label="Introduction - Mohammed Sadhef, Full Stack Developer"
    >
      {/* Container for main hero content */}
      <div className={`absolute inset-0 top-[120px] max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5`}>
        {/* Left side vertical line with dot - now in grayscale */}
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-white" />
          <div className="w-1 sm:h-80 h-40 gray-gradient" />
        </div>

        {/* Right side main content */}
        <div className="z-10">
          {/* Title with decorative lines */}
          <motion.div 
            {...getAnimations()}
            className="flex items-center mb-4"
          >
            <div className="h-[1px] w-6 bg-white mr-2 opacity-60" />
            <span className="text-white text-sm tracking-widest uppercase font-light">
              Full Stack Developer
            </span>
            <div className="h-[1px] w-6 bg-white ml-2 opacity-60" />
          </motion.div>
          
          {/* Name with sophisticated underline effect */}
          <motion.h1 
            {...getAnimations()}
            className={`${styles.heroHeadText} text-white mb-2`}
          >
            Hi, I'm <span className="text-white font-black">Mohammed</span>
            <span className="text-white relative inline-block after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-full after:h-[1px] after:bg-white after:opacity-30"> Sadhef</span>
          </motion.h1>
          
          {/* Detailed description with keywords - more subtle gray */}
          <motion.p 
            {...getAnimations()}
            className={`${styles.heroSubText} mt-3 text-[#d1d1d1] max-w-2xl`}
            itemProp="description"
          >
            Full Stack Developer specializing in MERN stack 
            (MongoDB, Express.js, React.js, Node.js), Python, JavaScript and AI integration. 
            Building responsive web applications and providing custom solutions
            for modern businesses.
          </motion.p>
          
          {/* CTA buttons - monochrome scheme */}
          <motion.div 
            {...getAnimations()}
            className="flex flex-wrap gap-4 mt-8"
          >
            <a 
              href="#contact" 
              className="bg-white py-3 px-8 rounded-xl outline-none w-fit text-black font-bold shadow-md hover:bg-gray-200 transition-all duration-300"
              aria-label="Contact Mohammed Sadhef"
            >
              <span className="z-10 relative">Get In Touch</span>
            </a>
            <a 
              href="#projects" 
              className="py-3 px-8 rounded-xl outline-none w-fit text-white font-bold border border-white shadow-md hover:bg-white hover:bg-opacity-10 transition-all duration-300"
              aria-label="View Mohammed Sadhef's projects"
            >
              <span className="z-10 relative">View Projects</span>
            </a>
          </motion.div>
          
          {/* Tech keywords - lighter gray */}
          <motion.div 
            {...getAnimations()}
            className="flex flex-wrap gap-x-4 gap-y-2 mt-12 max-w-xl"
            itemProp="keywords"
          >
            {["React.js", "Node.js", "Express.js", "MongoDB", "PostgreSQL", "Docker", "Python", "Redux", "TailwindCSS"].map((tech, index) => (
              <span key={index} className="text-[#a9a9a9] text-sm">
                {tech}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator - now white */}
      {!prefersReducedMotion && (
        <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
          <a href="#about" aria-label="Scroll to About section">
            <div className="w-[35px] h-[64px] rounded-3xl border-4 border-white border-opacity-50 flex justify-center items-start p-2">
              <motion.div
                animate={{
                  y: [0, 24, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="w-3 h-3 rounded-full bg-white mb-1"
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