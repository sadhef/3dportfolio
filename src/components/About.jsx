"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

// Enhanced floating particles background
const FloatingParticles = () => {
  const particles = Array.from({ length: 15 }, (_, i) => i);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
          }}
          animate={{
            x: [
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
              Math.random() * 100 + "%"
            ],
            y: [
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
              Math.random() * 100 + "%"
            ],
          }}
          transition={{
            duration: Math.random() * 20 + 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// Modern glassmorphism service card with advanced animations
const ServiceCard = ({ index, title, icon }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
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

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 80, scale: 0.8 }}
      animate={isVisible ? { 
        opacity: 1, 
        y: 0, 
        scale: 1,
        rotateY: 0 
      } : { 
        opacity: 0, 
        y: 80, 
        scale: 0.8,
        rotateY: -15 
      }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.15,
        type: "spring",
        stiffness: 100
      }}
      className="xs:w-[280px] w-full group perspective-1000"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        y: -15,
        rotateY: 5,
        transition: { duration: 0.4, type: "spring", stiffness: 300 }
      }}
    >
      {/* Glowing border effect */}
      <div className="absolute inset-0 rounded-[24px] bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 p-[2px] group-hover:from-purple-500/40 group-hover:via-pink-500/40 group-hover:to-cyan-500/40 transition-all duration-500">
        <div className="relative bg-black/40 backdrop-blur-xl rounded-[22px] py-8 px-6 min-h-[320px] flex justify-center items-center flex-col border border-white/10 overflow-hidden">
          
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `conic-gradient(from ${index * 60}deg, 
                rgba(168, 85, 247, 0.1) 0deg, 
                rgba(236, 72, 153, 0.1) 120deg, 
                rgba(6, 182, 212, 0.1) 240deg, 
                rgba(168, 85, 247, 0.1) 360deg)`
            }}
          />
          
          {/* Icon container with enhanced effects */}
          <motion.div 
            className="relative w-20 h-20 mb-6"
            animate={isHovered ? { 
              scale: 1.1, 
              rotateY: 360,
            } : { 
              scale: 1, 
              rotateY: 0 
            }}
            transition={{ 
              duration: 0.6,
              type: "spring",
              stiffness: 200
            }}
          >
            {/* Glowing ring effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 opacity-0 group-hover:opacity-30 blur-md"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Image
                src={icon}
                alt={`${title} icon`}
                fill
                sizes="80px"
                className="object-contain p-4 filter brightness-125 group-hover:brightness-150 transition-all duration-300"
                priority
              />
            </div>
          </motion.div>

          {/* Title with gradient text */}
          <motion.h3 
            className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white text-[22px] font-bold text-center leading-tight group-hover:from-purple-300 group-hover:via-pink-300 group-hover:to-cyan-300 transition-all duration-500"
            animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {title}
          </motion.h3>

          {/* Subtle description line */}
          <motion.div
            className="w-16 h-[2px] mt-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={isHovered ? { width: "4rem" } : { width: "2rem" }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Scroll-triggered text reveal effect
const RevealText = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const textRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    
    if (textRef.current) {
      observer.observe(textRef.current);
    }
    
    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={textRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, type: "spring", stiffness: 100 }}
    >
      {children}
    </motion.div>
  );
};

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  
  const springScrollY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const backgroundY = useTransform(springScrollY, [0, 1], ["0%", "50%"]);
  const scale = useTransform(springScrollY, [0, 0.5, 1], [0.8, 1, 0.8]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <motion.div 
      ref={sectionRef} 
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ scale }}
    >
      {/* Animated background with parallax */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{ y: backgroundY }}
      >
        {/* Gradient mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full filter blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/5 rounded-full filter blur-3xl animate-pulse delay-2000" />
      </motion.div>

      <FloatingParticles />
      
      {/* Header section with enhanced typography */}
      <RevealText>
        <div className="relative mb-16">
          <motion.p 
            className={`${styles.sectionSubText} relative z-10`}
            animate={isVisible ? { 
              opacity: 1,
              x: 0,
              background: "linear-gradient(45deg, #a855f7, #ec4899, #06b6d4)"
            } : { 
              opacity: 0, 
              x: -50 
            }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Introduction
            </span>
          </motion.p>
          
          <motion.h2 
            className={`${styles.sectionHeadText} relative z-10`}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white">
              Overview
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              .
            </span>
          </motion.h2>
          
          {/* Decorative line */}
          <motion.div
            className="absolute -bottom-4 left-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={isVisible ? { width: "200px" } : { width: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </RevealText>

      {/* Enhanced description with typing effect */}
      <RevealText delay={0.3}>
        <motion.div className="relative mb-16">
          <motion.p
            className="text-secondary text-[18px] max-w-4xl leading-[32px] relative z-10 font-light"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            I am a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold">
              highly motivated Full Stack Developer
            </span>{" "}
            with experience in dynamic and fast-paced environments. My expertise spans the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-semibold">
              MERN stack
            </span>{" "}
            (MongoDB, Express.js, React.js, and Node.js) with proficiency in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 font-semibold">
              PostgreSQL
            </span>{" "}
            for relational database management. I've integrated{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 font-semibold">
              Python-based data science, AI, and machine learning
            </span>{" "}
            capabilities and have experience with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 font-semibold">
              Docker
            </span>{" "}
            for containerization and deployment. Additionally, I've developed{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400 font-semibold">
              cross-platform mobile applications
            </span>{" "}
            using React Native, leveraging RESTful APIs and managing state with Redux/Context API.
          </motion.p>
          
          {/* Glowing border effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-white/5 backdrop-blur-sm -m-8 p-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </motion.div>
      </RevealText>

      {/* Services grid with staggered animations */}
      <RevealText delay={0.5}>
        <motion.div 
          className="mt-16 flex flex-wrap gap-8 justify-center relative z-10"
          initial={{ opacity: 0, y: 100 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          {services.map((service, index) => (
            <ServiceCard 
              key={service.title} 
              index={index} 
              {...service} 
            />
          ))}
        </motion.div>
      </RevealText>

      {/* Bottom decorative element */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
      />
    </motion.div>
  );
};

export default SectionWrapper(About, "about");