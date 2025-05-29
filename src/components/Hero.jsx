"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

// --- Data for Skills Nebula ---
const SKILLS_DATA = [
  { id: "react", name: "React", x: 0.2, y: 0.25, size: 5, keywords: ["Full Stack Developer", "MERN Specialist", "React"] },
  { id: "node", name: "Node.js", x: 0.8, y: 0.3, size: 5, keywords: ["Full Stack Developer", "MERN Specialist", "Node.js"] },
  { id: "mongo", name: "MongoDB", x: 0.3, y: 0.75, size: 4, keywords: ["MERN Specialist", "MongoDB"] },
  { id: "express", name: "Express", x: 0.7, y: 0.8, size: 4, keywords: ["MERN Specialist", "Express"] },
  { id: "python", name: "Python", x: 0.5, y: 0.15, size: 6, keywords: ["Full Stack Developer", "Python Developer", "Python"] },
  { id: "js", name: "JavaScript", x: 0.4, y: 0.55, size: 6, keywords: ["Full Stack Developer", "JavaScript"] },
  { id: "docker", name: "Docker", x: 0.15, y: 0.6, size: 4, keywords: ["Docker"] },
  { id: "ai", name: "AI Solutions", x: 0.85, y: 0.55, size: 5, keywords: ["Python Developer", "AI solutions"] }
];


// --- AnimatedCharacter Component (largely unchanged, but ensure no conflicts) ---
const calculateCharacterMovement = (mouseX, mouseY, index, isClient, heroCenterX, heroCenterY) => {
  const defaultWidth = 1920;
  const defaultHeight = 1080;
  const width = isClient ? window.innerWidth : defaultWidth;
  const height = isClient ? window.innerHeight : defaultHeight;

  // Normalize mouse position relative to screen center for parallax base
  const normMouseX = mouseX ? (mouseX / width - 0.5) : 0;
  const normMouseY = mouseY ? (mouseY / height - 0.5) : 0;

  // Movement factor - adjust for desired intensity
  const factor = 20; // Increased factor for more noticeable movement

  // Apply parallax based on normalized mouse, scaled by index for slight variation
  // More distinct movement for each character
  const moveX = normMouseX * factor * (1 + (index % 3 - 1) * 0.2); // e.g. -0.2, 0, 0.2 variation
  const moveY = normMouseY * factor * (1 + (index % 2 - 0.5) * 0.2); // e.g. -0.1, 0.1 variation


  // Rotation based on mouse position relative to the hero text's center for a more intuitive 3D effect
  // This requires knowing the hero text's center, or approximate it as screen center for now
  const relativeMouseX = mouseX ? (mouseX - (heroCenterX || width / 2)) / (width / 2) : 0;
  const relativeMouseY = mouseY ? (mouseY - (heroCenterY || height / 2)) / (height / 2) : 0;
  const rotateFactor = 5;


  return {
    x: moveX,
    y: moveY,
    rotateY: relativeMouseX * rotateFactor * (1 + (index % 2 - 0.5) * 0.1),
    rotateX: -relativeMouseY * rotateFactor * (1 + (index % 3 - 1) * 0.1),
    textShadow: `${normMouseX * 2}px ${normMouseY * 2}px 3px rgba(0,0,0,0.2)`,
  };
};

