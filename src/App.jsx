import { BrowserRouter } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";

// Import critical components directly
import { Navbar, Hero } from "./components";
// Lazy load non-critical components
const About = lazy(() => import("./components/About"));
const Experience = lazy(() => import("./components/Experience"));
const Tech = lazy(() => import("./components/Tech"));
const Works = lazy(() => import("./components/Works"));
const Contact = lazy(() => import("./components/Contact"));
const StarsCanvas = lazy(() => import("./components/canvas/Stars").then(module => ({
  default: module.default
})));

// Import custom styles
import "./styles/imageFilters.css";
import "./styles/heroStyles.css";
import "./styles/performanceOptimization.css"; // Add the new performance CSS

// Simple loading component
const LoadingComponent = () => (
  <div className="flex items-center justify-center w-full h-60">
    <div className="text-white text-center">
      <p className="text-xl mb-2">Loading...</p>
      <div className="w-12 h-12 border-t-2 border-white rounded-full animate-spin mx-auto"></div>
    </div>
  </div>
);

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // Indicate component has mounted
    setHasMounted(true);
    
    // Simple fade-in transition - slightly delayed for better performance
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 800);
    
    // Apply basic styling
    document.body.classList.add('black-white-theme');
    document.body.style.background = '#000000';
    
    // Optimize page load
    window.addEventListener('load', () => {
      // Wait until fonts and other resources are loaded
      setIsLoaded(true);
    });
    
    return () => {
      clearTimeout(timer);
      document.body.classList.remove('black-white-theme');
    };
  }, []);

  // Simple intersection observer to load content as needed
  useEffect(() => {
    if (!hasMounted) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // When a section comes into view, add a class that triggers content loading
            entry.target.classList.add('section-visible');
            observer.unobserve(entry.target); // Only trigger once
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of element is visible
    );
    
    // Observe each section
    document.querySelectorAll('section').forEach(section => {
      observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, [hasMounted]);

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
        
        {/* Lazy-loaded components with suspense fallbacks */}
        <Suspense fallback={<LoadingComponent />}>
          <About />
        </Suspense>
        
        <Suspense fallback={<LoadingComponent />}>
          <Experience />
        </Suspense>
        
        <Suspense fallback={<LoadingComponent />}>
          <Tech />
        </Suspense>
        
        <Suspense fallback={<LoadingComponent />}>
          <Works />
        </Suspense>
        
        <Suspense fallback={<LoadingComponent />}>
          <div className='relative z-0'>
            <Contact />
          </div>
        </Suspense>
      </div>
      
      {/* Load StarsCanvas last since it's decorative */}
      <Suspense fallback={null}>
        <StarsCanvas />
      </Suspense>
    </BrowserRouter>
  );
};

export default App;