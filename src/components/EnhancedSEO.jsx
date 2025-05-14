"use client";

import Head from 'next/head';
import { useRouter } from 'next/router';

/**
 * Enhanced SEO Component with Schema.org structured data
 * 
 * @param {Object} props - SEO properties
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - Comma-separated keywords
 * @param {string} props.canonical - Canonical URL (optional)
 * @param {string} props.ogImage - Open Graph image URL (optional)
 * @param {string} props.ogType - Open Graph type (optional)
 * @param {string} props.twitterHandle - Twitter handle (optional)
 */
const EnhancedSEO = ({
  title = "Mohammed Sadhef | Full Stack Developer | MERN Stack & Python",
  description = "Full Stack Developer specializing in MERN Stack (MongoDB, Express.js, React.js, Node.js), Python, JavaScript, and AI integration. Building responsive web applications and enterprise solutions.",
  keywords = "Full Stack Developer, MERN Stack, React.js, Node.js, MongoDB, Express.js, Python, JavaScript, AI Integration, Web Development, Portfolio",
  canonical,
  ogImage = "https://sadhef.info/sadhefportfolio.webp",
  ogType = "website",
  twitterHandle = "@mohdsadhef",
  structuredData = {}
}) => {
  const router = useRouter();
  
  // Set custom canonical URL based on current path
  const baseUrl = 'https://sadhef.info';
  const path = router.asPath;
  const canonicalUrl = canonical || `${baseUrl}${path === '/' ? '' : path}`;
  
  // Default structured data for person
  const defaultPersonData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': 'Mohammed Sadhef',
    'url': 'https://sadhef.info',
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
      'Web Development'
    ],
    'sameAs': [
      'https://github.com/mohdsadhef',
      'https://linkedin.com/in/mohdsadhef',
      'https://twitter.com/mohdsadhef'
    ],
    'alumniOf': {
      '@type': 'EducationalOrganization',
      'name': 'KTU'
    }
  };
  
  // Default structured data for website
  const defaultWebsiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'url': 'https://sadhef.info',
    'name': 'Mohammed Sadhef - Full Stack Developer Portfolio',
    'description': description,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://sadhef.info/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    'author': {
      '@type': 'Person',
      'name': 'Mohammed Sadhef'
    },
    'audience': {
      '@type': 'Audience',
      'audienceType': 'Employers, Clients, Recruiters'
    }
  };
  
  // Breadcrumbs structured data
  const breadcrumbsData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://sadhef.info'
      }
    ]
  };
  
  // Add current page to breadcrumbs if not home
  if (path !== '/' && path !== '') {
    const pathParts = path.split('/').filter(part => part !== '');
    
    let currentPath = '';
    pathParts.forEach((part, index) => {
      currentPath += `/${part}`;
      breadcrumbsData.itemListElement.push({
        '@type': 'ListItem',
        'position': index + 2,
        'name': part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
        'item': `https://sadhef.info${currentPath}`
      });
    });
  }
  
  // Merge provided structured data with defaults
  const mergedStructuredData = {
    person: { ...defaultPersonData, ...structuredData.person },
    website: { ...defaultWebsiteData, ...structuredData.website },
    breadcrumbs: { ...breadcrumbsData, ...structuredData.breadcrumbs }
  };
  
  // Handle specific page types
  if (path.includes('/blog/') && structuredData.article) {
    mergedStructuredData.article = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      'headline': title,
      'description': description,
      'image': ogImage,
      'url': canonicalUrl,
      'datePublished': new Date().toISOString(),
      'dateModified': new Date().toISOString(),
      'author': {
        '@type': 'Person',
        'name': 'Mohammed Sadhef',
        'url': 'https://sadhef.info'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'Mohammed Sadhef',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://sadhef.info/sadhefportfolio.webp'
        }
      },
      ...structuredData.article
    };
  }
  
  // Portfolio as creative work
  mergedStructuredData.creativeWork = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    'name': 'Mohammed Sadhef\'s Portfolio',
    'creator': {
      '@type': 'Person',
      'name': 'Mohammed Sadhef'
    },
    'dateCreated': '2025-05-01',
    'dateModified': new Date().toISOString(),
    'keywords': keywords,
    'description': description,
    ...structuredData.creativeWork
  };
  
  return (
    <Head>
      {/* Essential Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Mohammed Sadhef" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* OpenGraph Meta Tags for Social Media */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Mohammed Sadhef Portfolio" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Technical SEO */}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      
      {/* Mobile Optimization */}
      <meta name="theme-color" content="#000000" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      
      {/* Language and Locale */}
      <meta property="og:locale" content="en_US" />
      <meta httpEquiv="content-language" content="en" />
      
      {/* JSON-LD structured data */}
      {Object.values(mergedStructuredData).map((data, index) => (
        <script
          key={`structured-data-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </Head>
  );
};

export default EnhancedSEO;