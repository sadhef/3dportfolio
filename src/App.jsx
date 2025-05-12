import { BrowserRouter } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import React from "react";

// Import SEO component
import SEO from "./components/SEO";

// Import Navbar component directly
import { Navbar } from "./components";
// Import our enhanced Hero component with scroll effects
import Hero from "./components/Hero"; // Make sure this points to the enhanced Hero component

// Import custom styles
import "./styles/imageFilters.css";
import "./styles/heroStyles.css";
import "./styles/universal-fixes.css"; 
import "./styles/parallax.css";  // Basic parallax styles
import "./styles/heroScroll.css"; // Hero section scroll effects

// Import simple parallax component
import SimpleParallax from "./components/parallax/SimpleParallax";

// Lazy load components for better performance
const About = lazy(() => import("./components/About"));
const Experience = lazy(() => import("./components/Experience"));
const Tech = lazy(() => import("./components/Tech"));
const Works = lazy(() => import("./components/Works"));
const Contact = lazy(() => import("./components/Contact"));
const StarsCanvas = lazy(() => 
  import("./components/canvas").then(module => ({
    default: module.StarsCanvas
  }))
);

// Custom error boundary for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-black bg-opacity-80 text-white rounded-lg max-w-md mx-auto mt-10">
          <h2 className="text-xl mb-2 font-medium">Something went wrong</h2>
          <p className="mb-4 text-sm opacity-80">We're having trouble displaying this section</p>
          <button 
            className="px-4 py-2 bg-white text-black rounded hover:bg-gray-100 transition"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

// Loading component with fallback skeleton UI
const LoadingComponent = () => (
  <div className="flex items-center justify-center w-full h-60">
    <div className="text-white text-center">
      <div className="w-10 h-10 border-t-2 border-white rounded-full animate-spin mx-auto"></div>
      <p className="text-sm mt-4">Loading content...</p>
    </div>
  </div>
);

// Simple smooth scroll implementation
const smoothScrollTo = (elementId) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Initialize device detection and scroll tracking
  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check if user prefers reduced motion
    const checkReducedMotion = () => {
      if (window.matchMedia) {
        setPrefersReducedMotion(
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
        );
      }
    };
    
    // Track scroll position
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Run initial checks
    checkMobile();
    checkReducedMotion();
    
    // Set up event listeners
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll);
    
    // Add smooth scroll to anchor links
    const setupSmoothScroll = () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const targetId = this.getAttribute('href').substring(1);
          if (targetId) {
            smoothScrollTo(targetId);
          }
        });
      });
    };
    
    // Setup after a brief delay to ensure DOM is ready
    const setupTimer = setTimeout(setupSmoothScroll, 1000);
    
    // Mark app as loaded after a short delay
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Clean up event listeners and timers
    return () => {
      clearTimeout(loadTimer);
      clearTimeout(setupTimer);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Simple loading screen with progressive enhancement
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white text-center">
          <div className="mt-6 w-12 h-12 border-t-2 border-white rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-sm opacity-80">Loading your experience...</p>
        </div>
      </div>
    );
  }

  // Calculate background opacity based on scroll position
  const bgOpacity = Math.min(0.8, 0.4 + (scrollY / 1000));

  return (
    <BrowserRouter>
      <SEO />
      
      <div className="relative">
        {/* Dynamic background with scroll effect */}
        <div 
          className="fixed inset-0 bg-black -z-10 transition-opacity duration-300"
          style={{ opacity: bgOpacity }}
        >
          {/* Star-like background with scroll parallax effect */}
          <div 
            className="absolute inset-0 opacity-20" 
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              transform: `translateY(${scrollY * 0.05}px)`
            }}
          />
          
          {/* Second layer with different scroll speed */}
          <div 
            className="absolute inset-0 opacity-15" 
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 2px, transparent 2px)',
              backgroundSize: '50px 50px',
              transform: `translateY(${scrollY * 0.02}px)`
            }}
          />
        </div>
        
        {/* Main content */}
        <div className='relative z-0'>
          {/* Header area */}
          <div className='bg-transparent'>
            <Navbar />
            <Hero />
          </div>
          
          {/* About section with scroll parallax */}
          <div id="about" className="section-transition">
            <ErrorBoundary>
              <Suspense fallback={<LoadingComponent />}>
                <div 
                  className="transform transition-transform duration-300 ease-out"
                  style={{ 
                    transform: prefersReducedMotion || isMobile ? 'none' : 
                    `translateY(${Math.max(0, (scrollY - 500) * 0.1)}px)` 
                  }}
                >
                  <About />
                </div>
              </Suspense>
            </ErrorBoundary>
          </div>
          
          {/* Experience section with scroll parallax */}
          <div id="work" className="section-transition">
            <ErrorBoundary>
              <Suspense fallback={<LoadingComponent />}>
                <div 
                  className="transform transition-transform duration-300 ease-out"
                  style={{ 
                    transform: prefersReducedMotion || isMobile ? 'none' : 
                    `translateY(${Math.max(0, (scrollY - 1000) * 0.08)}px)` 
                  }}
                >
                  <Experience />
                </div>
              </Suspense>
            </ErrorBoundary>
          </div>
          
          {/* Tech section */}
          <div className="section-transition">
            <ErrorBoundary>
              <Suspense fallback={<LoadingComponent />}>
                <div 
                  className="transform transition-transform duration-300 ease-out"
                  style={{ 
                    transform: prefersReducedMotion || isMobile ? 'none' : 
                    `translateY(${Math.max(0, (scrollY - 1500) * 0.05)}px)` 
                  }}
                >
                  <Tech />
                </div>
              </Suspense>
            </ErrorBoundary>
          </div>
          
          {/* Works section with scroll parallax */}
          <div id="projects" className="section-transition safari-stacking-fix">
            <ErrorBoundary>
              <Suspense fallback={<LoadingComponent />}>
                <div 
                  className="transform transition-transform duration-300 ease-out"
                  style={{ 
                    transform: prefersReducedMotion || isMobile ? 'none' : 
                    `translateY(${Math.max(0, (scrollY - 2000) * 0.1)}px)` 
                  }}
                >
                  <Works />
                </div>
              </Suspense>
            </ErrorBoundary>
          </div>
          
          {/* Contact section - keep without parallax to preserve Earth.jsx */}
          <div id="contact" className="section-transition">
            <ErrorBoundary>
              <Suspense fallback={<LoadingComponent />}>
                <div className='relative z-0'>
                  <Contact />
                </div>
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      
        {/* Stars canvas - only for desktop */}
        {!isMobile && !prefersReducedMotion && (
          <Suspense fallback={null}>
            <StarsCanvas />
          </Suspense>
        )}
        
        {/* Scroll progress indicator */}
        {!prefersReducedMotion && !isMobile && (
          <div 
            className="fixed bottom-5 right-5 w-12 h-12 rounded-full bg-white bg-opacity-10 flex items-center justify-center z-50"
            style={{ 
              background: `conic-gradient(white ${scrollY / (document.body.scrollHeight - window.innerHeight) * 100}%, transparent 0)`,
              transition: 'all 0.2s ease'
            }}
          >
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-xs">
              {Math.min(100, Math.round(scrollY / (document.body.scrollHeight - window.innerHeight) * 100))}%
            </div>
          </div>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;