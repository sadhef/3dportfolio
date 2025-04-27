import { BrowserRouter } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import React from "react";

// Import critical components directly
import { Navbar, Hero } from "./components";

// Import custom styles
import "./styles/imageFilters.css";
import "./styles/heroStyles.css";
import "./styles/safari-fixes.css"; // Add Safari-specific fixes

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

// Safari detection
const isSafari = () => {
  const ua = navigator.userAgent.toLowerCase();
  return ua.indexOf('safari') !== -1 && ua.indexOf('chrome') === -1;
};

// Progressive loading of components with priority
const About = lazy(() => import("./components/About"));
const Experience = lazy(() => import("./components/Experience"));
const Tech = lazy(() => import("./components/Tech"));
// Import the optimized Works component - directly for Safari
const Works = lazy(() => {
  // Use a small delay for Safari to improve component loading
  if (isSafari()) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(import("./components/Works"));
      }, 300);
    });
  }
  return import("./components/Works");
});
const Contact = lazy(() => import("./components/Contact"));
const StarsCanvas = lazy(() => 
  import("./components/canvas").then(module => ({
    default: module.StarsCanvas
  }))
);

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSafariBrowser, setIsSafariBrowser] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Detect Safari
    const safariDetected = isSafari();
    setIsSafariBrowser(safariDetected);
    
    // Add Safari class to HTML for CSS targeting
    if (safariDetected) {
      document.documentElement.classList.add('safari');
    }
    
    // Set a timeout to ensure the app loads even if 'load' event doesn't fire
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, safariDetected ? 1200 : 800); // Longer timeout for Safari
    
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

  // Safari-specific hack to force re-mount of Works component if needed
  useEffect(() => {
    if (isSafariBrowser && isLoaded) {
      // Check if works section loaded properly
      const checkWorksSection = setTimeout(() => {
        const worksSection = document.getElementById('projects');
        const projectsVisible = worksSection && 
          worksSection.querySelectorAll('.safari-card, .bg-tertiary').length > 0;
        
        // Force remount if not loaded and under retry limit
        if (!projectsVisible && retryCount < 3) {
          console.log('Retrying Works section load...');
          setRetryCount(prev => prev + 1);
          
          // Force DOM update
          const parentElement = worksSection?.parentElement;
          if (parentElement) {
            parentElement.style.display = 'none';
            setTimeout(() => {
              parentElement.style.display = 'block';
            }, 50);
          }
        }
      }, 1000);
      
      return () => clearTimeout(checkWorksSection);
    }
  }, [isSafariBrowser, isLoaded, retryCount]);

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
              <About />
            </Suspense>
          </ErrorBoundary>
        </div>
        
        {/* Experience section */}
        <div id="experience" className="section-placeholder">
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
        
        {/* Works section - with retryCount as key to force remount in Safari */}
        <div id="works-container" className="section-placeholder safari-stacking-fix">
          <ErrorBoundary>
            <Suspense fallback={<LoadingComponent />}>
              {/* Using key to force remount in Safari if needed */}
              <Works key={`works-${isSafariBrowser ? retryCount : 'default'}`} />
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
      
      {/* Load StarsCanvas with reduced rendering for Safari */}
      {!isSafariBrowser && (
        <Suspense fallback={null}>
          <StarsCanvas />
        </Suspense>
      )}
      
      {/* Simplified stars for Safari */}
      {isSafariBrowser && (
        <div className="fixed inset-0 z-[-1] safari-bg">
          <div className="absolute inset-0 bg-black"></div>
          <div className="absolute inset-0 opacity-20 safari-stars"></div>
        </div>
      )}
    </BrowserRouter>
  );
};

export default App;