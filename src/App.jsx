import { BrowserRouter } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";

// Import only critical components directly
import { Navbar } from "./components";
import SEO from "./components/SEO";

// Lazy load all other components
const Hero = lazy(() => import("./components/Hero"));
const About = lazy(() => import("./components/About"));
const Experience = lazy(() => import("./components/Experience"));
const Works = lazy(() => import("./components/Works"));
const Tech = lazy(() => import("./components/Tech"));
const Contact = lazy(() => import("./components/Contact"));

// Create fallback components for 3D content
const StaticStarsBg = () => (
  <div className="fixed inset-0 z-[-1] bg-black">
    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff_1px,transparent_1px)]" 
         style={{backgroundSize: "20px 20px"}}></div>
  </div>
);

// Load Three.js components with a safety mechanism
const safeLoad = (importFn) => {
  return new Promise((resolve) => {
    // Wait until the page is fully loaded
    if (document.readyState === 'complete') {
      importFn().then(resolve);
    } else {
      window.addEventListener('load', () => {
        // Add a small delay to ensure React is fully initialized
        setTimeout(() => {
          importFn().then(resolve);
        }, 500);
      }, { once: true });
    }
  });
};

// Safely load StarsCanvas
const StarsCanvas = lazy(() => 
  safeLoad(() => import("./components/canvas/Stars"))
);

// Simple load indicator
const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-10 h-10 border-2 border-white border-opacity-20 border-t-white rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  const [domLoaded, setDomLoaded] = useState(false);
  const [canRender3D, setCanRender3D] = useState(false);
  
  useEffect(() => {
    // Check if DOM is loaded
    setDomLoaded(true);
    
    // Delay Three.js components initialization
    const timer = setTimeout(() => {
      const { performanceTier, prefersReducedMotion } = 
        window.deviceCapabilities || { performanceTier: 2, prefersReducedMotion: false };
      
      // Only enable 3D effects for higher performance devices
      setCanRender3D(performanceTier >= 2 && !prefersReducedMotion);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (!domLoaded) return <Loader />;

  return (
    <BrowserRouter>
      <SEO />
      <Navbar />
      
      {/* Render the static stars fallback immediately for all devices */}
      <StaticStarsBg />
      
      <div className="relative z-0">
        <Suspense fallback={<Loader />}>
          <Hero />
        </Suspense>
        
        <Suspense fallback={<div className="h-screen" />}>
          <div id="about">
            <About />
          </div>
        </Suspense>
        
        <Suspense fallback={<div className="h-screen" />}>
          <div id="work">
            <Experience />
          </div>
        </Suspense>
        
        <Suspense fallback={<div className="h-screen" />}>
          <Tech />
        </Suspense>
        
        <Suspense fallback={<div className="h-screen" />}>
          <div id="projects">
            <Works />
          </div>
        </Suspense>
        
        <Suspense fallback={<div className="h-screen" />}>
          <div id="contact">
            <Contact />
          </div>
        </Suspense>
      </div>
      
      {/* Only load the 3D stars if the device can handle it */}
      {canRender3D && (
        <Suspense fallback={null}>
          <StarsCanvas />
        </Suspense>
      )}
    </BrowserRouter>
  );
};

export default App;