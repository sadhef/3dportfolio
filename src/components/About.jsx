"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image"; // Assuming this was intended for ServiceCard

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

// Fun facts (can remain as is or be updated)
const PUZZLE_COMPLETION_FACTS = [
  "💖 You guessed it! It is a special name!",
  "💡 Finding the right word is like finding a special connection.",
  "🎯 We're a perfect match, just like the letters in Puzzle!",
  "⚡ This puzzle was a journey, and you navigated it beautifully!",
  "🔥 Thanks for playing! Your guess warmed my heart!",
];

// --- UNCHANGED ServiceCard (Include from previous response) ---
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
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
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
        <h3 className="text-white text-[20px] font-bold text-center">{title}</h3>
      </div>
    </motion.div>
  );
});
ServiceCard.displayName = 'ServiceCard';
// --- END UNCHANGED ServiceCard ---


const TARGET_WORD = "DONE"; 
const WORD_LENGTH = 4;
const MAX_ATTEMPTS = 6;

const getGuessFeedback = (guess, target) => {
  const feedback = new Array(WORD_LENGTH).fill('absent');
  const targetArray = target.split('');
  const guessArray = guess.split('');
  const usedTargetIndices = new Array(WORD_LENGTH).fill(false);

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guessArray[i] === targetArray[i]) {
      feedback[i] = 'correct';
      usedTargetIndices[i] = true;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i++) {
    if (feedback[i] === 'correct') continue;
    const charIndexInTarget = targetArray.findIndex(
      (char, index) => char === guessArray[i] && !usedTargetIndices[index]
    );
    if (charIndexInTarget !== -1) {
      feedback[i] = 'present';
      usedTargetIndices[charIndexInTarget] = true;
    }
  }
  return feedback;
};

// Individual Tile Component - UPDATED
const Tile = ({ char, feedback, isRevealed, isCompleted, delay }) => {
  const feedbackColors = {
    correct: "bg-green-500 border-green-500", // Green for correct
    present: "bg-amber-500 border-amber-500", // Amber/Orange for present
    absent: "bg-gray-700 border-gray-700",
    default: "bg-transparent border-gray-500",
    typing: "border-gray-400"
  };

  const getBgColor = () => {
    if (isRevealed) return feedbackColors[feedback] || feedbackColors.absent;
    if (char) return feedbackColors.typing;
    return feedbackColors.default;
  };
  
  const variants = {
    initial: { rotateX: 0, scale: char ? 1.05 : 1},
    revealed: { rotateX: 180 },
    completed: { scale: [1, 1.1, 1, 1.1, 1], transition: {delay: delay + 0.5, duration: 0.5}}
  };

  return (
    // The parent div that performs the flip animation
    <motion.div
      className="relative w-14 h-14 md:w-16 md:h-16"
      // CRITICAL FIX: Added transformStyle: "preserve-3d"
      style={{ perspective: "1000px", transformStyle: "preserve-3d" }} 
      initial="initial"
      animate={isCompleted && feedback === 'correct' ? "completed" : (isRevealed ? "revealed" : "initial")}
      variants={variants}
      transition={{ duration: 0.5, delay: isRevealed ? delay : 0 }}
    >
      {/* Front of the tile (visible before flip) */}
      <motion.div
        className={`absolute w-full h-full flex items-center justify-center text-2xl md:text-3xl font-bold uppercase text-white border-2 ${char && !isRevealed ? feedbackColors.typing : feedbackColors.default} rounded`}
        style={{ backfaceVisibility: "hidden" }} // Hides this face when it's turned away
      >
        {char}
      </motion.div>
      {/* Back of the tile (visible after flip) */}
      <motion.div
        className={`absolute w-full h-full flex items-center justify-center text-2xl md:text-3xl font-bold uppercase text-white border-2 ${getBgColor()} rounded`}
        // This face is initially rotated 180deg; when parent flips 180deg, this face becomes visible and correctly oriented
        style={{ backfaceVisibility: "hidden", transform: "rotateX(180deg)" }} 
      >
        {char} 
      </motion.div>
    </motion.div>
  );
};


