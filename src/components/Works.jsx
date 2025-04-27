import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

// Simplified ProjectCard without Tilt for better performance
const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  return (
    <motion.div 
      variants={fadeIn("up", "spring", index * 0.25, 0.75)} // Reduced delay multiplier
      className="w-full sm:w-[360px]"
    >
      <div className='bg-tertiary p-5 rounded-2xl h-full flex flex-col'>
        <div className='relative w-full h-[230px]'>
          <img
            src={image}
            alt={name}
            className='w-full h-full object-cover rounded-2xl filter grayscale'
            loading="lazy" // Add lazy loading for images
          />

          <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
            <div
              onClick={() => window.open(source_code_link, "_blank")}
              className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
            >
              <img
                src={github}
                alt='source code'
                className='w-1/2 h-1/2 object-contain'
              />
            </div>
          </div>
        </div>

        <div className='mt-5 flex-grow'>
          <h3 className='text-white font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-secondary text-[14px] line-clamp-6'>{description}</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className='text-[14px] text-white'
            >
              #{tag.name}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Works = () => {
  // Add intersection observer for better loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const projectElements = document.querySelectorAll('.project-item');
    projectElements.forEach(el => observer.observe(el));

    return () => {
      projectElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <section className="relative z-10" id="projects">
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText}`}>My work</p>
        <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          Following projects showcase my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos. They reflect my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </motion.p>
      </div>

      <div className='mt-20 flex flex-wrap gap-7 justify-center sm:justify-start project-grid'>
        {projects.map((project, index) => (
          <div key={`project-${index}`} className="project-item">
            <ProjectCard 
              index={index} 
              {...project} 
            />
          </div>
        ))}
      </div>
    </section>
  );
};

// Add custom wrapper with reduced motion for mobile
const MobileOptimizedWrapper = (Component, idName) => {
  return function HOC() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Simplified wrapper without heavy animations for mobile
    if (isMobile) {
      return (
        <section className="relative w-full mx-auto px-4 py-16 z-10" id={idName}>
          <span className="hash-span" id={idName}>&nbsp;</span>
          <Component />
        </section>
      );
    }
    
    // Use original SectionWrapper for desktop
    return SectionWrapper(Component, idName)();
  };
};

export default MobileOptimizedWrapper(Works, "projects");