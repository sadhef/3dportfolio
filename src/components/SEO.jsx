import Head from 'next/head';

const SEO = ({
  title = "Mohammed Sadhef | Full Stack Developer | MERN Stack & Python",
  description = "Full Stack Developer specializing in MERN Stack (MongoDB, Express.js, React.js, Node.js), Python, JavaScript, and AI integration. Building responsive web applications and enterprise solutions.",
  keywords = "Full Stack Developer, MERN Stack, React.js, Node.js, MongoDB, Express.js, Python, JavaScript, AI Integration, Web Development, Portfolio",
  canonical = "https://sadhef.info",
  image = "https://sadhef.info/sadhefportfolio.webp",
  author = "Mohammed Sadhef",
  type = "website"
}) => {
  // Set custom canonical URL based on current path
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const baseUrl = 'https://sadhef.info';
  const canonicalUrl = `${baseUrl}${path === '/' ? '' : path}`;
  
  return (
    <Head>
      {/* Essential Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* OpenGraph Meta Tags for Social Media */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Mohammed Sadhef Portfolio" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@mohdsadhef" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Technical SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      
      {/* Mobile Optimization */}
      <meta name="theme-color" content="#000000" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      
      {/* JSON-LD structured data for Person */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          })
        }}
      />
      
      {/* JSON-LD structured data for WebSite */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          })
        }}
      />

      {/* JSON-LD for Portfolio as CreativeWork */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            'name': 'Mohammed Sadhef\'s Portfolio',
            'creator': {
              '@type': 'Person',
              'name': 'Mohammed Sadhef'
            },
            'dateCreated': '2025-05-01',
            'dateModified': '2025-05-14',
            'keywords': keywords,
            'description': description
          })
        }}
      />

      {/* Breadcrumbs for better site navigation */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          })
        }}
      />
    </Head>
  );
};

export default SEO;