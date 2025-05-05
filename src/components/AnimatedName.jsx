import React, { useState, useEffect, useRef } from "react";
import "../styles/nameAnimation.css";

// Enhanced animated name component with scroll direction effects
const AnimatedName = ({ firstName = "Mohammed", lastName = "Sadhef", className = "" }) => {
  const nameRef = useRef(null);
  const [scrollDirection, setScrollDirection] = useState('none');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  
  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  
  // Monitor scroll position and determine direction
  useEffect(() => {
    if (prefersReducedMotion) return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      
      // Only update direction if we've scrolled enough to matter
      if (Math.abs(currentScrollY - lastScrollY) > 10) {
        setScrollDirection(direction);
        
        // Hide name during animation
        if (isVisible && currentScrollY > 50) {
          setIsVisible(false);
        }
        
        // Show name again when scrolling back to top
        if (!isVisible && currentScrollY < 50) {
          setIsVisible(true);
        }
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isVisible, prefersReducedMotion]);
  
  // Split name into characters for staggered animation
  const renderStaggeredText = (text) => {
    return text.split('').map((char, index) => (
      <span 
        key={`${text}-${index}`} 
        className="name-char"
        style={{ '--char-index': index }}
      >
        {char}
      </span>
    ));
  };
  
  // Combine classes based on animation state
  const getWrapperClass = () => {
    let classes = 'name-animation-wrapper';
    
    if (scrollDirection === 'down' && !isVisible) {
      classes += ' scroll-down';
    } else if (scrollDirection === 'up' && !isVisible) {
      classes += ' scroll-up';
    }
    
    return classes;
  };

  return (
    <div className={getWrapperClass()}>
      <h1 
        ref={nameRef}
        className={`animated-name ${className}`}
        style={{ '--original-font-size': '5rem' }}
      >
        {renderStaggeredText(firstName)}{' '}
        <span className="last-name">
          {renderStaggeredText(lastName)}
        </span>
        
        {/* Add subtle shadow for depth */}
        <span className="name-shadow" aria-hidden="true">
          {firstName} {lastName}
        </span>
      </h1>
    </div>
  );
};

export default AnimatedName;