// Keyboard Key Component - UPDATED
const Key = ({ value, status, onClick }) => {
  const statusColors = {
    correct: "bg-green-600 hover:bg-green-700",
    present: "bg-amber-600 hover:bg-amber-700", // Amber/Orange for present
    absent: "bg-gray-700 hover:bg-gray-800",
    default: "bg-gray-500 hover:bg-gray-600",
  };
  return (
    <button
      onClick={() => onClick(value)}
      className={`h-12 md:h-14 rounded font-bold uppercase text-white text-sm md:text-base transition-colors duration-150
                  ${statusColors[status] || statusColors.default}
                  ${value === 'ENTER' || value === 'DEL' ? 'px-2 md:px-3 flex-grow-[1.5]' : 'px-2 md:px-3 flex-grow'}`}
    >
      {value === 'DEL' ? '⌫' : value}
    </button>
  );
};

// --- WordlyPuzzle Component (Main logic - largely same as before, ensure it uses updated Tile and Key) ---
// Include the full WordlyPuzzle component from the previous response.
// The critical changes are within Tile and Key components above.
const WordlyPuzzle = ({ onComplete }) => {
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  const [guesses, setGuesses] = useState(Array(MAX_ATTEMPTS).fill("").map(() => Array(WORD_LENGTH).fill("")));
  const [feedbackGrid, setFeedbackGrid] = useState(Array(MAX_ATTEMPTS).fill("").map(() => Array(WORD_LENGTH).fill("default")));
  const [revealedState, setRevealedState] = useState(Array(MAX_ATTEMPTS).fill(false));
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [currentGuessChars, setCurrentGuessChars] = useState([]);
  const [letterStatuses, setLetterStatuses] = useState({}); // For keyboard
  const [toast, setToast] = useState({ show: false, message: "" });
  const [shakeRow, setShakeRow] = useState(false);
  const [showLoveCelebration, setShowLoveCelebration] = useState(false);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 2000);
  };
  
  const handleKeyPress = useCallback((key) => {
    if (gameState !== 'playing') return;

    if (key === 'ENTER') {
      if (currentGuessChars.length !== WORD_LENGTH) {
        showToast("Not enough letters");
        setShakeRow(true);
        setTimeout(() => setShakeRow(false), 600);
        return;
      }
      processGuess();
    } else if (key === 'DEL' || key === 'BACKSPACE') {
      setCurrentGuessChars(prev => prev.slice(0, -1));
    } else if (currentGuessChars.length < WORD_LENGTH && /^[A-Z]$/i.test(key)) {
      setCurrentGuessChars(prev => [...prev, key.toUpperCase()]);
    }
  }, [currentGuessChars, currentAttempt, gameState, guesses]); // Added guesses to dependencies

  useEffect(() => {
    const physicalKeyboardListener = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Enter') handleKeyPress('ENTER');
      else if (e.key === 'Backspace') handleKeyPress('DEL');
      else if (e.key.length === 1 && e.key.match(/^[a-zA-Z]$/)) handleKeyPress(e.key.toUpperCase());
    };
    window.addEventListener('keydown', physicalKeyboardListener);
    return () => window.removeEventListener('keydown', physicalKeyboardListener);
  }, [handleKeyPress]);


  const processGuess = () => {
    const guessStr = currentGuessChars.join('');
    const currentFeedback = getGuessFeedback(guessStr, TARGET_WORD);

    const newGuesses = guesses.map((row, rIdx) => 
      rIdx === currentAttempt ? [...currentGuessChars, ...Array(WORD_LENGTH - currentGuessChars.length).fill('')] : row
    );
    setGuesses(newGuesses);

    const newFeedbackGrid = feedbackGrid.map((row, rIdx) =>
      rIdx === currentAttempt ? currentFeedback : row
    );
    setFeedbackGrid(newFeedbackGrid);
    
    const newRevealedState = [...revealedState];
    newRevealedState[currentAttempt] = true;
    setRevealedState(newRevealedState);

    const newLetterStatuses = { ...letterStatuses };
    guessStr.split('').forEach((char, index) => {
      const status = currentFeedback[index];
      if (newLetterStatuses[char] === 'correct') return;
      if (newLetterStatuses[char] === 'present' && status !== 'correct') return;
      newLetterStatuses[char] = status;
    });
    setLetterStatuses(newLetterStatuses);

    setTimeout(() => {
      if (guessStr === TARGET_WORD) {
        setGameState('won');
        setShowLoveCelebration(true);
        showToast("You found the Word ! ❤️");
        // Ensure onComplete is called after a delay to show celebration
        setTimeout(() => { // Added extra delay for onComplete
            onComplete?.();
        }, 2000); // Delay for celebration visibility before potential puzzle closure
      } else if (currentAttempt + 1 >= MAX_ATTEMPTS) {
        setGameState('lost');
        showToast(`Game Over! The word was ${TARGET_WORD}.`);
      } else {
        setCurrentAttempt(prev => prev + 1);
        setCurrentGuessChars([]);
      }
    }, WORD_LENGTH * 300); 
  };
  
  const resetPuzzle = useCallback(() => {
    setGameState('playing');
    setGuesses(Array(MAX_ATTEMPTS).fill("").map(() => Array(WORD_LENGTH).fill("")));
    setFeedbackGrid(Array(MAX_ATTEMPTS).fill("").map(() => Array(WORD_LENGTH).fill("default")));
    setRevealedState(Array(MAX_ATTEMPTS).fill(false));
    setCurrentAttempt(0);
    setCurrentGuessChars([]);
    setLetterStatuses({});
    setToast({ show: false, message: "" });
    setShowLoveCelebration(false);
    // onComplete should not be called here, it's for successful completion signaling.
  }, []); // Removed onComplete from resetPuzzle dependencies as it's not directly used for resetting


  const grid = [];
  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    const rowChars = (i === currentAttempt) ? currentGuessChars : guesses[i];
    const rowFeedback = feedbackGrid[i];
    const isRowRevealed = revealedState[i];
    
    grid.push(
      <motion.div 
        key={i} 
        className="grid grid-cols-4 gap-1.5 md:gap-2"
        animate={shakeRow && i === currentAttempt ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        {Array.from({ length: WORD_LENGTH }).map((_, j) => (
          <Tile
            key={j}
            char={rowChars[j] || ""}
            feedback={rowFeedback[j]}
            isRevealed={isRowRevealed}
            isCompleted={gameState === 'won' && i === currentAttempt}
            delay={j * 0.2} 
          />
        ))}
      </motion.div>
    );
  }

  const keyboardLayout = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
  ];

  if (gameState === 'won' && showLoveCelebration) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-tertiary rounded-lg p-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ delay: 0.2, type: "spring", duration: 1, repeat: Infinity, repeatType: "loop", repeatDelay: 1 }}
          className="text-6xl mb-4"
        >
          💖✨❤️
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-4">
          You found it ! It's a match! 🎉
        </h3>
        <div className="space-y-3">
          {PUZZLE_COMPLETION_FACTS.map((fact, index) => (
            <motion.p key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.3 }}
                      className="text-sm text-white bg-black-200 rounded p-3">
              {fact}
            </motion.p>
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={resetPuzzle}
                       className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold">
          🔄 Play Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="bg-tertiary rounded-lg p-4 md:p-6 flex flex-col items-center">
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 inset-x-0 mx-auto w-max bg-black-200 text-white px-4 py-2 rounded shadow-lg z-50" // Made toast fixed and centered
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="flex justify-between items-center w-full mb-2 md:mb-4 max-w-sm">
         <h3 className="text-white text-lg font-semibold">
          Puzzle Challenge
        </h3>
        {(gameState === 'lost' || (gameState === 'won' && !showLoveCelebration)) && ( // Show play again if won but celebration isn't up (e.g. if auto-closed)
            <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={resetPuzzle}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm"
            >
                🔄 Play Again
            </motion.button>
        )}
         {gameState === 'playing' && (
             <div className="text-secondary text-sm">Attempt: {currentAttempt + 1}/{MAX_ATTEMPTS}</div>
         )}
      </div>

      <div className="grid grid-rows-6 gap-1.5 md:gap-2 mb-4 md:mb-6">
        {grid}
      </div>

      <div className="w-full max-w-md md:max-w-lg space-y-1.5 md:space-y-2">
        {keyboardLayout.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 md:gap-1.5">
            {row.map(keyVal => (
              <Key
                key={keyVal}
                value={keyVal}
                status={letterStatuses[keyVal]}
                onClick={handleKeyPress}
              />
            ))}
          </div>
        ))}
      </div>
       {gameState === 'lost' && !showLoveCelebration && (
         <p className="text-red-400 text-center mt-4">The word was: {TARGET_WORD}</p>
       )}
    </div>
  );
};


