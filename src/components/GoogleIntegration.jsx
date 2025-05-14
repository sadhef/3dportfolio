"use client";

import Script from 'next/script';

/**
 * Component to integrate Google Analytics and Google Search Console
 * This helps track user activity and verify your site with Google Search Console
 */
const GoogleIntegration = () => {
  // Replace with your actual Google Analytics ID
  const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
  
  // Replace with your Google Search Console verification code
  const GOOGLE_SITE_VERIFICATION = '6dHere04zWwdIbbG8NaRGrqNNJUdgzJqMI_U63Co14g';
  
  return (
    <>
      {/* Google Search Console Verification - will be added to <head> */}
      <meta name="google-site-verification" content={GOOGLE_SITE_VERIFICATION} />
      
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              cookie_flags: 'SameSite=None;Secure',
              anonymize_ip: true,
              cookie_expires: 0,  // Session cookies
              send_page_view: true
            });
          `
        }}
      />
      
      {/* LD+JSON for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://sadhef.info/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://sadhef.info/search?q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      
      {/* Add Google Search Console mechanism for page indexing */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Notify Google of client-side route changes
            if (typeof window !== 'undefined') {
              const originalPushState = history.pushState;
              history.pushState = function() {
                originalPushState.apply(this, arguments);
                
                // Notify Google Analytics about the page change
                if (typeof gtag === 'function') {
                  const newPath = arguments[2];
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: newPath
                  });
                  
                  // Add ping to Google for faster indexing (optional)
                  // const pingUrl = 'https://www.google.com/ping?sitemap=https://sadhef.info/sitemap.xml';
                  // navigator.sendBeacon && navigator.sendBeacon(pingUrl);
                }
              };
              
              // Attach to navigation events
              window.addEventListener('beforeunload', function() {
                gtag('event', 'timing_complete', {
                  name: 'page_exit',
                  value: Math.round(performance.now()),
                  event_category: 'Page Lifecycle'
                });
              });
            }
          `
        }}
      />
    </>
  );
};

export default GoogleIntegration;