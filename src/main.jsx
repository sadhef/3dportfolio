import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Performance monitoring middleware for development mode
if (process.env.NODE_ENV === 'development') {
  // Create custom performance measurement markers
  const startTime = performance.now();
  
  // Log initial render time
  window.addEventListener('load', () => {
    const loadTime = performance.now() - startTime;
    console.log(`Full page load time: ${loadTime.toFixed(2)}ms`);
    
    // Report performance metrics
    if ('PerformanceObserver' in window) {
      try {
        // Track Largest Contentful Paint
        const lcpObserver = new PerformanceObserver((entryList) => {
          const lcpEntry = entryList.getEntries()[0];
          console.log('LCP:', lcpEntry.startTime.toFixed(2), 'ms');
        });
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        
        // Track First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
          const fidEntry = entryList.getEntries()[0];
          console.log('FID:', fidEntry.processingStart - fidEntry.startTime, 'ms');
        });
        fidObserver.observe({ type: 'first-input', buffered: true });
        
        // Track Cumulative Layout Shift
        const clsObserver = new PerformanceObserver((entryList) => {
          let clsValue = 0;
          for (const entry of entryList.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          console.log('CLS:', clsValue);
        });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch (e) {
        console.warn('Performance metrics could not be collected', e);
      }
    }
  });
}

// Prepare for critical rendering path
const prepareForHydration = () => {
  // Create a style element for critical CSS
  const style = document.createElement('style');
  style.innerHTML = `
    body {
      margin: 0;
      padding: 0;
      background-color: #000;
      font-family: 'Poppins', sans-serif;
      overflow-x: hidden;
    }
    
    /* Splash loading screen */
    .splash-loading {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #000;
      z-index: 10000;
    }
    
    .splash-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(255,255,255,0.1);
      border-radius: 50%;
      border-top: 4px solid #fff;
      animation: spin 1s ease-in-out infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  // Create and show splash screen
  const splash = document.createElement('div');
  splash.className = 'splash-loading';
  splash.innerHTML = '<div class="splash-spinner"></div>';
  document.body.appendChild(splash);
  
  // Remove splash screen after app loads or timeout
  const removeSplash = () => {
    const splashElement = document.querySelector('.splash-loading');
    if (splashElement) {
      splashElement.style.opacity = '0';
      splashElement.style.transition = 'opacity 0.3s ease-out';
      setTimeout(() => {
        if (splashElement.parentNode) {
          splashElement.parentNode.removeChild(splashElement);
        }
      }, 300);
    }
  };
  
  // Set a maximum time for the splash screen
  setTimeout(removeSplash, 3000);
  
  // Hide splash when app signals it's ready
  window.addEventListener('app-ready', removeSplash);
};

// Register service worker for offline support and caching
const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.log('ServiceWorker registration successful');
        })
        .catch(error => {
          console.error('ServiceWorker registration failed:', error);
        });
    });
  }
};

// Initialize with enhanced loading process
const initApp = () => {
  // Prepare for hydration with loading indicator
  prepareForHydration();
  
  // Detect browser capabilities for better UX
  const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  const isLowEndDevice = !window.matchMedia('(min-resolution: 2dppx)').matches || 
                         (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
  
  // Set up global performance settings
  window.appSettings = {
    prefersReducedMotion,
    isMobile,
    isLowEndDevice,
    isHighPerformance: !prefersReducedMotion && !isMobile && !isLowEndDevice,
    initialLoadTime: performance.now()
  };
  
  // Create and mount the React root with StrictMode for better development experience
  const root = ReactDOM.createRoot(document.getElementById("root"));
  
  // Avoid StrictMode double-rendering in production for better performance
  if (process.env.NODE_ENV === 'development') {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } else {
    root.render(<App />);
  }
  
  // Register service worker for production only
  if (process.env.NODE_ENV === 'production') {
    registerServiceWorker();
  }
  
  // Signal that the app is ready for critical path rendering
  window.dispatchEvent(new CustomEvent('app-ready'));
};

// Start the application
initApp();

// Add dynamic resource hints for better loading
const addResourceHints = () => {
  // Add preconnect for external resources
  const preconnectHosts = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://api.web3forms.com'
  ];
  
  preconnectHosts.forEach(host => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = host;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

// Run resource hints in idle time
if ('requestIdleCallback' in window) {
  requestIdleCallback(addResourceHints);
} else {
  setTimeout(addResourceHints, 1000);
}