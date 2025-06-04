"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";

import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";

// Static TechIcon component for better performance on all devices
const TechIcon = ({ icon, name, index, isVisible }) => {
  const iconRef = useRef(null);
  const [isInView, setIsInView] = useState(false);

  // Use Intersection Observer to only render when visible
  useEffect(() => {
    if (typeof window === 'undefined' || !iconRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target); // Stop observing once the icon is in view
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(iconRef.current);
    return () => observer.disconnect(); // Cleanup observer when component unmounts
  }, []);

  // Simplified animation for better performance
  const animations = {
    initial: { opacity: 0 },
    animate: isVisible ? { opacity: 1 } : { opacity: 0 },
    transition: { duration: 0.3, delay: index * 0.05 }
  };

  return (
    <motion.div 
      ref={iconRef}
      className="flex flex-col items-center m-3"
      {...animations}
    >
      {isInView ? (
        <>
          <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-2">
            <div className="relative w-12 h-12">
              <Image 
                src={icon} 
                alt={`${name} icon`}
                fill
                sizes="(max-width: 768px) 48px, 48px"
                className="object-contain filter grayscale"
                priority={index < 18} // Only prioritize first few icons
              />
            </div>
          </div>
          <p className="text-sm text-white-100 text-center font-light">{name}</p>
        </>
      ) : (
        // Placeholder while loading
        <div className="w-20 h-20 rounded-full bg-gray-800 animate-pulse"></div>
      )}
    </motion.div>
  );
};

// Main Tech component with performance optimizations
const Tech = () => {
  const controls = useAnimation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  // Use useState to track the number of visible icons
  const [visibleCount, setVisibleCount] = useState(6);

  // Use Intersection Observer to trigger animations and progressive loading
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          controls.start("visible");

          // Progressive rendering of icons
          const loadIcons = () => {
            setVisibleCount(prev => Math.min(prev + 3, technologies.length)); // More efficient loading
          };

          loadIcons(); // Load initially
          // Use requestIdleCallback for smoother and less intrusive loading of additional icons
          if (window.requestIdleCallback) {
            requestIdleCallback(loadIcons);
          } else {
            setTimeout(loadIcons, 100); // Fallback for browsers that don't support requestIdleCallback
          }

          return () => observer.disconnect();
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    observer.observe(sectionRef.current);

    return () => observer.unobserve(sectionRef.current); // Cleanup observer
  }, [controls]);

  // Only render the visible batch of icons
  const visibleTechnologies = useMemo(() => technologies.slice(0, visibleCount), [visibleCount]);

  return (
    <section ref={sectionRef} className="relative py-10" aria-labelledby="tech-section-title">
      <h2 id="tech-section-title" className="text-center text-2xl font-bold mb-10">
        Technologies
      </h2>

      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
        }}
        className="flex flex-wrap justify-center gap-5 mt-10"
      >
        {visibleTechnologies.map((technology, index) => (
          <TechIcon
            key={technology.name}
            icon={technology.icon}
            name={technology.name}
            index={index}
            isVisible={isVisible}
          />
        ))}
      </motion.div>

      {/* Loading indicator for remaining technologies */}
      {visibleCount < technologies.length && isVisible && (
        <div className="text-center mt-4">
          <div className="inline-block w-6 h-6 border-t-2 border-white rounded-full animate-spin"></div>
        </div>
      )}
    </section>
  );
};

export default SectionWrapper(Tech, "");
