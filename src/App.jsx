import { BrowserRouter } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import React from "react";

// Import SEO component
import SEO from "./components/SEO";

// Import critical components directly
import { Navbar, Hero } from "./components";

// Import custom styles
import "./styles/imageFilters.css";
import "./styles/heroStyles.css";
import "./styles/universal-fixes.css"; 

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

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Mobile detection for performance optimization
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Initialize device detection on mount
  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    
    // Check if user prefers reduced motion
    const checkReducedMotion = () => {
      setPrefersReducedMotion(
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    };
    
    // Run checks initially
    checkMobile();
    checkReducedMotion();
    
    // Set up listeners for changes
    window.addEventListener('resize', checkMobile);
    
    // Listen for media query changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', checkReducedMotion);
    }
    
    // Track user interaction
    const handleInteraction = () => {
      setHasInteracted(true);
    };
    
    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    
    // Mark app as loaded after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    // Clean up event listeners
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', checkReducedMotion);
      }
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

  return (
    <BrowserRouter>
      {/* Add SEO component */}
      <SEO />
      
      <div className='relative z-0'>
        {/* Critical rendering path components */}
        <div className='bg-transparent'>
          <Navbar />
          <Hero />
        </div>
        
        {/* About section - high priority */}
        <div id="about" className="section-placeholder">
          <ErrorBoundary>
            <Suspense fallback={<LoadingComponent />}>
              <About />
            </Suspense>
          </ErrorBoundary>
        </div>
        
        {/* Experience section */}
        <div id="work" className="section-placeholder">
          <ErrorBoundary>
            <Suspense fallback={<LoadingComponent />}>
              <Experience />
            </Suspense>
          </ErrorBoundary>
        </div>
        
        {/* Tech section */}
        <div className="section-placeholder">
          <ErrorBoundary>
            <Suspense fallback={<LoadingComponent />}>
              <Tech />
            </Suspense>
          </ErrorBoundary>
        </div>
        
        {/* Works section */}
        <div id="projects" className="section-placeholder safari-stacking-fix">
          <ErrorBoundary>
            <Suspense fallback={<LoadingComponent />}>
              <Works />
            </Suspense>
          </ErrorBoundary>
        </div>
        
        {/* Contact section */}
        <div id="contact" className="section-placeholder">
          <ErrorBoundary>
            <Suspense fallback={<LoadingComponent />}>
              <div className='relative z-0'>
                <Contact />
              </div>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
      
      {/* Only load stars when not on mobile and user prefers animations */}
      {!isMobile && !prefersReducedMotion && (
        <Suspense fallback={null}>
          <StarsCanvas />
        </Suspense>
      )}
      
      {/* Static background for mobile or reduced motion preference */}
      {(isMobile || prefersReducedMotion) && (
        <div className="fixed inset-0 z-[-1] safari-bg">
          <div className="absolute inset-0 bg-black"></div>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)]" 
               style={{backgroundSize: "20px 20px"}}></div>
        </div>
      )}
    </BrowserRouter>
  );
};

export default App;