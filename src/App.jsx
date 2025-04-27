import { BrowserRouter } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";

// Import critical components directly
import { Navbar, Hero } from "./components";

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
        <div className="p-6 bg-black bg-opacity-50 text-white rounded-lg">
          <h2 className="text-xl mb-2">Something went wrong</h2>
          <button 
            className="px-4 py-2 bg-white text-black rounded"
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

// Improved loading component
const LoadingComponent = () => (
  <div className="flex items-center justify-center w-full h-60">
    <div className="text-white text-center">
      <div className="w-10 h-10 border-t-2 border-white rounded-full animate-spin mx-auto"></div>
      <p className="text-sm mt-4">Loading content...</p>
    </div>
  </div>
);

// Progressive loading of components with priority
const About = lazy(() => import("./components/About"));
const Experience = lazy(() => import("./components/Experience"));
const Tech = lazy(() => import("./components/Tech"));
// Import the optimized Works component
const Works = lazy(() => import("./components/Works"));
const Contact = lazy(() => import("./components/Contact"));
const StarsCanvas = lazy(() => 
  import("./components/canvas").then(module => ({
    default: module.StarsCanvas
  }))
);

// Import custom styles
import "./styles/imageFilters.css";
import "./styles/heroStyles.css";
import React from "react";

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    about: false,
    experience: false,
    tech: false,
    works: false,
    contact: false
  });
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  useEffect(() => {
    // Set a timeout to ensure the app loads even if 'load' event doesn't fire
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, isMobile ? 1200 : 800); // Longer timeout for mobile
    
    // Listen for page load
    window.addEventListener('load', () => {
      setIsLoaded(true);
      clearTimeout(timer);
    });
    
    // Apply basic styling
    document.body.style.background = '#000000';
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', () => setIsLoaded(true));
    };
  }, [isMobile]);

  // Setup intersection observer for progressive loading
  useEffect(() => {
    if (!isLoaded) return;
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          if (sectionId && Object.keys(visibleSections).includes(sectionId)) {
            setVisibleSections(prev => ({
              ...prev,
              [sectionId]: true
            }));
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    
    // Observe section placeholder elements
    document.querySelectorAll('.section-placeholder').forEach(el => {
      observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, [isLoaded, visibleSections]);

  // Simple loading screen
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-3">Mohammed Sadhef</h1>
          <p className="text-xl">Portfolio</p>
          <div className="mt-6 w-12 h-12 border-t-2 border-white rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className='relative z-0'>
        {/* Critical rendering path components */}
        <div className='bg-transparent'>
          <Navbar />
          <Hero />
        </div>
        
        {/* About section */}
        <div id="about" className="section-placeholder">
          <ErrorBoundary>
            <Suspense fallback={<LoadingComponent />}>
              {(visibleSections.about || !isMobile) && <About />}
            </Suspense>
          </ErrorBoundary>
        </div>
        
        {/* Experience section */}
        <div id="experience" className="section-placeholder">
          <ErrorBoundary>
            <Suspense fallback={<LoadingComponent />}>
              {(visibleSections.experience || !isMobile) && <Experience />}
            </Suspense>
          </ErrorBoundary>
        </div>
        
        {/* Tech section */}
        <div id="tech" className="section-placeholder">
          <ErrorBoundary>
            <Suspense fallback={<LoadingComponent />}>
              {(visibleSections.tech || !isMobile) && <Tech />}
            </Suspense>
          </ErrorBoundary>
        </div>
        
        {/* Works section - high priority */}
        <div id="works" className="section-placeholder">
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
              {(visibleSections.contact || !isMobile) && (
                <div className='relative z-0'>
                  <Contact />
                </div>
              )}
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
      
      {/* Load StarsCanvas with reduced rendering for mobile */}
      {!isMobile && (
        <Suspense fallback={null}>
          <StarsCanvas />
        </Suspense>
      )}
      
      {/* Simplified stars for mobile */}
      {isMobile && (
        <div className="fixed inset-0 bg-black z-[-1]">
          <div className="fixed opacity-30 inset-0 bg-[radial-gradient(white,_rgba(255,255,255,0)_70%)]"></div>
        </div>
      )}
    </BrowserRouter>
  );
};

export default App;