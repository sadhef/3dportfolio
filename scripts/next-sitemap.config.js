module.exports = {
  siteUrl: 'https://sadhef.info',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  outDir: 'public',
  changefreq: 'monthly',
  priority: 0.7,
  exclude: ['/404'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://sadhef.info/sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  transform: async (config, path) => {
    // Custom priority based on path
    let priority = 0.7;
    
    if (path === '/') {
      priority = 1.0;
    } else if (path.includes('projects') || path.includes('works')) {
      priority = 0.9;
    } else if (path.includes('about') || path.includes('contact')) {
      priority = 0.8;
    }
    
    // Return object with modified values
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: priority,
      lastmod: new Date().toISOString(),
    };
  },
};