import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

// Simple detection for Safari browser
const isSafari = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1;
};

// ProjectCard without animations for Safari
const SafariProjectCard = ({
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  return (
    <div className="w-full sm:w-[360px] bg-tertiary p-5 rounded-2xl safari-card">
      <div className="relative w-full h-[230px]">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover rounded-2xl"
          // No filter for Safari
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

      <div className="mt-5">
        <h3 className="text-white font-bold text-[24px]">{name}</h3>
        <p className="mt-2 text-secondary text-[14px] safari-text-truncate">
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

// Standard ProjectCard with animations for other browsers
const StandardProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.25, 0.75)}>
      <div className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full h-full">
        <div className="relative w-full h-[230px]">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover rounded-2xl filter grayscale"
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

        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px]">{name}</h3>
          <p className="mt-2 text-secondary text-[14px]">{description}</p>
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
    </motion.div>
  );
};

const Works = () => {
  const [isSafariBrowser, setIsSafariBrowser] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Check if running in Safari
  useEffect(() => {
    setIsSafariBrowser(isSafari());
    
    // Force DOM update to ensure Safari renders the component
    setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    // Safari-specific CSS fixes
    if (isSafari()) {
      document.documentElement.classList.add('safari');
      
      // Force repaint for Safari
      const worksSection = document.getElementById('projects');
      if (worksSection) {
        worksSection.style.display = 'none';
        setTimeout(() => {
          worksSection.style.display = 'block';
        }, 50);
      }
    }
  }, []);

  // Conditional rendering based on browser
  const renderProjects = () => {
    if (isSafariBrowser) {
      return (
        <div className="mt-20 flex flex-wrap gap-7 safari-works-grid">
          {projects.map((project, index) => (
            <SafariProjectCard
              key={`project-${index}`}
              {...project}
            />
          ))}
        </div>
      );
    }
    
    return (
      <div className="mt-20 flex flex-wrap gap-7">
        {projects.map((project, index) => (
          <StandardProjectCard 
            key={`project-${index}`}
            index={index}
            {...project}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="works-section">
      {/* Safari-friendly header (no animations) */}
      {isSafariBrowser ? (
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
      ) : (
        <>
          <motion.div variants={textVariant()}>
            <p className={styles.sectionSubText}>My work</p>
            <h2 className={styles.sectionHeadText}>Projects.</h2>
          </motion.div>

          <div className="w-full flex">
            <motion.p
              variants={fadeIn("", "", 0.1, 1)}
              className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
            >
              Following projects showcases my skills and experience through
              real-world examples of my work. Each project is briefly described with
              links to code repositories and live demos in it. It reflects my
              ability to solve complex problems, work with different technologies,
              and manage projects effectively.
            </motion.p>
          </div>
        </>
      )}

      {/* Render projects differently based on browser */}
      {isLoaded && renderProjects()}
    </div>
  );
};

// Create a Safari-aware wrapper
const SafariAwareSectionWrapper = (Component, idName) => {
  return function HOC() {
    const usingSafari = isSafari();
    
    // Simplified wrapper for Safari
    if (usingSafari) {
      return (
        <section 
          className="safari-section relative w-full min-h-screen mx-auto px-4 py-10 z-10" 
          id={idName}
        >
          <span className="hash-span" id={idName}>&nbsp;</span>
          <Component />
        </section>
      );
    }
    
    // Use original SectionWrapper for other browsers
    return SectionWrapper(Component, idName)();
  };
};

export default SafariAwareSectionWrapper(Works, "projects");