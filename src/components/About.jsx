"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

import { styles } from "../styles";
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

// Interactive skill badges
const SkillBadge = ({ skill, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 border border-white/10 backdrop-blur-sm cursor-pointer"
        whileHover={{ 
          scale: 1.05,
          background: "linear-gradient(45deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3), rgba(6, 182, 212, 0.3))"
        }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-white font-medium text-sm group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
          {skill}
        </span>
        
        {/* Glowing effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/40 via-pink-500/40 to-cyan-500/40 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
          animate={isHovered ? { scale: 1.2 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
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

  // Skills array
  const skills = [
    "JavaScript", "TypeScript", "React.js", "Next.js", "Node.js", 
    "Express.js", "MongoDB", "PostgreSQL", "Python", "React Native",
    "Docker", "AWS", "Redux", "GraphQL", "REST APIs"
  ];

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

      {/* Enhanced description */}
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
            for relational database management.
          </motion.p>
          
          <motion.p
            className="text-secondary text-[18px] max-w-4xl leading-[32px] relative z-10 font-light mt-6"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            I've integrated{" "}
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
            transition={{ duration: 1, delay: 1.0 }}
          />
        </motion.div>
      </RevealText>

      {/* Skills section */}
      <RevealText delay={0.5}>
        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <motion.h3 
            className="text-white text-[24px] font-bold mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              Technologies & Skills
            </span>
          </motion.h3>
          
          <div className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <SkillBadge key={skill} skill={skill} index={index} />
            ))}
          </div>
        </motion.div>
      </RevealText>

      {/* Call to action section */}
      <RevealText delay={0.7}>
        <motion.div 
          className="mt-16 text-center relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          <motion.p
            className="text-secondary text-[16px] max-w-2xl mx-auto leading-[28px] mb-8"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            Passionate about creating innovative solutions that bridge the gap between 
            cutting-edge technology and real-world applications. Let's build something amazing together.
          </motion.p>
          
          <motion.button
            className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white font-semibold text-[16px] border-none cursor-pointer relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 2.0 }}
          >
            <span className="relative z-10">Get In Touch</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            />
          </motion.button>
        </motion.div>
      </RevealText>

      {/* Bottom decorative element */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1, delay: 2.2 }}
      />
    </motion.div>
  );
};

export default SectionWrapper(About, "about");