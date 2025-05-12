import React, { useEffect } from 'react';

/**
 * SmoothScroll - A component that enables smooth scrolling behavior
 * throughout the website, with enhanced mobile support and performance optimization.
 */
const SmoothScroll = ({ children }) => {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Don't apply smooth scrolling for users who prefer reduced motion
    if (prefersReducedMotion) return;
    
    // Check if device is mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Get all anchor links on the page
    const handleSmoothScroll = () => {
      const anchors = document.querySelectorAll('a[href^="#"]');
      
      // Add click handler to each anchor for smooth scrolling
      const handleAnchorClick = (e) => {
        const href = e.currentTarget.getAttribute('href');
        
        // Skip non-anchor links or empty links
        if (!href || href === '#') return;
        
        const targetEl = document.querySelector(href);
        if (!targetEl) return;
        
        e.preventDefault();
        
        // Get header height for offset (if a header exists)
        const header = document.querySelector('header, nav') || { offsetHeight: 0 };
        const headerOffset = header.offsetHeight;
        
        // Calculate the position to scroll to
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // Extra 20px buffer
        
        // Use native smooth scrolling when supported, with fallback
        if ('scrollBehavior' in document.documentElement.style) {
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        } else {
          // Fallback for browsers that don't support scrollBehavior
          window.scrollTo(0, offsetPosition);
        }
      };
      
      // Add event listeners
      anchors.forEach(anchor => {
        anchor.addEventListener('click', handleAnchorClick);
      });
      
      // Return cleanup function
      return () => {
        anchors.forEach(anchor => {
          anchor.removeEventListener('click', handleAnchorClick);
        });
      };
    };
    
    // Set up event handlers
    const cleanup = handleSmoothScroll();
    
    // Apply smooth scrolling globally for supported browsers
    // Skip on mobile for better performance
    if (!isMobile && 'scrollBehavior' in document.documentElement.style) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    // Hash link handling on page load
    const handleInitialHash = () => {
      if (window.location.hash) {
        const targetEl = document.querySelector(window.location.hash);
        if (targetEl) {
          // Wait a moment for page to settle
          setTimeout(() => {
            const header = document.querySelector('header, nav') || { offsetHeight: 0 };
            const headerOffset = header.offsetHeight;
            const elementPosition = targetEl.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }, 100);
        }
      }
    };
    
    // Execute initial hash handling after a brief delay
    const hashTimer = setTimeout(handleInitialHash, 500);
    
    // Clean up event listeners on unmount
    return () => {
      clearTimeout(hashTimer);
      if (cleanup) cleanup();
      
      // Reset scroll behavior
      if (!isMobile && 'scrollBehavior' in document.documentElement.style) {
        document.documentElement.style.scrollBehavior = '';
      }
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;