import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

// Universal project card that works on all browsers
const ProjectCard = ({ index, name, description, tags, image, source_code_link }) => {
  // Use simpler animation variants that work across browsers
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: index * 0.1,  // Reduced delay
        ease: "easeOut"      // Simple easing function
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={cardVariants}
      className="project-card w-full sm:w-[360px]"
    >
      <div className="bg-tertiary p-5 rounded-2xl h-full flex flex-col">
        <div className="relative w-full h-[230px]">
          {/* Use loading="eager" for critical images */}
          <img
            src={image}
            alt="project"
            loading="eager"
            className="w-full h-full object-cover rounded-2xl"
            style={{ transform: 'translateZ(0)' }} // Force hardware acceleration
          />

          <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
            <div
              onClick={() => window.open(source_code_link, "_blank")}
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
            >
              <img
                src={github}
                alt="source code"
                className="w-1/2 h-1/2 object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex-grow">
          <h3 className="text-white font-bold text-[24px]">{name}</h3>
          <p className="mt-2 text-secondary text-[14px] project-description">
            {description}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <p key={`${name}-${tag.name}`} className="text-[14px] text-white">
              #{tag.name}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Works = () => {
  const sectionRef = useRef(null);

  // Handle visibility with standard approach
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            
            // Find all project cards within this section and add a class progressively
            const cards = entry.target.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                card.classList.add('card-visible');
              }, index * 100); // Progressive delay
            });
          }
        });
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
    <section ref={sectionRef} className="works-section pt-16" id="projects">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Using standard motion.div but with simpler animations */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={textVariant()}
          className="header-container" // This helps target with CSS if needed
        >
          <p className={`${styles.sectionSubText}`}>My work</p>
          <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
        </motion.div>

        <motion.p
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          Following projects showcases my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </motion.p>

        {/* Projects grid with native CSS grid for better cross-browser support */}
        <div className="projects-grid mt-20">
          {projects.map((project, index) => (
            <ProjectCard 
              key={`project-${index}`} 
              index={index} 
              {...project} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Wrap with SectionWrapper but use additional CSS to ensure cross-browser compatibility
export default SectionWrapper(Works, "projects");