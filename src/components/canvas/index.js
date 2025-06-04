import StarsCanvas from "./Stars";
// Client-side preloading of 3D models
let preloadedModels = false;

if (typeof window !== 'undefined') {
  const preloadAllModels = () => {
    if (!preloadedModels) {
      preloadedModels = true;
    }
  };
  
  // Preload once the page is idle
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(preloadAllModels);
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(preloadAllModels, 1000);
  }
}

export {  StarsCanvas };