const AnimatedCharacter = ({ character, index, mouseX, mouseY, isClient, heroCenterX, heroCenterY }) => {
  const movement = calculateCharacterMovement(mouseX, mouseY, index, isClient, heroCenterX, heroCenterY);
  const delay = index * 0.03 + 0.2; // Base delay + stagger

  return (
    <motion.span
      className="relative inline-block text-white" // Ensure this doesn't get pointer-events-none
      initial={{ opacity: 0, y: 30, scale: 0.8, rotateX: -20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        // Parallax movements applied here
        x: movement.x,
        // y: movement.y, // y is used for initial animation, parallax y could conflict.
        // Let's use a different y for parallax or combine them carefully.
        // For now, prioritize initial y animation and use movement.y for subtle shifts if needed.
        // Or, make initial y animation to 0, then apply parallax y on top.
        // Let's try direct application:
        translateY: movement.y, // Using translateY to avoid conflict with initial y
        rotateY: movement.rotateY,
        // rotateX: movement.rotateX, // This is the parallax rotateX
      }}
      transition={{
        opacity: { delay, duration: 0.4, ease: "easeOut" },
        y: { delay, duration: 0.4, ease: "easeOut" },
        scale: { delay, duration: 0.4, ease: "easeOut" },
        rotateX: { delay, duration: 0.4, ease: "easeOut" }, // Initial rotateX animation
        // Parallax transitions (should be quick to respond)
        translateX: { duration: 0.1, ease: "linear" },
        translateY: { duration: 0.1, ease: "linear" },
        rotateY: { duration: 0.15, ease: "linear" },
        // The parallax rotateX is part of the animate prop, so its transition is tied to the main rotateX or needs its own.
        // If we want a separate transition for parallax rotateX, we might need to put it in `style` and animate `style.transform`
      }}
      style={{
        textShadow: movement.textShadow,
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
        // Applying parallax rotateX via style to allow separate animation from initial rotateX
        // This is a bit more complex; for now, the animate prop handles one rotateX.
        // The 'movement.rotateX' from calculateCharacterMovement will be part of the animate target.
      }}
    >
      {character}
    </motion.span>
  );
};


// --- SkillNebulaNode (Individual Skill Star) ---
const SkillNebulaNode = ({ skill, isClient, isActive, mouseX, mouseY }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 }); // Relative to its initial defined spot
  const nodeRef = useRef(null);

  useEffect(() => {
    // Initial position based on skill.x, skill.y
    // The parent SkillNebula will handle absolute positioning.
    // This internal position is for subtle movements.
    const moveInterval = setInterval(() => {
      setPosition({
        x: (Math.random() - 0.5) * 8, // Small random drift
        y: (Math.random() - 0.5) * 8,
      });
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(moveInterval);
  }, []);
  
  // Parallax for skill nodes
  const parallaxFactor = 0.005 + (skill.size / 1000); // Smaller factor for less movement, vary by size
  const parallaxX = mouseX ? (mouseX / (isClient ? window.innerWidth : 1920) - 0.5) * (isClient ? window.innerWidth : 1920) * parallaxFactor : 0;
  const parallaxY = mouseY ? (mouseY / (isClient ? window.innerHeight : 1080) - 0.5) * (isClient ? window.innerHeight : 1080) * parallaxFactor : 0;


  return (
    <motion.div
      ref={nodeRef}
      className="absolute rounded-full"
      style={{
        width: skill.size * 1.5, // Adjust base size
        height: skill.size * 1.5,
        left: `calc(${skill.x * 100}% - ${skill.size * 0.75}px)`, // Center the dot
        top: `calc(${skill.y * 100}% - ${skill.size * 0.75}px)`,
        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)',
        boxShadow: isActive ? `0 0 ${skill.size * 2}px rgba(255, 255, 255, 0.7), 0 0 ${skill.size * 3}px rgba(180, 180, 255, 0.5)` : `0 0 ${skill.size}px rgba(255, 255, 255, 0.2)`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isActive ? [1, 1.3, 1] : 1,
        opacity: 1,
        x: position.x + parallaxX, // Combine random drift with parallax
        y: position.y + parallaxY,
      }}
      transition={{
        scale: { duration: 0.5, repeat: isActive ? Infinity : 0, ease: "easeInOut" },
        opacity: { duration: 1, delay: Math.random() * 1 },
        x: { duration: 3, ease: "linear" },
        y: { duration: 3, ease: "linear" },
        backgroundColor: { duration: 0.3 },
        boxShadow: {duration: 0.3},
      }}
    >
      {/* Optional: tiny label on hover, kept simple for now */}
    </motion.div>
  );
};

// --- SkillNebula Container ---
const SkillNebula = ({ skills, isClient, activeSkillIds, mouseX, mouseY }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10"> {/* Ensure it's behind text */}
      {skills.map((skill) => (
        <SkillNebulaNode
          key={skill.id}
          skill={skill}
          isClient={isClient}
          isActive={activeSkillIds.includes(skill.id)}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      ))}
    </div>
  );
};


