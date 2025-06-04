"use client";

import { Suspense, lazy } from "react";
import dynamic from "next/dynamic";

// Import only critical components directly
import { Navbar } from "../components";

// Lazy load components for better performance
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
  return (
    <main className="relative z-0 bg-primary">
      <Navbar /> {/* Static component loaded immediately */}
      
      {/* Lazy load each section with a different fallback for better user experience */}
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
