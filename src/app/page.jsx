import { Suspense, lazy, useEffect } from "react";
import dynamic from "next/dynamic";
import { reportWebVitals } from "../utils/web-vitals";

// Import components
import { Navbar } from "../components";
const Hero = lazy(() => import("../components/Hero"));
const About = lazy(() => import("../components/About"));
const Experience = lazy(() => import("../components/Experience"));
const Tech = lazy(() => import("../components/Tech"));
const Works = lazy(() => import("../components/Works"));
const Contact = lazy(() => import("../components/Contact"));
const Blog = lazy(() => import("../components/Blog"));
const FAQ = lazy(() => import("../components/FAQ"));

// For 3D components (crucial for Next.js)
const StarsCanvas = dynamic(() => import("../components/canvas/Stars"), { 
  ssr: false 
});

export default function Home() {
  // Track initial page load performance
  useEffect(() => {
    // Report initial page load Web Vitals
    if (typeof window !== 'undefined') {
      const { getLCP, getFID, getCLS } = require('web-vitals');
      
      getCLS(reportWebVitals);
      getFID(reportWebVitals);
      getLCP(reportWebVitals);
    }
  }, []);

  return (
    <main className="relative z-0 bg-primary">
      <Navbar />
      
      <Suspense fallback={<div className="h-screen" />}>
        <Hero />
      </Suspense>
      
      <Suspense fallback={<div className="h-screen" />}>
        <About />
      </Suspense>
      
      <Suspense fallback={<div className="h-screen" />}>
        <Experience />
      </Suspense>
      
      <Suspense fallback={<div className="h-screen" />}>
        <Tech />
      </Suspense>
      
      <Suspense fallback={<div className="h-screen" />}>
        <Works />
      </Suspense>
      
      {/* New SEO-optimized Blog section */}
      <Suspense fallback={<div className="h-screen" />}>
        <Blog />
      </Suspense>
      
      {/* New FAQ section for featured snippets */}
      <Suspense fallback={<div className="h-screen" />}>
        <FAQ />
      </Suspense>
      
      <Suspense fallback={<div className="h-screen" />}>
        <Contact />
      </Suspense>
      
      <StarsCanvas />
    </main>
  );
}

// Export for Web Vitals reporting
export { reportWebVitals };