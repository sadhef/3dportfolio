import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

// Universal card component using Safari fixes for all browsers
const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  return (
    <div className="project-card w-full bg-tertiary p-5 rounded-2xl h-full flex flex-col">
      <div className="relative w-full h-[230px]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-2xl"
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
        <p className="mt-2 text-secondary text-[14px] project-description overflow-hidden">
          {description}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <p
            key={`${name}-${tag.name}`}
            className="text-[14px] text-white"
          >
            #{tag.name}
          </p>
        ))}
      </div>
    </div>
  );
};

const Works = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Force component to update once mounted
  useEffect(() => {
    // Force DOM update to ensure component renders
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
  }, []);

  return (
    <div className="works-section">
      {/* Standard header without complex animations */}
      <div>
        <p className={styles.sectionSubText}>My work</p>
        <h2 className={styles.sectionHeadText}>Projects.</h2>
        <p className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]">
          Following projects showcases my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </p>
      </div>

      {/* Render projects with exactly three cards per row */}
      {isLoaded && (
        <div className="mt-20 three-column-grid">
          {projects.map((project, index) => (
            <div key={`project-${index}`} className="card-wrapper">
              <ProjectCard
                index={index}
                {...project}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Create a universal wrapper that matches other section sizes
const ConsistentSectionWrapper = (Component, idName) => {
  return function HOC() {
    return (
      <section 
        className="consistent-section relative w-full mx-auto z-10" 
        id={idName}
      >
        {/* Match the padding and margin with other sections */}
        <div className={`${styles.padding} max-w-7xl mx-auto relative`}>
          <span className="hash-span" id={idName}>&nbsp;</span>
          <Component />
        </div>
      </section>
    );
  };
};

export default ConsistentSectionWrapper(Works, "projects");