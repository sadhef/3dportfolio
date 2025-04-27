import React from "react";
import { SectionWrapper } from "../hoc";
import { technologies } from "../constants";
import { motion } from "framer-motion";

const TechIcon = ({ icon, name, index }) => {
  // Calculate delay based on index
  const delay = index * 0.05;

  return (
    <motion.div 
      className="flex flex-col items-center m-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mb-2">
        <img 
          src={icon} 
          alt={name} 
          className="w-12 h-12 object-contain filter grayscale"
        />
      </div>
      <p className="text-sm text-white-100 text-center">{name}</p>
    </motion.div>
  );
};

// Replace the 3D ball canvas with a simple 2D version
const Tech = () => {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-5 mt-10">
      {technologies.map((technology, index) => (
        <TechIcon
          key={technology.name}
          icon={technology.icon}
          name={technology.name}
          index={index}
        />
      ))}
    </div>
  );
};

export default SectionWrapper(Tech, "");