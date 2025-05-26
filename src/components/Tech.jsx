"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

// Simple TechIcon with minimal animations
const TechIcon = ({ icon, name, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const iconRef = useRef(null);
  
  useEffect(() => {
    if (typeof window === 'undefined' || !iconRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(iconRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div 
      ref={iconRef}
      className="flex flex-col items-center m-4 group cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5 }}
    >
      <div className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
        <div className="relative w-10 h-10">
          <Image 
            src={icon} 
            alt={name}
            fill
            sizes="40px"
            className="object-contain"
            priority={index < 8}
          />
        </div>
      </div>
      
      <p className="text-sm text-white/80 text-center font-light transition-colors duration-300 group-hover:text-white">
        {name}
      </p>
    </motion.div>
  );
};

// Clean Tech component
const Tech = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);
  
  return (
    <section ref={sectionRef} className="py-16">
      <motion.h2 
        className="text-center text-3xl font-light mb-12 text-white"
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        Technologies
      </motion.h2>
      
      <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
        {technologies.map((technology, index) => (
          <TechIcon
            key={technology.name}
            icon={technology.icon}
            name={technology.name}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default SectionWrapper(Tech, "");