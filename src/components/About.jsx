"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

// Letter R puzzle pieces data
const R_PUZZLE_PIECES = [
  {
    id: 1,
    path: "M 0,0 L 0,80 L 8,80 L 8,45 L 35,45 L 35,37 L 8,37 L 8,8 L 40,8 L 40,0 Z", // Left vertical line + top horizontal
    correctPosition: { x: 0, y: 0 },
    color: "#8B5CF6"
  },
  {
    id: 2,
    path: "M 40,0 L 40,20 L 48,20 L 48,8 L 65,8 L 65,0 Z", // Top right horizontal
    correctPosition: { x: 40, y: 0 },
    color: "#06B6D4"
  },
  {
    id: 3,
    path: "M 48,8 L 48,37 L 65,37 L 65,29 L 56,29 L 56,8 Z", // Right side upper part
    correctPosition: { x: 48, y: 8 },
    color: "#10B981"
  },
  {
    id: 4,
    path: "M 35,37 L 65,37 L 65,45 L 35,45 Z", // Middle horizontal line
    correctPosition: { x: 35, y: 37 },
    color: "#F59E0B"
  },
  {
    id: 5,
    path: "M 8,45 L 30,80 L 40,80 L 18,45 Z", // Diagonal line
    correctPosition: { x: 8, y: 45 },
    color: "#EF4444"
  },
  {
    id: 6,
    path: "M 40,45 L 62,80 L 72,80 L 50,45 Z", // Right diagonal line
    correctPosition: { x: 40, y: 45 },
    color: "#EC4899"
  }
];

// Fun facts to reveal when puzzle is completed
const PUZZLE_COMPLETION_FACTS = [
  "🚀 I chose 'R' because it represents my passion for React development!",
  "💡 Problem-solving puzzles like this mirror my approach to debugging complex code.",
  "🎯 I believe in making technology interactive and engaging, just like this puzzle!",
  "⚡ My development philosophy: Build experiences that surprise and delight users.",
  "🔥 When I'm not coding, I love solving puzzles and brain teasers!"
];

// Optimized Service Card with memoization
const ServiceCard = React.memo(({ index, title, icon }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    const currentRef = cardRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="xs:w-[250px] w-full p-[1px] rounded-[20px] shadow-card border border-gray-700"
      whileHover={{ translateY: -10, transition: { duration: 0.3 } }}
    >
      <div className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
        <div className="relative w-16 h-16"> 
          <Image
            src={icon}
            alt={`${title} icon`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain filter grayscale"
            priority={index < 3}
            loading={index < 3 ? "eager" : "lazy"}
          />
        </div>
        <h3 className="text-white text-[20px] font-bold text-center">
          {title}
        </h3>
      </div>
    </motion.div>
  );
});

ServiceCard.displayName = 'ServiceCard';

