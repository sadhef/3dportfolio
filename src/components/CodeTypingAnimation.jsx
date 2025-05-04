import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import '../styles/CodeAnimationStyles.css';

const CodeTypingAnimation = ({ onComplete }) => {
  const [displayText, setDisplayText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [lineComplete, setLineComplete] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Code snippets to type out
  const codeLines = [
    'const portfolio = {',
    '  name: "Mohammed Sadhef",',
    '  role: "Full Stack Developer",',
    '  greeting: () => {',
    '    return "Hello World!";',
    '  }',
    '};',
    ''
  ];

  // Typing effect
  useEffect(() => {
    if (currentLineIndex >= codeLines.length) {
      // All lines have been typed
      setTimeout(() => {
        setShowResult(true);
        // Wait for result display before fading out
        setTimeout(() => {
          setFadeOut(true);
          // Notify parent component that animation is complete
          setTimeout(() => onComplete(), 1000);
        }, 1500);
      }, 500);
      return;
    }

    const currentLine = codeLines[currentLineIndex];
    
    if (!lineComplete) {
      if (displayText.length < currentLine.length) {
        // Continue typing current line
        const timer = setTimeout(() => {
          setDisplayText(currentLine.substring(0, displayText.length + 1));
        }, Math.random() * 50 + 30); // Random typing speed for realistic effect
        return () => clearTimeout(timer);
      } else {
        // Current line completed
        setLineComplete(true);
        return;
      }
    } else {
      // Move to next line after a pause
      const timer = setTimeout(() => {
        setDisplayText('');
        setCurrentLineIndex(currentLineIndex + 1);
        setLineComplete(false);
      }, 200); // Pause before starting next line
      return () => clearTimeout(timer);
    }
  }, [displayText, currentLineIndex, lineComplete, codeLines, onComplete]);

  // Blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Syntax highlighting function
  const highlightSyntax = (text) => {
    // For incomplete lines, show only what's been typed
    const displayLine = text || '';
    
    // More advanced syntax highlighting
    return displayLine
      .replace(/(".*?")/g, '<span class="string">$1</span>') // Strings
      .replace(/\b(const|return)\b/g, '<span class="keyword">$1</span>') // Keywords
      .replace(/\b(portfolio)\b(?!\s*\()/g, '<span class="variable">$1</span>') // Variables
      .replace(/\b(name|role|skills|greeting)\b(?=:)/g, '<span class="property">$1</span>') // Properties
      .replace(/\b(\d+)\b/g, '<span class="number">$1</span>') // Numbers
      .replace(/\b(=>)\b/g, '<span class="operator">$1</span>') // Arrow function
      .replace(/(\(|\)|\{|\}|\[|\]|;|,|\.)/g, '<span class="punctuation">$1</span>') // Punctuation
      .replace(/\/\/(.*)/g, '<span class="comment">\/\/$1</span>'); // Comments
  };

  // Add line numbers
  const renderCodeWithLineNumbers = () => {
    const completedLines = codeLines.slice(0, currentLineIndex).map((line, index) => (
      <div key={`completed-${index}`} className="flex">
        <span className="line-number">{index + 1}</span>
        <div 
          className="font-mono text-sm sm:text-base flex-1"
          dangerouslySetInnerHTML={{ 
            __html: highlightSyntax(line) 
          }}
        />
      </div>
    ));

    // Current line being typed
    const currentLine = currentLineIndex < codeLines.length ? (
      <div key="current-line" className="flex">
        <span className="line-number">{currentLineIndex + 1}</span>
        <div className="font-mono text-sm sm:text-base flex-1 flex">
          <span 
            dangerouslySetInnerHTML={{ 
              __html: highlightSyntax(displayText) 
            }}
          />
          {cursorVisible && <span className="typing-cursor"></span>}
        </div>
      </div>
    ) : null;

    return [...completedLines, currentLine];
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 code-animation-container"
      initial={{ opacity: 1 }}
      animate={{ opacity: fadeOut ? 0 : 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-full max-w-lg mx-auto terminal-container">
        <div className="terminal-header">
          <div className="terminal-dots">
            <div className="terminal-dot red"></div>
            <div className="terminal-dot yellow"></div>
            <div className="terminal-dot green"></div>
          </div>
          <div className="flex-grow text-center">
            <span className="text-xs text-gray-400">portfolio.js</span>
          </div>
        </div>
        <div className="terminal-body code-editor">
          {renderCodeWithLineNumbers()}
        </div>
      </div>
    </motion.div>
  );
};

export default CodeTypingAnimation;