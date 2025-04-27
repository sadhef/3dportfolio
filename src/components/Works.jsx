import React, { useState, useEffect } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

// Optimized ProjectCard with lazy loading and error handling
const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Handle image loading
  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  // Handle image error
  const handleImageError = () => {
    setHasError(true);
  };

  return (
    <motion.div 
      variants={fadeIn("up", "spring", index * 0.3, 0.5)} // Reduced animation time
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <Tilt
        tiltMaxAngleX={15} // Reduced tilt for better performance
        tiltMaxAngleY={15}
        scale={1.05}
        transitionSpeed={1000}
        className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full h-full shadow-card'
      >
        <div className='relative w-full h-[230px] bg-gray-800 rounded-2xl overflow-hidden'>
          {/* Show loading placeholder before image loads */}
          {!isImageLoaded && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-tertiary">
              <p className="text-secondary text-sm">Loading...</p>
            </div>
          )}
          
          {/* Show fallback if image fails to load */}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-tertiary">
              <p className="text-secondary text-sm">{name}</p>
            </div>
          )}
          
          <img
            src={image}
            alt={name}
            className={`w-full h-full object-cover rounded-2xl filter grayscale ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
            style={{ transition: 'opacity 0.3s ease-in-out' }}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy" // Use native lazy loading
          />

          <div className='absolute inset-0 flex justify-end m-3 card-img_hover'>
            <div
              onClick={() => window.open(source_code_link, "_blank")}
              className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
            >
              <img
                src={github}
                alt='View Project'
                className='w-1/2 h-1/2 object-contain'
              />
            </div>
          </div>
        </div>

        <div className='mt-5'>
          <h3 className='text-white font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-secondary text-[14px] line-clamp-4'>{description}</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.slice(0, 4).map((tag) => ( // Limit tags to 4 for better display
            <p
              key={`${name}-${tag.name}`}
              className='text-[14px] text-white'
            >
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  const [renderedProjects, setRenderedProjects] = useState([]);
  
  // Implement progressive loading for performance
  useEffect(() => {
    // Render first 2 projects immediately
    setRenderedProjects(projects.slice(0, 2));
    
    // Add remaining projects after a short delay
    const timer = setTimeout(() => {
      setRenderedProjects(projects);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} `}>My work</p>
        <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          Following projects showcase my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos. These projects reflect my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </motion.p>
      </div>

      <div className='mt-20 flex flex-wrap justify-center gap-7'>
        {renderedProjects.map((project, index) => (
          <ProjectCard 
            key={`project-${index}`} 
            index={index} 
            {...project} 
          />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");