// --- Hero Component (Updated) ---
const Hero = () => {
  const [isClient, setIsClient] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false); // For initial load animations

  const heroRef = useRef(null);
  const nameContainerRef = useRef(null); // Ref for the H1 name container
  const roleContainerRef = useRef(null); // Ref for the role text container

  const firstName = "Mohammed";
  const lastName = "Sadhef";

  const roles = ["Full Stack Developer", "MERN Specialist", "Python Developer", "AI solutions enthusiast"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [activeSkillIds, setActiveSkillIds] = useState([]);
  const [connectionLines, setConnectionLines] = useState([]);

  // Hero text center for character parallax calculation
  const [heroTextCenter, setHeroTextCenter] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsClient(true);
    // Delay visibility for animations to kick in after mount
    const timer = setTimeout(() => setIsVisible(true), 100);


    let lastMoveTime = 0;
    const moveThreshold = 16; // Roughly 60fps

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastMoveTime > moveThreshold) {
        setMousePosition({ x: e.clientX, y: e.clientY });
        lastMoveTime = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    // Calculate hero text center once it's rendered
    if (nameContainerRef.current) {
        const rect = nameContainerRef.current.getBoundingClientRect();
        setHeroTextCenter({
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
        });
    }


    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Role Typing Effect
  useEffect(() => {
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseBeforeDelete = 2000;
    const pauseBeforeNewRole = 500;

    let typingInterval;

    const handleTyping = () => {
      const currentRole = roles[roleIndex];
      if (!isDeleting) {
        if (displayedText.length < currentRole.length) {
          setDisplayedText(currentRole.substring(0, displayedText.length + 1));
        } else {
          // Role fully typed, pause then start deleting
          setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
        }
      } else {
        if (displayedText.length > 0) {
          setDisplayedText(currentRole.substring(0, displayedText.length - 1));
        } else {
          // Role fully deleted
          setIsDeleting(false);
          setRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
           // Clear connections briefly when role changes
          setActiveSkillIds([]);
          setConnectionLines([]);
        }
      }
    };
    
    typingInterval = setInterval(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearInterval(typingInterval);

  }, [displayedText, isDeleting, roleIndex, roles]);


  // Update Active Skills and Connection Lines based on displayedText (role)
  useEffect(() => {
    if (!isClient || !roleContainerRef.current) { // Ensure DOM element exists
        setActiveSkillIds([]);
        setConnectionLines([]);
        return;
    }

    const currentRoleKeywords = roles[roleIndex].toLowerCase().split(" ");
    const newActiveSkillIds = [];
    SKILLS_DATA.forEach(skill => {
      if (skill.keywords.some(kw => displayedText.toLowerCase().includes(kw.toLowerCase()))) {
        newActiveSkillIds.push(skill.id);
      }
    });
    setActiveSkillIds(newActiveSkillIds);

    // Calculate connection lines
    const newConnectionLines = [];
    const roleRect = roleContainerRef.current.getBoundingClientRect();
    // Use a point slightly above the role text as the source
    const sourceX = roleRect.left + roleRect.width / 2;
    const sourceY = roleRect.top + roleRect.height / 2 - 10; // Adjusted Y

    newActiveSkillIds.forEach(skillId => {
      const skill = SKILLS_DATA.find(s => s.id === skillId);
      if (skill) {
        // Convert normalized skill positions to screen coordinates
        const targetX = skill.x * window.innerWidth;
        const targetY = skill.y * window.innerHeight;
        newConnectionLines.push({
          id: `line-${skillId}`,
          x1: sourceX,
          y1: sourceY,
          x2: targetX,
          y2: targetY,
        });
      }
    });
    setConnectionLines(newConnectionLines);

  }, [displayedText, roleIndex, roles, isClient]); // isClient ensures window is defined

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative w-full h-screen mx-auto overflow-hidden flex items-center justify-center bg-gray-900" // Added a base bg color
      aria-label="Introduction - Mohammed Sadhef, Full Stack Developer"
    >
      {isClient && <SkillNebula skills={SKILLS_DATA} isClient={isClient} activeSkillIds={activeSkillIds} mouseX={mousePosition.x} mouseY={mousePosition.y} />}

      {/* SVG Overlay for Connection Lines */}
      {isClient && connectionLines.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ opacity: 0.7 }}>
          {connectionLines.map(line => (
            <motion.line
              key={line.id}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="rgba(150, 150, 200, 0.4)" // Light blueish lines
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              exit={{ pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          ))}
        </svg>
      )}


      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-16 text-center flex flex-col items-center">
        <motion.div /* Welcome Text */
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4 inline-block"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-8 bg-white mr-3 opacity-60" />
            <span className="text-white text-sm tracking-widest uppercase font-light">Welcome to my portfolio</span>
            <div className="h-px w-8 bg-white ml-3 opacity-60" />
          </div>
        </motion.div>

        <h1 ref={nameContainerRef} className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-2 tracking-tight leading-none">
          <div className="inline-block">
            {firstName.split("").map((char, index) => (
              <AnimatedCharacter key={`first-${index}`} character={char} index={index} mouseX={mousePosition.x} mouseY={mousePosition.y} isClient={isClient} heroCenterX={heroTextCenter.x} heroCenterY={heroTextCenter.y} />
            ))}
          </div>
          <span className="sm:hidden"><br /></span>
          <span className="hidden sm:inline">&nbsp;</span>
          <div className="inline-block">
            {lastName.split("").map((char, index) => (
              <AnimatedCharacter
                key={`last-${index}`}
                character={char}
                index={index + firstName.length}
                mouseX={mousePosition.x}
                mouseY={mousePosition.y}
                isClient={isClient}
                heroCenterX={heroTextCenter.x}
                heroCenterY={heroTextCenter.y}
              />
            ))}
          </div>
        </h1>

        <motion.div /* Role Typing Area */
          ref={roleContainerRef}
          className="h-8 my-4 sm:my-6 text-white text-lg sm:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: firstName.length * 0.03 + 0.5 }} // Delay after name animation
        >
          <span className="font-light">I'm a </span>
          <span className="text-white font-bold relative">
            {displayedText}
            {isClient && (
              <span className="absolute -right-1 top-0 h-full w-0.5 bg-white animate-blink"></span>
            )}
          </span>
        </motion.div>

        <motion.p /* Subtitle */
          className="max-w-2xl mx-auto text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ delay: firstName.length * 0.03 + 0.8 }}
        >
          Specializing in creating modern web applications with MERN stack, Python, and JavaScript. Integrating AI solutions for innovative digital experiences.
        </motion.p>

        <motion.div /* Buttons */
          className="flex flex-wrap justify-center gap-4 mt-4 sm:mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ delay: firstName.length * 0.03 + 1.0 }}
        >
          <motion.a href="#projects" className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-black font-medium rounded-full shadow-lg text-sm sm:text-base"
            whileHover={{ scale: 1.05, backgroundColor: "#f0f0f0" }} whileTap={{ scale: 0.98 }}>
            View Projects
          </motion.a>
          <motion.a href="#contact" className="px-6 sm:px-8 py-2 sm:py-3 border border-white text-white font-medium rounded-full text-sm sm:text-base"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }} whileTap={{ scale: 0.98 }}>
            Contact Me
          </motion.a>
        </motion.div>

        <motion.div /* Tech Pills */
          className="flex flex-wrap justify-center gap-x-3 gap-y-2 sm:gap-x-4 mt-8 sm:mt-12 max-w-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: firstName.length * 0.03 + 1.2 }}
        >
          {["React", "Node.js", "MongoDB", "Express", "Python", "JavaScript", "Docker"].map((tech, index) => (
            <motion.span key={index} className="px-2 sm:px-3 py-1 bg-gray-800 bg-opacity-50 rounded-full text-xs sm:text-sm text-gray-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (firstName.length * 0.03 + 1.4) + index * 0.07 }}
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.1)" }}>
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {isClient && ( /* Scroll Indicator */
          <motion.div className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? [0, 1, 0] : 0, y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, delay: firstName.length * 0.03 + 2.0 }}>
            <div className="w-5 h-10 border-2 border-white rounded-full flex justify-center items-start p-2">
              <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
                className="w-1 h-1 bg-white rounded-full" />
            </div>
          </motion.div>
        )}
      </div>

      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;