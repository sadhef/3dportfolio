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
// Import parallax styles if you've created them
// import "./styles/parallax.css"; 

// Import simplified parallax components
import SmoothScroll from "./components/parallax/SmoothScroll";
import ParallaxBackground from "./components/parallax/ParallaxBackground";

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
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Initialize device detection on mount
  useEffect(() => {
    // Check if device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
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
    
    // Mark app as loaded after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    // Clean up event listeners
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
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
      <SEO />
      
      <SmoothScroll>
        {/* Simple background implementation that doesn't rely on useScroll */}
        <div className="relative">
          {/* Fixed background */}
          <div className="fixed inset-0 bg-black -z-10">
            {/* Static star-like background for better performance */}
            <div 
              className="absolute inset-0 opacity-20" 
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />
          </div>
          
          {/* Main content */}
          <div className='relative z-0'>
            {/* Critical rendering path components */}
            <div className='bg-transparent'>
              <Navbar />
              <Hero />
            </div>
            
            {/* About section */}
            <div id="about" className="section-transition">
              <ErrorBoundary>
                <Suspense fallback={<LoadingComponent />}>
                  <About />
                </Suspense>
              </ErrorBoundary>
            </div>
            
            {/* Experience section */}
            <div id="work" className="section-transition">
              <ErrorBoundary>
                <Suspense fallback={<LoadingComponent />}>
                  <Experience />
                </Suspense>
              </ErrorBoundary>
            </div>
            
            {/* Tech section */}
            <div className="section-transition">
              <ErrorBoundary>
                <Suspense fallback={<LoadingComponent />}>
                  <Tech />
                </Suspense>
              </ErrorBoundary>
            </div>
            
            {/* Works section */}
            <div id="projects" className="section-transition safari-stacking-fix">
              <ErrorBoundary>
                <Suspense fallback={<LoadingComponent />}>
                  <Works />
                </Suspense>
              </ErrorBoundary>
            </div>
            
            {/* Contact section */}
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
        
          {/* Only load stars when not on mobile and user prefers animations */}
          {!isMobile && !prefersReducedMotion && (
            <Suspense fallback={null}>
              <StarsCanvas />
            </Suspense>
          )}
        </div>
      </SmoothScroll>
    </BrowserRouter>
  );
};

export default App;