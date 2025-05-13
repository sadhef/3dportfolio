import { BrowserRouter } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import React from "react";

// Import SEO component
import SEO from "./components/SEO";

// Import critical components directly
import { Navbar, Hero } from "./components";

// Import optimized performance styles
import "./styles/performance-optimized.css";

// Lazy load components with low-priority for better performance
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

// Optimized loading component with reduced animation 
const LoadingComponent = () => (
  <div className="flex items-center justify-center w-full h-60">
    <div className="text-white text-center">
      <div className="w-10 h-10 border-t-2 border-white rounded-full animate-spin mx-auto"></div>
      <p className="text-sm mt-4">Loading content...</p>
    </div>
  </div>
);

// DetectPerformance - analyzes device capabilities for optimal rendering
const detectPerformance = () => {
  // Check for low-end device indicators
  const isLowEndDevice = () => {
    return (
      // Check for low memory (using deviceMemory API if available)
      (navigator.deviceMemory && navigator.deviceMemory < 4) ||
      // Check for low CPU cores
      (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) ||
      // Fallback to user agent for older devices
      /(low|mid)/.test(navigator.userAgent.toLowerCase())
    );
  };

  // Check for mobile device
  const isMobileDevice = () => {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth < 768
    );
  };

  // Check if WebGL is fully supported and performant
  const hasGoodWebGL = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return false;
      
      // Check for key extensions that indicate good performance
      const extensions = [
        'ANGLE_instanced_arrays',
        'OES_texture_float',
        'WEBGL_depth_texture'
      ];
      
      const hasExtensions = extensions.map(ext => gl.getExtension(ext));
      const allExtensionsPresent = hasExtensions.every(ext => ext !== null);
      
      // Additional performance indicators
      const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
      const maxViewportDims = gl.getParameter(gl.MAX_VIEWPORT_DIMS);
      
      return allExtensionsPresent && maxTextureSize >= 4096 && maxViewportDims[0] >= 4096;
    } catch (e) {
      return false;
    }
  };

  // Check if browser prefers reduced motion
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;

  // Determine overall performance level
  return {
    isLowEnd: isLowEndDevice(),
    isMobile: isMobileDevice(),
    hasGoodGraphics: hasGoodWebGL(),
    reduceMotion: prefersReducedMotion,
    // Performance tier calculation
    performanceTier: (
      (isLowEndDevice() ? 0 : 1) + 
      (isMobileDevice() ? 0 : 1) + 
      (hasGoodWebGL() ? 1 : 0) + 
      (prefersReducedMotion ? 0 : 1)
    )
  };
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [performanceProfile, setPerformanceProfile] = useState({
    isLowEnd: false,
    isMobile: false,
    hasGoodGraphics: true,
    reduceMotion: false,
    performanceTier: 3
  });
  
  // Initialize device detection on mount
  useEffect(() => {
    // Analyze device performance once on initial load
    const profile = detectPerformance();
    setPerformanceProfile(profile);
    
    // Add performance profile to window for component access
    window.performanceProfile = profile;
    
    // Check if user prefers reduced motion
    const checkReducedMotion = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setPerformanceProfile(prev => ({
        ...prev,
        reduceMotion: prefersReducedMotion
      }));
    };
    
    // Listen for media query changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', checkReducedMotion);
    }
    
    // Apply WebGL performance optimizations
    const optimizeWebGL = () => {
      // Append performance class to body for CSS optimizations
      document.body.classList.add(`performance-tier-${profile.performanceTier}`);
      
      // Set WebGL hints for Three.js
      if (window.THREE) {
        if (profile.performanceTier < 2) {
          // Lower quality settings for less powerful devices
          window.THREE.LinearMipmapLinearFilter = window.THREE.NearestFilter;
          window.THREE.Math.floorPowerOfTwo = (value) => Math.floor(value);
        }
      }
    };
    
    optimizeWebGL();
    
    // Mark app as loaded after measuring performance
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, profile.performanceTier < 2 ? 800 : 1500); // Faster loading for low-end devices
    
    // Clean up event listeners
    return () => {
      clearTimeout(timer);
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
          <p className="mt-4 text-sm opacity-80">Optimizing your experience...</p>
        </div>
      </div>
    );
  }

  // Use a simpler renderer for low-performance devices
  const useSimpleRenderer = performanceProfile.performanceTier < 2;

  return (
    <BrowserRouter>
      {/* Add SEO component */}
      <SEO />
      
      <div className='relative z-0'>
        {/* Critical rendering path components */}
        <div className='bg-transparent'>
          <Navbar />
          <Hero useSimpleRenderer={useSimpleRenderer} />
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
        
        {/* Tech section - conditionally rendered based on performance */}
        <div className="section-placeholder">
          <ErrorBoundary>
            <Suspense fallback={<LoadingComponent />}>
              <Tech useSimpleRenderer={useSimpleRenderer} />
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
                <Contact useSimpleRenderer={useSimpleRenderer} />
              </div>
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
      
      {/* Only load stars when device can handle it */}
      {performanceProfile.performanceTier >= 2 && !performanceProfile.reduceMotion && (
        <Suspense fallback={null}>
          <StarsCanvas density={performanceProfile.performanceTier >= 3 ? 'high' : 'low'} />
        </Suspense>
      )}
      
      {/* Static background for low-performance devices */}
      {(performanceProfile.performanceTier < 2 || performanceProfile.reduceMotion) && (
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