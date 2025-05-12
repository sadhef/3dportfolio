import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { github } from "../../assets"; // Fixed import path

// Enhanced project card with parallax and responsive design
const ParallaxProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [disableEffects, setDisableEffects] = useState(false);
  
  // Device capability detection
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    setDisableEffects(prefersReducedMotion || isMobile);
    
    // Set up intersection observer to trigger animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once it's been visible, we can stop observing
          if (cardRef.current) {
            observer.unobserve(cardRef.current);
          }
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
      }
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
  
  // Parallax effect on card hover (only for non-mobile)
  const { scrollY } = useScroll();
  const y = useTransform(
    scrollY,
    [0, 1000],
    disableEffects ? [0, 0] : [0, index % 2 === 0 ? -30 : 30]
  );
  
  // Initial animation variants
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        delay: index * 0.2,
        ease: [0.43, 0.13, 0.23, 0.96]
      }
    }
  };

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      style={{ y: disableEffects ? 0 : y }}
      className="relative flex flex-col h-full project-card"
      whileHover={disableEffects ? {} : { y: -10, transition: { duration: 0.3 } }}
    >
      <div className="w-full bg-tertiary p-5 rounded-2xl h-full flex flex-col relative group overflow-hidden">
        {/* Project image with parallax effect on hover */}
        <div className="relative w-full h-[230px] overflow-hidden rounded-2xl">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            width="100%"
            height="230"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open(source_code_link, "_blank")}
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
            >
              <img
                src={github}
                alt="source code"
                className="w-1/2 h-1/2 object-contain"
              />
            </motion.div>
          </div>
        </div>

        {/* Content with subtle parallax depth */}
        <div className="mt-5 flex-grow">
          <h3 className="text-white font-bold text-[24px] tracking-wider">{name}</h3>
          <p className="mt-2 text-secondary text-[14px] leading-relaxed project-description overflow-hidden">
            {description}
          </p>
        </div>

        {/* Tags with staggered animation */}
        <div className="mt-4 flex flex-wrap gap-2 pb-2">
          {tags.map((tag, tagIndex) => (
            <motion.p
              key={`${name}-${tag.name}`}
              initial={{ opacity: 0, x: -10 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
              transition={{ delay: 0.5 + (tagIndex * 0.1) }}
              className="text-[14px] text-white tech-tag"
            >
              #{tag.name}
            </motion.p>
          ))}
        </div>
        
        {/* Card shine effect overlay (desktop only) */}
        {!disableEffects && (
          <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700 bg-gradient-to-tr from-white/5 via-white/10 to-transparent" />
        )}
      </div>
    </motion.div>
  );
};

export default ParallaxProjectCard;