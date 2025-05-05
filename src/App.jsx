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

// Performance monitoring utility
const perfLogger = {
  mark: (name) => {
    if (process.env.NODE_ENV === 'development') {
      performance.mark(name);
    }
  },
  measure: (name, startMark, endMark) => {
    if (process.env.NODE_ENV === 'development') {
      performance.measure(name, startMark, endMark);
      console.log(`Performance: ${name}`, performance.getEntriesByName(name)[0].duration);
    }
  }
};

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
    // Here you could add error tracking (e.g., Sentry)
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

// Progressive loading of components with configurable loading priorities
const About = lazy(() => {
  perfLogger.mark('about-start');
  return import("./components/About").then(module => {
    perfLogger.mark('about-end');
    perfLogger.measure('about-load-time', 'about-start', 'about-end');
    return module;
  });
});

const Experience = lazy(() => import("./components/Experience"));
const Tech = lazy(() => import("./components/Tech"));
const Works = lazy(() => import("./components/Works"));
const Contact = lazy(() => import("./components/Contact"));
const StarsCanvas = lazy(() => 
  import("./components/canvas").then(module => ({
    default: module.StarsCanvas
  }))
);

// Code animation - load dynamically only when needed
const CodeTypingAnimation = lazy(() => import("./components/CodeTypingAnimation"));

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showCodeAnimation, setShowCodeAnimation] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Mobile detection for performance optimization
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  // Track initial page load performance
  useEffect(() => {
    // Register performance observer for metrics reporting
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const lcp = list.getEntries()[0];
          console.log('LCP:', lcp?.startTime);
        });
        observer.observe({ type: 'largest-contentful-paint', buffered: true });
      } catch (e) {
        console.error('Performance observer error:', e);
      }
    }

    // Apply universal fixes
    document.documentElement.classList.add('safari-fixes');
    
    // Listen for viewport changes
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Set a timeout to ensure the app loads within reasonable time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    // Listen for page load
    window.addEventListener('load', () => {
      setIsLoading(false);
      clearTimeout(timer);
    });
    
    // Track user interaction
    const handleInteraction = () => {
      setHasInteracted(true);
    };
    
    window.addEventListener('click', handleInteraction);
    window.addEventListener('scroll', handleInteraction);
    
    // Apply basic styling
    document.body.style.background = '#000000';
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', () => setIsLoading(false));
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, []);

  // Skip animation for users who prefer reduced motion
  useEffect(() => {
    if (prefersReducedMotion) {
      setShowCodeAnimation(false);
    }
  }, [prefersReducedMotion]);

  // Handle animation completion
  const handleAnimationComplete = () => {
    setShowCodeAnimation(false);
  };

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
      
      {/* Show coding animation when app first loads, but only if animations are acceptable */}
      {showCodeAnimation && !prefersReducedMotion && (
        <Suspense fallback={null}>
          <CodeTypingAnimation onComplete={handleAnimationComplete} />
        </Suspense>
      )}
      
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
        <div id="work" className="section-placeholder"> {/* Changed to "work" to match navLink ID */}
          <ErrorBoundary>
            <Suspense fallback={<LoadingComponent />}>
              <Experience />
            </Suspense>
          </ErrorBoundary>
        </div>
        
        {/* Tech section */}
        <div id="tech" className="section-placeholder">
          <ErrorBoundary>
            <Suspense fallback={<LoadingComponent />}>
              <Tech />
            </Suspense>
          </ErrorBoundary>
        </div>
        
        {/* Works section */}
        <div id="projects" className="section-placeholder safari-stacking-fix"> {/* Added ID for direct navigation */}
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
               style={{backgroundSize: "40px 40px"}}></div>
        </div>
      )}
    </BrowserRouter>
  );
};

export default App;