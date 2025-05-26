"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

// Memoized TechIcon with simplified animations
const TechIcon = memo(({ icon, name, index }) => {
  return (
    <motion.div 
      className="flex flex-col items-center m-4 group cursor-pointer"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="w-16 h-16 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/20">
        <div className="relative w-10 h-10">
          <Image 
            src={icon} 
            alt={name}
            fill
            sizes="40px"
            className="object-contain"
            loading={index < 8 ? "eager" : "lazy"}
          />
        </div>
      </div>
      
      <p className="text-sm text-white/80 text-center font-light transition-colors duration-300 group-hover:text-white">
        {name}
      </p>
    </motion.div>
  );
});

TechIcon.displayName = 'TechIcon';

// Optimized Tech component
const Tech = () => {
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.05
      }
    }
  }), []);

  const titleVariants = useMemo(() => ({
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }), []);

  return (
    <section className="py-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.h2 
          className="text-center text-3xl font-light mb-12 text-white"
          variants={titleVariants}
        >
          Technologies I Work With
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
      </motion.div>
    </section>
  );
};

export default SectionWrapper(Tech, "");