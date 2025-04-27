import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";

import { About, Contact, Experience, Hero, Navbar, Tech, Works, StarsCanvas } from "./components";
import "./styles/imageFilters.css"; // Import our custom image filters
import "./styles/heroStyles.css"; // Import hero-specific styles

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simple fade-in transition
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    // Apply basic styling
    document.body.classList.add('black-white-theme');
    document.body.style.background = '#000000';
    
    return () => {
      clearTimeout(timer);
      document.body.classList.remove('black-white-theme');
    };
  }, []);

  // Simple loading screen
  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
        <div className="text-white text-center">
          <h1 className="text-4xl font-bold mb-3">Mohammed Sadhef</h1>
          <p className="text-xl">Portfolio</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* StarsCanvas background */}
      <StarsCanvas />
      
      <div className='relative z-0'>
        <div className='bg-transparent'>
          <Navbar />
          <Hero />
        </div>
        <About />
        <Experience />
        <Tech />
        <Works />
        <div className='relative z-0'>
          <Contact />
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;