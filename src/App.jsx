import { BrowserRouter } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import React from "react";

// Import critical components directly
import { Navbar, Hero } from "./components";

// Import custom styles
import "./styles/imageFilters.css";
import "./styles/heroStyles.css";
import "./styles/universal.css"; // Add the universal CSS

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

// Progressive loading of components
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

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [visibleSections, setVisibleSections] = useState({
    about: false,
    experience: false,
    tech: false,
    works: false,
    contact: false
  });
  
  // Mobile detection (but not browser-specific)
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    // Set a timeout to ensure the app loads even if 'load' event doesn't fire
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    
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
  }, []);

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
            
            // Add visibility class for animation
            entry.target.classList.add('section-visible');
            
            // Index cards for staggered animation
            const cards = entry.target.querySelectorAll('.project-card');
            cards.forEach((card, index) => {
              card.style.setProperty('--index', index);
              setTimeout(() => {
                card.classList.add('card-visible');
              }, index * 100);
            });
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
        
        {/* Sections with progressive loading */}
        <div id="about" className="section-placeholder">
          <ErrorBoundary>
            <Suspense fallback={<LoadingComponent />}>
              <About />
            </Suspense>
          </ErrorBoundary>
        </div>
        
        <div id="experience" className="section-placeholder">
          <ErrorBoundary>
            <Suspense fallback={<LoadingComponent />}>
              <Experience />
            </Suspense>
          </ErrorBoundary>
        </div>
        
        <div id="tech" className="section-placeholder">
          <ErrorBoundary>
            <Suspense fallback={<LoadingComponent />}>
              <Tech />
            </Suspense>
          </ErrorBoundary>
        </div>
        
        {/* Works section with special handling */}
        <div id="works" className="section-placeholder force-hardware-accel">
          <ErrorBoundary>
            <Suspense fallback={<LoadingComponent />}>
              <Works />
            </Suspense>
          </ErrorBoundary>
        </div>
        
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
      
      {/* Simpler stars canvas for all browsers */}
      <Suspense fallback={null}>
        <StarsCanvas />
      </Suspense>
      
      {/* Additional static background fallback if needed */}
      {isMobile && (
        <div className="fixed inset-0 z-[-2] bg-gradient-to-b from-black to-[#050505]"></div>
      )}
    </BrowserRouter>
  );
};

export default App;