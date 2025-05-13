"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

// Simple service card without parallax tilt effect
const ServiceCard = ({ index, title, icon }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  
  // Use Intersection Observer for better performance
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
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="xs:w-[250px] w-full p-[1px] rounded-[20px] shadow-card border border-gray-700"
      whileHover={{ translateY: -10, transition: { duration: 0.3 } }}
    >
      <div className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
        <div className="relative w-16 h-16"> 
          <Image
            src={icon}
            alt={`${title} icon`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain filter grayscale"
            priority
          />
        </div>

        <h3 className="text-white text-[20px] font-bold text-center">
          {title}
        </h3>
      </div>
    </motion.div>
  );
};

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  // Use Intersection Observer to detect when section is visible
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
    <div ref={sectionRef}>
      <motion.div
        variants={textVariant()}
        initial="hidden"
        animate={isVisible ? "show" : "hidden"}
      >
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        initial="hidden"
        animate={isVisible ? "show" : "hidden"}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        I am a highly motivated Full Stack Developer with experience in dynamic 
        and fast-paced environments. My expertise spans the MERN stack (MongoDB, Express.js, 
        React.js, and Node.js) with proficiency in PostgreSQL for relational database management.
        I've integrated Python-based data science, AI, and machine learning capabilities
        and have experience with Docker for containerization and deployment.
        Additionally, I've developed cross-platform mobile applications using React Native, 
        leveraging RESTful APIs and managing state with Redux/Context API.
      </motion.p>

      <div className="mt-20 flex flex-wrap gap-10 justify-center">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(About, "about");