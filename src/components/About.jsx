"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

// Quiz data - personalize this according to your preferences
const QUIZ_DATA = [
  {
    id: 1,
    type: 'multiple-choice',
    question: "What's my favorite programming paradigm?",
    options: ["Object-Oriented", "Functional", "Reactive", "Event-Driven"],
    correct: 1,
    funFact: "I love functional programming because it makes code more predictable and easier to test!"
  },
  {
    id: 2,
    type: 'puzzle',
    question: "Decode this: 01001000 01100101 01101100 01101100 01101111",
    hint: "It's binary! Each 8-bit sequence represents an ASCII character.",
    answer: "hello",
    funFact: "I started coding when I was curious about how computers understand instructions!"
  },
  {
    id: 3,
    type: 'multiple-choice',
    question: "What's my go-to tech stack for rapid prototyping?",
    options: ["LAMP", "MEAN", "MERN", "Django + React"],
    correct: 2,
    funFact: "MERN stack allows me to use JavaScript everywhere - frontend, backend, and database queries!"
  },
  {
    id: 4,
    type: 'riddle',
    question: "I'm not a snake, but I'm great for data. I'm not Java, but I'm object-oriented. What am I?",
    answer: "python",
    funFact: "Python is my secret weapon for AI/ML projects and data analysis!"
  },
  {
    id: 5,
    type: 'multiple-choice',
    question: "What motivates me most in development?",
    options: ["Solving complex problems", "Learning new technologies", "Building user-friendly interfaces", "All of the above"],
    correct: 3,
    funFact: "I believe great software combines technical excellence with amazing user experience!"
  }
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

// Quiz Component
const AboutMeQuiz = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [revealedFacts, setRevealedFacts] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showHint, setShowHint] = useState(false);

  const currentQ = useMemo(() => QUIZ_DATA[currentQuestion], [currentQuestion]);
  const isLastQuestion = useMemo(() => currentQuestion === QUIZ_DATA.length - 1, [currentQuestion]);

  const handleAnswer = useCallback((answer) => {
    const newAnswers = { ...userAnswers, [currentQ.id]: answer };
    setUserAnswers(newAnswers);

    let isCorrect = false;
    if (currentQ.type === 'multiple-choice') {
      isCorrect = answer === currentQ.correct;
    } else {
      isCorrect = answer.toLowerCase().trim() === currentQ.answer.toLowerCase();
    }

    if (isCorrect) {
      setScore(prev => prev + 1);
      setRevealedFacts(prev => [...prev, currentQ.funFact]);
    }

    setTimeout(() => {
      if (isLastQuestion) {
        setShowResult(true);
        setTimeout(() => onComplete && onComplete(), 2000);
      } else {
        setCurrentQuestion(prev => prev + 1);
        setInputValue('');
        setShowHint(false);
      }
    }, 1500);
  }, [currentQ, userAnswers, isLastQuestion, onComplete]);

  const handleInputSubmit = useCallback((e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleAnswer(inputValue.trim());
    }
  }, [inputValue, handleAnswer]);

  if (showResult) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-tertiary rounded-lg p-6 text-center"
      >
        <h3 className="text-2xl font-bold text-white mb-4">
          Quiz Complete! 🎉
        </h3>
        <p className="text-secondary mb-4">
          You scored {score} out of {QUIZ_DATA.length}
        </p>
        <div className="space-y-3">
          {revealedFacts.map((fact, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.3 }}
              className="text-sm text-white bg-black-200 rounded p-3"
            >
              💡 {fact}
            </motion.p>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-tertiary rounded-lg p-6"
    >
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-secondary text-sm">
            Question {currentQuestion + 1} of {QUIZ_DATA.length}
          </span>
          <div className="w-32 bg-black-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / QUIZ_DATA.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <h3 className="text-white text-lg font-semibold mb-4">
          {currentQ.question}
        </h3>
      </div>

      {currentQ.type === 'multiple-choice' ? (
        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(index)}
              className="w-full text-left p-3 rounded-lg bg-black-200 text-white hover:bg-black-100 transition-colors border border-transparent hover:border-purple-500"
            >
              {option}
            </motion.button>
          ))}
        </div>
      ) : (
        <div>
          <form onSubmit={handleInputSubmit} className="space-y-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your answer..."
              className="w-full p-3 rounded-lg bg-black-200 text-white border border-gray-600 focus:border-purple-500 focus:outline-none"
            />
            <div className="flex gap-3">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!inputValue.trim()}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </motion.button>
              {currentQ.hint && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowHint(!showHint)}
                  className="px-4 py-2 bg-black-200 text-secondary rounded-lg border border-gray-600"
                >
                  💡 Hint
                </motion.button>
              )}
            </div>
          </form>
          
          <AnimatePresence>
            {showHint && currentQ.hint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 bg-black-100 rounded-lg border-l-4 border-yellow-500"
              >
                <p className="text-yellow-300 text-sm">{currentQ.hint}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
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

  const handleQuizComplete = useCallback(() => {
    setQuizCompleted(true);
    setTimeout(() => setShowQuiz(false), 3000);
  }, []);

  const toggleQuiz = useCallback(() => {
    setShowQuiz(prev => !prev);
    if (quizCompleted) {
      setQuizCompleted(false);
    }
  }, [quizCompleted]);

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

      {/* Interactive Quiz Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mt-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white text-xl font-semibold">
            🎯 Want to know more about me?
          </h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleQuiz}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              showQuiz 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : quizCompleted
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white'
            }`}
          >
            {showQuiz ? '✕ Close Quiz' : quizCompleted ? '✓ Quiz Completed!' : '🎮 Take the Fun Quiz!'}
          </motion.button>
        </div>
        
        <AnimatePresence mode="wait">
          {showQuiz && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AboutMeQuiz onComplete={handleQuizComplete} />
            </motion.div>
          )}
        </AnimatePresence>

        {!showQuiz && !quizCompleted && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-secondary text-sm mt-2"
          >
            Take a quick interactive quiz to discover fun facts about my coding journey! 🚀
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default SectionWrapper(About, "about");