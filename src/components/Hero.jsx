"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

// Throttle function
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function () {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function () {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

const calculateMovement = (mouseX, mouseY, index, isClient) => {
  const defaultWidth = 1920;
  const defaultHeight = 1080;
  const width = isClient ? window.innerWidth : defaultWidth;
  const height = isClient ? window.innerHeight : defaultHeight;

  const moveX = mouseX ? (mouseX / width - 0.5) * 10 : 0;
  const moveY = mouseY ? (mouseY / height - 0.5) * 10 : 0;

  return {
    x: moveX * (index % 3) * 0.5,
    y: moveY * (index % 2) * 0.5,
    rotateY: moveX * 0.5,
    rotateX: -moveY * 0.5,
    textShadow: `${moveX * 0.5}px ${moveY * 0.5}px 5px rgba(0, 0, 0, 0.3)`,
  };
};

const AnimatedCharacter = ({ character, index, mouseX, mouseY, isClient }) => {
  const movement = calculateMovement(mouseX, mouseY, index, isClient);
  const delay = index * 0.05;

  return (
    <motion.span
      className="relative inline-block text-white"
      initial={{ opacity: 0, y: 50 }}
      animate={{
        opacity: 1,
        y: 0,
        x: movement.x,
        y: movement.y,
        rotateY: movement.rotateY,
        rotateX: movement.rotateX,
      }}
      transition={{
        delay,
        duration: 0.5,
        ease: "easeOut",
        x: { duration: 0.1, ease: "linear" },
        y: { duration: 0.1, ease: "linear" },
      }}
      style={{
        textShadow: movement.textShadow,
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
      }}
    >
      {character}
    </motion.span>
  );
};

const FloatingDots = ({ count = 25, isClient }) => {
  const randomPositions = useRef(
    Array.from({ length: count }, () => ({
      initialX: Math.random(),
      initialY: Math.random(),
      movementX: [Math.random(), Math.random(), Math.random()],
      movementY: [Math.random(), Math.random(), Math.random()],
      duration: 20 + Math.random() * 30,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {randomPositions.map((position, i) => {
        const width = isClient ? window.innerWidth : 1000;
        const height = isClient ? window.innerHeight : 800;

        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            initial={{ x: position.initialX * width, y: position.initialY * height }}
            animate={{
              x: position.movementX.map((m) => m * width),
              y: position.movementY.map((m) => m * height),
            }}
            transition={{
              duration: position.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        );
      })}
    </div>
  );
};

const Hero = () => {
  const [isClient, setIsClient] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  const heroRef = useRef(null);
  const firstName = "Mohammed";
  const lastName = "Sadhef";

  const roles = ["Full Stack Developer", "Cloud Engineer", "Python Developer"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const throttledMouseMove = useCallback(
    throttle((e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }, 50),
    []
  );

  useEffect(() => {
    setIsClient(true);
    setIsVisible(true);

    window.addEventListener("mousemove", throttledMouseMove);

    return () => {
      window.removeEventListener("mousemove", throttledMouseMove);
    };
  }, [throttledMouseMove]);

  useEffect(() => {
    const typingSpeed = 100;
    const deletingSpeed = 50;

    const interval = setInterval(() => {
      const currentRole = roles[roleIndex];

      if (!isDeleting) {
        setDisplayedText(currentRole.substring(0, displayedText.length + 1));

        if (displayedText.length === currentRole.length) {
          clearInterval(interval);
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        setDisplayedText(currentRole.substring(0, displayedText.length - 1));

        if (displayedText.length === 0) {
          setIsDeleting(false);
          setRoleIndex((roleIndex + 1) % roles.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearInterval(interval);
  }, [displayedText, isDeleting, roleIndex]);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative w-full h-screen mx-auto overflow-hidden flex items-center justify-center"
      aria-label="Introduction - Mohammed Sadhef, Full Stack Developer"
    >
      {isClient && <FloatingDots isClient={isClient} count={25} />}

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-16 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4 inline-block"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="h-px w-8 bg-white mr-3 opacity-60" />
            <span className="text-white text-sm tracking-widest uppercase font-light">Welcome to my portfolio</span>
            <div className="h-px w-8 bg-white ml-3 opacity-60" />
          </div>
        </motion.div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-2 tracking-tight leading-none">
          <div className="inline-block">
            {firstName.split("").map((char, index) => (
              <AnimatedCharacter key={`first-${index}`} character={char} index={index} mouseX={mousePosition.x} mouseY={mousePosition.y} isClient={isClient} />
            ))}
          </div>
          <span className="sm:hidden">
            <br />
          </span>
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
              />
            ))}
          </div>
        </h1>

        <motion.div
          className="h-8 my-4 sm:my-6 text-white text-lg sm:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <span className="font-light">I'm a </span>
          <span className="text-white font-bold relative">
            {displayedText}
            {isClient && (
              <span className="absolute -right-1 top-0 h-full w-1 bg-white animate-blink"></span>
            )}
          </span>
        </motion.div>

        <motion.p
          className="max-w-2xl mx-auto text-gray-300 text-base sm:text-lg mb-6 sm:mb-8 px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ delay: 0.8 }}
        >
          Specializing in creating modern web applications with MERN stack, Python, and JavaScript. Integrating AI solutions for innovative digital experiences.
        </motion.p>

        <motion.div
          className="flex flex-wrap justify-center gap-4 mt-4 sm:mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ delay: 1 }}
        >
          <motion.a
            href="#projects"
            className="px-6 sm:px-8 py-2 sm:py-3 bg-white text-black font-medium rounded-full shadow-lg text-sm sm:text-base"
            whileHover={{ scale: 1.05, backgroundColor: "#f0f0f0" }}
            whileTap={{ scale: 0.98 }}
          >
            View Projects
          </motion.a>

          <motion.a
            href="#contact"
            className="px-6 sm:px-8 py-2 sm:py-3 border border-white text-white font-medium rounded-full text-sm sm:text-base"
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            Contact Me
          </motion.a>
        </motion.div>
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
