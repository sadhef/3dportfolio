"use client";

import { Suspense, lazy, useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Import only critical components directly
import { Navbar } from "../components"; // Changed from @/components

// Lazy load components for better performance
const Hero = lazy(() => import("../components/Hero")); // Changed from @/components/Hero
const About = lazy(() => import("../components/About")); // Changed from @/components/About
const Experience = lazy(() => import("../components/Experience"));
const Tech = lazy(() => import("../components/Tech"));
const Works = lazy(() => import("../components/Works"));
const Contact = lazy(() => import("../components/Contact"));

// Dynamic import with SSR disabled for 3D components (crucial for Next.js)
const StarsCanvas = dynamic(() => import("../components/canvas/Stars"), { 
  ssr: false,
  loading: () => null
});

// Simple placeholder loading component
const SectionPlaceholder = () => (
  <div className="w-full h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-2 border-white border-opacity-20 border-t-white rounded-full animate-spin"></div>
  </div>
);

export default function Home() {
  const [isClient, setIsClient] = useState(false);
  const [devicePerformance, setDevicePerformance] = useState({
    performanceTier: 2, 
    prefersReducedMotion: false
  });
  
  useEffect(() => {
    // Set client-side rendering flag
    setIsClient(true);
    
    // Check device capabilities
    const detectDeviceCapabilities = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
      const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
      const isLowEndDevice = (navigator.deviceMemory && navigator.deviceMemory < 4) || 
                            (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4);
      
      // Set performance tier: 0 (lowest) to 3 (highest)
      const performanceTier = 
        (isLowEndDevice ? 0 : 1) + 
        (isMobile ? 0 : 1) + 
        (prefersReducedMotion ? 0 : 1);
      
      setDevicePerformance({
        performanceTier,
        prefersReducedMotion
      });
    };
    
    detectDeviceCapabilities();
  }, []);
  
  // Should render 3D stars?
  const shouldRender3D = isClient && devicePerformance.performanceTier >= 2 && !devicePerformance.prefersReducedMotion;

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
      
      {shouldRender3D && <StarsCanvas />}
    </main>
  );
}