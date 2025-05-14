"use client";

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

// Dynamic import with SSR disabled for 3D components (crucial for Next.js)
const StarsCanvas = dynamic(() => import("../components/canvas/Stars"), { 
  ssr: false 
});

// Simple placeholder loading component
const SectionPlaceholder = () => (
  <div className="w-full h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-2 border-white border-opacity-20 border-t-white rounded-full animate-spin"></div>
  </div>
);

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
      
      <Suspense fallback={<SectionPlaceholder />}>
        <Hero />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder />}>
        <About />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder />}>
        <Experience />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder />}>
        <Tech />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder />}>
        <Works />
      </Suspense>
      
      <Suspense fallback={<SectionPlaceholder />}>
        <Contact />
      </Suspense>
      
      {/* Always render 3D stars without any conditions */}
      <StarsCanvas />
    </main>
  );
}