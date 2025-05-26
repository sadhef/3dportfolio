"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, useAnimation, useMotionValue, useTransform, AnimatePresence } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

// Premium animated background particles for projects section
const ProjectParticle = ({ delay, duration }) => {
  return (
    <motion.div
      className="absolute w-1.5 h-1.5 bg-gradient-to-r from-violet-400 to-pink-400 rounded-full opacity-20"
      initial={{ 
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920), 
        y: typeof window !== 'undefined' ? window.innerHeight + 10 : 1080 
      }}
      animate={{
        x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
        y: -10,
        rotate: 360
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  );
};

// Enhanced ProjectCard with premium visual effects and performance optimizations
const ProjectCard = ({ index, name, description, tags, image, source_code_link }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const cardRef = useRef(null);
  
  // Mouse interaction values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [15, -15]);
  const rotateY = useTransform(mouseX, [-300, 300], [-15, 15]);
  
  // Use Intersection Observer for performance
  useEffect(() => {
    if (typeof window === 'undefined' || !cardRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(cardRef.current);
    
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const cardVariants = {
    initial: { opacity: 0, y: 50, scale: 0.9 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        type: "spring",
        bounce: 0.4
      }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer"
      variants={cardVariants}
      initial="initial"
      animate={isVisible ? "animate" : "initial"}
      whileHover={{ 
        y: -15,
        transition: { duration: 0.3, type: "spring", bounce: 0.6 }
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
    >
      {/* Glow effect background */}
      <motion.div
        className="absolute -inset-2 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, rgba(139, 92, 246, 0.3), rgba(236, 72, 153, 0.3), transparent 70%)`,
          filter: "blur(25px)"
        }}
      />

      {/* Main card container */}
      <motion.div
        className="relative bg-tertiary p-6 rounded-3xl sm:w-[360px] w-full h-full flex flex-col backdrop-blur-xl border border-white/10 overflow-hidden"
        style={{
          background: "linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))",
          boxShadow: isHovered 
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
            : "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
        }}
      >
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
          style={{
            background: "linear-gradient(45deg, #8b5cf6, #ec4899, #06b6d4, #10b981)",
            backgroundSize: "400% 400%"
          }}
          animate={{
            backgroundPosition: isHovered ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%"
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Image container with enhanced effects */}
        <div className="relative w-full h-[230px] mb-5 overflow-hidden rounded-2xl">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 animate-pulse rounded-2xl" />
          )}
          
          <motion.div
            className="relative w-full h-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover rounded-2xl"
              onLoad={() => setImageLoaded(true)}
              priority={index < 3}
            />
            
            {/* Image overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl" />
          </motion.div>

          {/* Enhanced GitHub button */}
          <motion.div 
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              onClick={() => window.open(source_code_link, "_blank")}
              className="w-12 h-12 rounded-full flex justify-center items-center cursor-pointer backdrop-blur-xl border border-white/20 relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, rgba(0, 0, 0, 0.8), rgba(30, 30, 30, 0.9))",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)"
              }}
            >
              {/* Button shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                animate={{
                  x: isHovered ? ["-100%", "100%"] : "-100%"
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  repeat: isHovered ? Infinity : 0,
                  repeatDelay: 0.5
                }}
                style={{
                  transform: "skewX(-20deg)"
                }}
              />
              
              <div className="relative w-6 h-6 z-10">
                <Image
                  src={github}
                  alt="source code"
                  fill
                  sizes="24px"
                  className="object-contain filter brightness-110"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Shimmer effect on image */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl"
            animate={{
              x: isHovered ? ["-100%", "100%"] : "-100%"
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: isHovered ? Infinity : 0,
              repeatDelay: 1
            }}
            style={{
              transform: "skewX(-20deg)"
            }}
          />
        </div>

        {/* Content section */}
        <div className="flex-grow relative z-10">
          <motion.h3 
            className="text-white font-bold text-[24px] mb-3"
            animate={{
              color: isHovered ? "#a855f7" : "#ffffff"
            }}
            transition={{ duration: 0.3 }}
          >
            {name}
          </motion.h3>
          
          <motion.p 
            className="text-secondary text-[14px] leading-relaxed"
            animate={{
              color: isHovered ? "#d8b4fe" : "#aaa6c3"
            }}
            transition={{ duration: 0.3 }}
          >
            {description}
          </motion.p>
        </div>

        {/* Enhanced tags section */}
        <div className="mt-6 flex flex-wrap gap-2 relative z-10">
          {tags.map((tag, tagIndex) => (
            <motion.div
              key={`${name}-${tag.name}`}
              className="relative group/tag"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.3, 
                delay: index * 0.1 + tagIndex * 0.05 
              }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.p
                className={`text-[14px] px-3 py-1 rounded-full backdrop-blur-sm border border-white/10 ${tag.color} font-medium`}
                style={{
                  background: "linear-gradient(145deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))"
                }}
              >
                #{tag.name}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {/* Floating reflection effect */}
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-6 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-full"
          style={{
            background: "linear-gradient(to bottom, rgba(139, 92, 246, 0.3), transparent)",
            filter: "blur(12px)",
            transform: "translateX(-50%) translateY(100%)"
          }}
        />
      </motion.div>
    </motion.div>
  );
};

// Enhanced Works component with premium animations and better performance
const Works = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const sectionRef = useRef(null);
  const controls = useAnimation();
  
  // Progressive loading for better performance
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");
          
          // Progressive loading of project cards
          const timer = setInterval(() => {
            setVisibleCount(prev => {
              const newCount = prev + 2;
              if (newCount >= projects.length) {
                clearInterval(timer);
                return projects.length;
              }
              return newCount;
            });
          }, 300);
          
          return () => clearInterval(timer);
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(sectionRef.current);
    
    return () => observer.disconnect();
  }, [controls]);

  // Memoized visible projects for performance
  const visibleProjects = useMemo(() => {
    return projects.slice(0, visibleCount);
  }, [visibleCount]);

  // Generate particles array for background
  const particles = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => (
      <ProjectParticle 
        key={i} 
        delay={i * 0.8} 
        duration={Math.random() * 8 + 12}
      />
    ));
  }, []);

  return (
    <div 
      ref={sectionRef} 
      className="relative w-full mx-auto overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, rgba(30, 41, 59, 0.1) 0%, rgba(15, 23, 42, 0.05) 50%, transparent 100%)"
      }}
    >
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles}
      </div>

      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px"
        }}
      />

      {/* Enhanced section header */}
      <div className="mb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
          className="text-center"
        >
          <motion.p 
            className="text-secondary text-[18px] font-light tracking-wider uppercase"
            style={{
              background: "linear-gradient(45deg, #8b5cf6, #ec4899, #06b6d4)",
              backgroundSize: "200% 200%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text"
            }}
            animate={{
              backgroundPosition: isVisible ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%"
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            My work
          </motion.p>
          
          <motion.h2 
            className="text-white font-black md:text-[60px] sm:text-[50px] xs:text-[40px] text-[30px] mt-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
          >
            Projects.
          </motion.h2>
        </motion.div>
        
        {/* Enhanced introduction text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-6 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl" />
          <p className="text-secondary text-[17px] max-w-4xl leading-[30px] mx-auto text-center px-6 sm:px-8 py-6 relative backdrop-blur-sm rounded-2xl border border-white/10">
            Following projects showcase my skills and experience through
            real-world examples of my work. Each project is briefly described with
            links to code repositories and live demos. It reflects my
            ability to solve complex problems, work with different technologies,
            and manage projects effectively.
          </p>
        </motion.div>
      </div>

      {/* Enhanced projects grid */}
      <motion.div 
        className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-6 relative z-10"
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        <AnimatePresence>
          {visibleProjects.map((project, index) => (
            <ProjectCard 
              key={`project-${index}`} 
              index={index} 
              {...project} 
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Enhanced loading indicator */}
      {visibleCount < projects.length && isVisible && (
        <motion.div 
          className="text-center mt-12 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full backdrop-blur-xl border border-white/10">
            <motion.div 
              className="w-3 h-3 bg-violet-400 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div 
              className="w-3 h-3 bg-pink-400 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div 
              className="w-3 h-3 bg-cyan-400 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            />
            <span className="text-white/70 text-sm font-light ml-3">Loading more projects...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SectionWrapper(Works, "projects");