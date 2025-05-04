import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = () => {
  return (
    <Helmet>
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
            'MERN Stack',
            'React.js',
            'Node.js',
            'MongoDB',
            'Express.js',
            'JavaScript',
            'Python',
            'Docker',
            'Kubernetes',
            'AI Integration'
          ],
          'sameAs': [
            'https://github.com/yourgithub', // Replace with your actual profiles
            'https://linkedin.com/in/yourlinkedin'
          ]
        })}
      </script>
      
      {/* JSON-LD structured data for WebSite */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'url': 'https://sadhef.info',
          'name': 'Mohammed Sadhef - Full Stack Developer Portfolio',
          'description': 'Portfolio website of Mohammed Sadhef, a Full Stack Developer specializing in MERN Stack, Python, and JavaScript development.',
          'potentialAction': {
            '@type': 'SearchAction',
            'target': 'https://sadhef.info/search?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEO;