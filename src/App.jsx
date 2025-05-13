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
const StarsCanvas = lazy(() => import("./components/canvas/Stars").then(module => ({ default: module.default })));

// Simple load indicator
const Loader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="w-10 h-10 border-2 border-white border-opacity-20 border-t-white rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  const [domLoaded, setDomLoaded] = useState(false);
  const { performanceTier, prefersReducedMotion } = window.deviceCapabilities || { performanceTier: 2, prefersReducedMotion: false };
  
  // Only enable 3D effects for higher performance devices
  const shouldRender3D = performanceTier >= 2 && !prefersReducedMotion;

  useEffect(() => {
    setDomLoaded(true);
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
      
      {shouldRender3D && (
        <Suspense fallback={null}>
          <StarsCanvas />
        </Suspense>
      )}
    </BrowserRouter>
  );
};

export default App;