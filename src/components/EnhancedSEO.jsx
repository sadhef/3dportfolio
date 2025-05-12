import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

// Enhanced SEO component with comprehensive optimizations
const EnhancedSEO = () => {
  // Set custom canonical URL based on current path
  const path = window.location.pathname;
  const baseUrl = 'https://sadhef.info';
  const canonicalUrl = `${baseUrl}${path === '/' ? '' : path}`;
  
  // Dynamic device detection for SEO optimization
  useEffect(() => {
    // Add viewport-specific meta tags
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=5';
      document.head.appendChild(meta);
    }
    
    // Add preload hints for critical resources
    const addPreloadHints = () => {
      const criticalResources = [
        { href: '/fonts/poppins-v20-latin-regular.woff2', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' },
        { href: '/sadhefportfolio.webp', as: 'image' }
      ];
      
      criticalResources.forEach(resource => {
        const existingLink = document.querySelector(`link[href="${resource.href}"][rel="preload"]`);
        if (!existingLink) {
          const link = document.createElement('link');
          link.rel = 'preload';
          link.href = resource.href;
          link.as = resource.as;
          if (resource.type) link.type = resource.type;
          if (resource.crossOrigin) link.crossOrigin = resource.crossOrigin;
          document.head.appendChild(link);
        }
      });
    };
    
    // Add preconnect hints for external domains
    const addPreconnectHints = () => {
      const domains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://api.web3forms.com'
      ];
      
      domains.forEach(domain => {
        const existingLink = document.querySelector(`link[href="${domain}"][rel="preconnect"]`);
        if (!existingLink) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = domain;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      });
    };
    
    // Execute optimizations in idle time to not block rendering
    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        addPreloadHints();
        addPreconnectHints();
      });
    } else {
      setTimeout(() => {
        addPreloadHints();
        addPreconnectHints();
      }, 1);
    }
  }, []);

  return (
    <Helmet>
      {/* Base SEO tags with optimized information */}
      <meta name="theme-color" content="#000000" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Language and content type declaration */}
      <html lang="en" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

      {/* Enhanced mobile optimizations */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="Mohammed Sadhef Portfolio" />
      <meta name="application-name" content="Mohammed Sadhef Portfolio" />

      {/* Performance optimizations */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      
      {/* Enhanced description and keywords for better SEO */}
      <meta 
        name="description" 
        content="Mohammed Sadhef - Experienced Full Stack Developer specializing in MERN Stack (MongoDB, Express, React, Node.js), Python, JavaScript, and AI integration. View my portfolio showcasing responsive, interactive web applications with 3D elements and modern design."
      />
      <meta 
        name="keywords" 
        content="Mohammed Sadhef, Full Stack Developer, MERN Stack, React.js, Node.js, MongoDB, Express.js, Python, JavaScript, Web Developer, 3D Portfolio, ThreeJS, Frontend Developer, Backend Developer, AI Integration"
      />

      {/* Open Graph / Social Media Meta Tags - Enhanced for engagement */}
      <meta property="og:title" content="Mohammed Sadhef | Full Stack Developer" />
      <meta 
        property="og:description" 
        content="Full Stack Developer specializing in MERN Stack, Python, JavaScript and 3D web experiences. View my interactive portfolio showcasing modern web applications with responsive design."
      />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${baseUrl}/sadhefportfolio.webp`} />
      <meta property="og:image:alt" content="Mohammed Sadhef - Full Stack Developer Portfolio" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Mohammed Sadhef Portfolio" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card data - Enhanced for better previews */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Mohammed Sadhef | Full Stack Developer" />
      <meta 
        name="twitter:description" 
        content="Explore my portfolio featuring MERN Stack, Python & 3D interactive web experiences. Full Stack Developer with expertise in modern web technologies."
      />
      <meta name="twitter:image" content={`${baseUrl}/sadhefportfolio.webp`} />
      <meta name="twitter:image:alt" content="Mohammed Sadhef - Portfolio Preview" />

      {/* JSON-LD structured data - Enhanced with more detail */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          'name': 'Mohammed Sadhef',
          'url': baseUrl,
          'jobTitle': 'Full Stack Developer',
          'worksFor': {
            '@type': 'Organization',
            'name': 'Biztras'
          },
          'knowsAbout': [
            'MERN Stack Development',
            'React.js',
            'Node.js',
            'MongoDB',
            'Express.js',
            'JavaScript',
            'Python',
            'Docker',
            'Kubernetes',
            'AI Integration',
            'Full Stack Development',
            'Web Development',
            '3D Web Development',
            'Responsive Design',
            'ThreeJS',
            'React Three Fiber'
          ],
          'sameAs': [
            'https://github.com/mohdsadhef',
            'https://linkedin.com/in/mohdsadhef',
            'https://twitter.com/mohdsadhef'
          ],
          'alumniOf': {
            '@type': 'EducationalOrganization',
            'name': 'KTU'
          },
          'hasOccupation': {
            '@type': 'Occupation',
            'name': 'Full Stack Developer',
            'occupationLocation': {
              '@type': 'City',
              'name': 'Kochi'
            },
            'description': 'Develops modern web applications with responsive design, 3D elements and interactive user experiences.',
            'skills': 'MERN Stack, Python, JavaScript, ThreeJS, Responsive Design, API Integration, Cloud Deployment'
          }
        })}
      </script>
      
      {/* Enhanced JSON-LD for WebSite */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'url': baseUrl,
          'name': 'Mohammed Sadhef - Full Stack Developer Portfolio',
          'description': 'Portfolio of Mohammed Sadhef, a Full Stack Developer specializing in MERN Stack, Python, JavaScript, and 3D web experiences.',
          'potentialAction': {
            '@type': 'SearchAction',
            'target': {
              '@type': 'EntryPoint',
              'urlTemplate': `${baseUrl}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          },
          'author': {
            '@type': 'Person',
            'name': 'Mohammed Sadhef'
          },
          'audience': {
            '@type': 'Audience',
            'audienceType': 'Employers, Clients, Recruiters, Developers'
          },
          'datePublished': '2025-01-01',
          'dateModified': '2025-05-13',
          'inLanguage': 'en-US',
          'isFamilyFriendly': 'true',
          'copyrightYear': '2025',
          'mainEntity': {
            '@type': 'ItemList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'About',
                'url': `${baseUrl}#about`
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Experience',
                'url': `${baseUrl}#work`
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': 'Projects',
                'url': `${baseUrl}#projects`
              },
              {
                '@type': 'ListItem',
                'position': 4,
                'name': 'Contact',
                'url': `${baseUrl}#contact`
              }
            ]
          }
        })}
      </script>

      {/* Breadcrumbs for better navigation and SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': baseUrl
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'About',
              'item': `${baseUrl}#about`
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': 'Work Experience',
              'item': `${baseUrl}#work`
            },
            {
              '@type': 'ListItem',
              'position': 4,
              'name': 'Projects',
              'item': `${baseUrl}#projects`
            },
            {
              '@type': 'ListItem',
              'position': 5,
              'name': 'Contact',
              'item': `${baseUrl}#contact`
            }
          ]
        })}
      </script>
      
      {/* Add JSON-LD for each project for better SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Collection',
          'name': 'Mohammed Sadhef\'s Portfolio Projects',
          'description': 'A collection of web development projects showcasing expertise in MERN stack, Python, JavaScript, and 3D web applications.',
          'url': `${baseUrl}#projects`
        })}
      </script>
    </Helmet>
  );
};

export default EnhancedSEO;