// --- About Component (Largely same as before, ensure it uses WordlyPuzzle) ---
// Include the full About component from the previous response.
const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPuzzle, setShowPuzzle] = useState(false);
  const [puzzleCompleted, setPuzzleCompleted] = useState(false);
  const sectionRef = useRef(null);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      }, { threshold: 0.1, rootMargin: '50px' }
    );
    const currentRef = sectionRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);

  const handlePuzzleComplete = useCallback(() => {
    setPuzzleCompleted(true);
     // Optional: If you want the puzzle to auto-close after the celebration is shown by WordlyPuzzle.
    // setTimeout(() => {
    //    setShowPuzzle(false);
    // }, 4000); // Adjust delay as needed, must be longer than WordlyPuzzle's own celebration timeout + onComplete delay
  }, []);

  const togglePuzzle = useCallback(() => {
    setShowPuzzle(prev => {
      // If we are opening the puzzle AND it was previously completed, reset puzzleCompleted for a fresh game.
      if (!prev && puzzleCompleted) { 
        setPuzzleCompleted(false); 
      }
      return !prev;
    });
  }, [puzzleCompleted]);

  return (
    <div ref={sectionRef}>
      <motion.div variants={textVariant()} initial="hidden" animate={isVisible ? "show" : "hidden"}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p variants={fadeIn("", "", 0.1, 1)} initial="hidden" animate={isVisible ? "show" : "hidden"}
                  className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]">
        I am a highly motivated Full Stack Developer with experience in dynamic 
        and fast-paced environments. My expertise spans the MERN stack (MongoDB, Express.js, 
        React.js, and Node.js) with proficiency in PostgreSQL for relational database management.
        I've integrated Python-based data science, AI, and machine learning capabilities
        and have experience with Docker for containerization and deployment.
        Additionally, I've developed cross-platform mobile applications using React Native, 
        leveraging RESTful APIs and managing state with Redux/Context API.
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ delay: 0.3, duration: 0.6 }} className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-xl font-semibold">
             Interactive Word Challenge!
          </h3>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={togglePuzzle}
                         className={`px-6 py-3 rounded-lg font-medium transition-all ${
                           showPuzzle 
                             ? 'bg-red-500 hover:bg-red-600 text-white' 
                             : puzzleCompleted 
                             ? 'bg-pink-500 hover:bg-pink-600 text-white' // Style for "Solved!"
                             : 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white'
                         }`}>
            {showPuzzle ? '✕ Close Challenge' : puzzleCompleted ? ' Solved! Play Again?' : ' Try the Word Puzzle!'}
          </motion.button>
        </div>
        
        <AnimatePresence mode="wait">
          {showPuzzle && (
            <motion.div key={puzzleCompleted ? 'wordly-reset' : 'wordly-active'} // Change key to force re-render if puzzleCompleted was true
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}>
              <WordlyPuzzle onComplete={handlePuzzleComplete} />
            </motion.div>
          )}
        </AnimatePresence>

        {!showPuzzle && !puzzleCompleted && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-secondary text-sm mt-2">
            Can you guess the secret 4-letter word? Give it a try! ✨
          </motion.p>
        )}
         {!showPuzzle && puzzleCompleted && ( // This message shows after puzzle is solved and closed
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-pink-400 text-sm mt-2">
            You solved the puzzle! Thanks for playing!  Click above to try again.
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default SectionWrapper(About, "about");