// Letter R Puzzle Component
const LetterRPuzzle = ({ onComplete }) => {
  const [pieces, setPieces] = useState(() => 
    R_PUZZLE_PIECES.map(piece => ({
      ...piece,
      currentPosition: {
        x: Math.random() * 200 + 100,
        y: Math.random() * 150 + 100
      },
      isPlaced: false,
      isDragging: false
    }))
  );
  
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [completedPieces, setCompletedPieces] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const svgRef = useRef(null);

  // Check if piece is in correct position
  const isInCorrectPosition = useCallback((piece, position) => {
    const tolerance = 15;
    return Math.abs(position.x - piece.correctPosition.x) < tolerance &&
           Math.abs(position.y - piece.correctPosition.y) < tolerance;
  }, []);

  // Handle mouse/touch start
  const handlePointerDown = useCallback((e, pieceId) => {
    e.preventDefault();
    const piece = pieces.find(p => p.id === pieceId);
    if (piece.isPlaced) return;

    setDraggedPiece(pieceId);
    setPieces(prev => prev.map(p => 
      p.id === pieceId ? { ...p, isDragging: true } : p
    ));
  }, [pieces]);

  // Handle mouse/touch move
  const handlePointerMove = useCallback((e) => {
    if (!draggedPiece || !svgRef.current) return;

    const svgRect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    const clientY = e.clientY || (e.touches && e.touches[0]?.clientY);
    
    if (!clientX || !clientY) return;

    const newPosition = {
      x: clientX - svgRect.left - 20,
      y: clientY - svgRect.top - 20
    };

    setPieces(prev => prev.map(p => 
      p.id === draggedPiece 
        ? { ...p, currentPosition: newPosition }
        : p
    ));
  }, [draggedPiece]);

  // Handle mouse/touch end
  const handlePointerUp = useCallback(() => {
    if (!draggedPiece) return;

    const piece = pieces.find(p => p.id === draggedPiece);
    const isCorrect = isInCorrectPosition(piece, piece.currentPosition);

    setPieces(prev => prev.map(p => {
      if (p.id === draggedPiece) {
        if (isCorrect && !p.isPlaced) {
          return {
            ...p,
            currentPosition: p.correctPosition,
            isPlaced: true,
            isDragging: false
          };
        }
        return { ...p, isDragging: false };
      }
      return p;
    }));

    if (isCorrect && !piece.isPlaced) {
      setCompletedPieces(prev => prev + 1);
    }

    setDraggedPiece(null);
  }, [draggedPiece, pieces, isInCorrectPosition]);

  // Check for puzzle completion
  useEffect(() => {
    if (completedPieces === R_PUZZLE_PIECES.length && !isCompleted) {
      setIsCompleted(true);
      setShowCelebration(true);
      setTimeout(() => {
        onComplete?.();
      }, 3000);
    }
  }, [completedPieces, isCompleted, onComplete]);

  // Event listeners
  useEffect(() => {
    const handleMouseMove = (e) => handlePointerMove(e);
    const handleMouseUp = () => handlePointerUp();
    const handleTouchMove = (e) => handlePointerMove(e);
    const handleTouchEnd = () => handlePointerUp();

    if (draggedPiece) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [draggedPiece, handlePointerMove, handlePointerUp]);

  // Reset puzzle
  const resetPuzzle = useCallback(() => {
    setPieces(R_PUZZLE_PIECES.map(piece => ({
      ...piece,
      currentPosition: {
        x: Math.random() * 200 + 100,
        y: Math.random() * 150 + 100
      },
      isPlaced: false,
      isDragging: false
    })));
    setCompletedPieces(0);
    setIsCompleted(false);
    setShowCelebration(false);
    setDraggedPiece(null);
  }, []);

  if (isCompleted && showCelebration) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-tertiary rounded-lg p-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-4">
          Puzzle Completed! Amazing! 🚀
        </h3>
        <div className="space-y-3">
          {PUZZLE_COMPLETION_FACTS.map((fact, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.3 }}
              className="text-sm text-white bg-black-200 rounded p-3"
            >
              {fact}
            </motion.p>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetPuzzle}
          className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg"
        >
          🔄 Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="bg-tertiary rounded-lg p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-white text-lg font-semibold">
            🧩 Arrange the pieces to form the letter "R"
          </span>
          <div className="flex items-center gap-4">
            <span className="text-secondary text-sm">
              {completedPieces}/{R_PUZZLE_PIECES.length} pieces
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetPuzzle}
              className="px-4 py-2 bg-black-200 text-secondary rounded-lg border border-gray-600 text-sm"
            >
              🔄 Reset
            </motion.button>
          </div>
        </div>
        <div className="w-full bg-black-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedPieces / R_PUZZLE_PIECES.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          width="400"
          height="300"
          viewBox="0 0 400 300"
          className="border border-gray-600 rounded-lg bg-black-100 touch-none select-none"
          style={{ touchAction: 'none' }}
        >
          {/* Target outline (faded) */}
          <g opacity="0.2" stroke="#666" strokeWidth="1" fill="none" strokeDasharray="3,3">
            {R_PUZZLE_PIECES.map(piece => (
              <path
                key={`outline-${piece.id}`}
                d={piece.path}
                transform={`translate(${piece.correctPosition.x + 100}, ${piece.correctPosition.y + 50})`}
              />
            ))}
          </g>

          {/* Puzzle pieces */}
          {pieces.map(piece => (
            <motion.g
              key={piece.id}
              animate={{
                x: piece.currentPosition.x + 100,
                y: piece.currentPosition.y + 50,
                scale: piece.isDragging ? 1.1 : 1
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              style={{ cursor: piece.isPlaced ? 'default' : 'grab' }}
              onMouseDown={(e) => handlePointerDown(e, piece.id)}
              onTouchStart={(e) => handlePointerDown(e, piece.id)}
            >
              <path
                d={piece.path}
                fill={piece.isPlaced ? piece.color : `${piece.color}CC`}
                stroke={piece.isDragging ? "#fff" : piece.color}
                strokeWidth={piece.isDragging ? "2" : "1"}
                filter={piece.isDragging ? "drop-shadow(0 0 10px rgba(255,255,255,0.5))" : "none"}
              />
            </motion.g>
          ))}
        </svg>

        <p className="text-secondary text-sm mt-3 text-center">
          💡 Drag and drop the colorful pieces to form the letter "R". Pieces will snap into place when positioned correctly!
        </p>
      </div>
    </div>
  );
};

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const sectionRef = useRef(null);
  
  // Optimized intersection observer with cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    
    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const handlePuzzleComplete = useCallback(() => {
    setPuzzleCompleted(true);
    setTimeout(() => setShowPuzzle(false), 3000);
  }, []);

  const togglePuzzle = useCallback(() => {
    setShowPuzzle(prev => !prev);
    if (puzzleCompleted) {
      setPuzzleCompleted(false);
    }
  }, [puzzleCompleted]);

  return (
    <div ref={sectionRef}>
      <motion.div
        variants={textVariant()}
        initial="hidden"
        animate={isVisible ? "show" : "hidden"}
      >
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        initial="hidden"
        animate={isVisible ? "show" : "hidden"}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        I am a highly motivated Full Stack Developer with experience in dynamic 
        and fast-paced environments. My expertise spans the MERN stack (MongoDB, Express.js, 
        React.js, and Node.js) with proficiency in PostgreSQL for relational database management.
        I've integrated Python-based data science, AI, and machine learning capabilities
        and have experience with Docker for containerization and deployment.
        Additionally, I've developed cross-platform mobile applications using React Native, 
        leveraging RESTful APIs and managing state with Redux/Context API.
      </motion.p>

      {/* Interactive Puzzle Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-xl font-semibold">
            🧩 Interactive Challenge
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePuzzle}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              showPuzzle 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : puzzleCompleted
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white'
            }`}
          >
            {showPuzzle ? '✕ Close Puzzle' : puzzleCompleted ? '✓ Puzzle Completed!' : '🎮 Try the Letter R Puzzle!'}
          </motion.button>
        </div>
        
        <AnimatePresence mode="wait">
          {showPuzzle && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LetterRPuzzle onComplete={handlePuzzleComplete} />
            </motion.div>
          )}
        </AnimatePresence>

        {!showPuzzle && !puzzleCompleted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-secondary text-sm mt-2"
          >
            Challenge yourself with an interactive puzzle - drag and arrange pieces to form the letter "R"! 🧩✨
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default SectionWrapper(About, "about");