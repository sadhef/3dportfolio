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

// Create a separate loader for the StarsCanvas to avoid Three.js initialization issues
const StarsCanvasLoader = lazy(() => 
  new Promise(resolve => {
    // Give the app time to fully initialize before loading Three.js
    setTimeout(() => {
      import("./components/canvas/Stars").then(module => {
        resolve({ default: module.default });
      });
    }, 1000);
  })
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
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (!domLoaded) return <Loader />;

  return (
    <BrowserRouter>
      <SEO />
      <Navbar />
      
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
      
      {canRender3D && (
        <Suspense fallback={null}>
          <StarsCanvasLoader />
        </Suspense>
      )}
    </BrowserRouter>
  );
};

export default App;