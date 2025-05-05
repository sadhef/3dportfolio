import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = () => {
  // Set custom canonical URL based on current path
  const path = window.location.pathname;
  const baseUrl = 'https://sadhef.info';
  const canonicalUrl = `${baseUrl}${path === '/' ? '' : path}`;
  
  return (
    <Helmet>
      {/* Base SEO tags */}
      <meta name="theme-color" content="#000000" />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Language and content type declaration */}
      <html lang="en" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

      {/* Mobile optimization */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />

      {/* JSON-LD structured data for Person */}
      <script type="application/ld+json">
        {JSON.stringify({
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
            'https://github.com/mohdsadhef', // Update with your actual profiles
            'https://linkedin.com/in/mohdsadhef',
            'https://twitter.com/mohdsadhef'
          ],
          'alumniOf': {
            '@type': 'EducationalOrganization',
            'name': 'KTU' // Replace with your education details
          }
        })}
      </script>
      
      {/* JSON-LD structured data for WebSite */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'url': 'https://sadhef.info',
          'name': 'Mohammed Sadhef - Full Stack Developer Portfolio',
          'description': 'Portfolio of Mohammed Sadhef, a Full Stack Developer specializing in MERN Stack, Python, JavaScript, and AI integration.',
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
        })}
      </script>

      {/* JSON-LD for Portfolio as CreativeWork */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          'name': 'Mohammed Sadhef\'s Portfolio',
          'creator': {
            '@type': 'Person',
            'name': 'Mohammed Sadhef'
          },
          'dateCreated': '2025-01-01', // Update to accurate date
          'dateModified': '2025-05-01', // Update to accurate date
          'keywords': 'web development, MERN stack, full stack developer, React, Node.js, MongoDB, Express.js, Python, JavaScript',
          'description': 'A collection of web development projects created by Mohammed Sadhef, showcasing expertise in MERN stack, Python, and JavaScript.'
        })}
      </script>

      {/* Breadcrumbs for better site navigation */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://sadhef.info'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Projects',
              'item': 'https://sadhef.info/#projects'
            },
            {
              '@type': 'ListItem',
              'position': 3,
              'name': 'Contact',
              'item': 'https://sadhef.info/#contact'
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;