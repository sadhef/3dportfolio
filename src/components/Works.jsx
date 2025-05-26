"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";

// Minimal ProjectCard with clean design
const ProjectCard = ({ index, name, description, tags, image, source_code_link }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  
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

  return (
    <motion.div
      ref={cardRef}
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
    >
      {/* Image */}
      <div className="relative w-full h-48 mb-6 rounded-xl overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* GitHub Link */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => window.open(source_code_link, "_blank")}
            className="w-10 h-10 bg-black/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/90 transition-colors duration-200"
          >
            <div className="relative w-5 h-5">
              <Image
                src={github}
                alt="GitHub"
                fill
                sizes="20px"
                className="object-contain"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div>
        <h3 className="text-white font-semibold text-xl mb-3">{name}</h3>
        <p className="text-white/70 text-sm leading-relaxed mb-4">{description}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={`${name}-${tag.name}`}
              className={`text-xs px-3 py-1 rounded-full bg-white/10 ${tag.color} font-medium`}
            >
              #{tag.name}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Clean Works component
const Works = () => {
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
    <div ref={sectionRef} className="w-full mx-auto py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <motion.p 
          className="text-white/60 text-lg font-light tracking-wide uppercase mb-2"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          My work
        </motion.p>
        
        <motion.h2 
          className="text-white text-4xl md:text-5xl font-light mb-6"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Projects.
        </motion.h2>
        
        <motion.p
          className="text-white/70 text-base max-w-3xl mx-auto leading-relaxed px-4"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Following projects showcase my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos.
        </motion.p>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 max-w-7xl mx-auto">
        {projects.map((project, index) => (
          <ProjectCard key={`project-${index}`} index={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Works, "projects");