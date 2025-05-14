/* 
 * This file adds monitoring for Core Web Vitals
 * These metrics directly impact SEO rankings on Google
 */

export function reportWebVitals(metric) {
  // Log to console during development
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
  
  // In production, we can send to an analytics service
  if (process.env.NODE_ENV === 'production') {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      id: metric.id,
      startTime: metric.startTime,
      label: metric.label,
    });
    
    // Send to your analytics endpoint
    // You can use services like Google Analytics, Vercel Analytics, or custom endpoints
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/web-vitals', body);
    } else {
      fetch('/api/web-vitals', {
        body,
        method: 'POST',
        keepalive: true,
      });
    }
  }
}

/*
 * Setup for Web Vitals in your app
 *
 * How to use:
 * 1. Import this file in your _app.js or app.js
 * 2. Add the following to your page:
 *    export { reportWebVitals } from '../utils/web-vitals';
 */

// Explanation of Core Web Vitals and their importance for SEO
/**
 * Core Web Vitals are specific factors that Google considers important in a webpage's 
 * overall user experience. They are part of Google's Page Experience signals used in ranking.
 * 
 * LCP (Largest Contentful Paint):
 * - Measures loading performance
 * - Good score: 2.5 seconds or less
 * - Affects SEO: Directly impacts Google rankings
 * 
 * FID (First Input Delay):
 * - Measures interactivity
 * - Good score: 100 milliseconds or less
 * - Affects SEO: User engagement signal for rankings
 * 
 * CLS (Cumulative Layout Shift):
 * - Measures visual stability
 * - Good score: 0.1 or less
 * - Affects SEO: Poor CLS creates bad user experience which impacts rankings
 */

// Optimizations for Core Web Vitals:
/**
 * For LCP:
 * - Optimize server response times (TTFB)
 * - Remove render-blocking resources
 * - Optimize images with next/image
 * - Implement critical CSS
 * 
 * For FID:
 * - Minimize JavaScript execution time
 * - Break up long tasks
 * - Optimize event handlers
 * - Use web workers for heavy computation
 * 
 * For CLS:
 * - Always include size attributes on images and videos
 * - Reserve space for ads and embeds
 * - Avoid inserting content above existing content
 * - Preload fonts to avoid layout shifts
 */