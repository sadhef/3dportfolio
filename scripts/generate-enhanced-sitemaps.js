import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory path in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update with your website URL
const BASE_URL = 'https://sadhef.info';

// Get current date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Sample blog posts - in a real implementation, these would come from a database or CMS
const blogPosts = [
  {
    slug: 'modern-mern-stack',
    publishDate: '2025-05-10',
    updateDate: '2025-05-10',
    priority: 0.9
  },
  {
    slug: 'python-ai-integration',
    publishDate: '2025-04-25',
    updateDate: '2025-05-05',
    priority: 0.9
  },
  {
    slug: 'three-js-optimization',
    publishDate: '2025-04-12',
    updateDate: '2025-04-20',
    priority: 0.8
  },
  {
    slug: 'full-stack-development-best-practices',
    publishDate: '2025-03-28',
    updateDate: '2025-04-15',
    priority: 0.8
  },
  {
    slug: 'dockerizing-mern-applications',
    publishDate: '2025-03-15',
    updateDate: '2025-04-10',
    priority: 0.8
  },
  {
    slug: 'nextjs-vs-react-for-portfolio',
    publishDate: '2025-02-27',
    updateDate: '2025-03-20',
    priority: 0.7
  },
  {
    slug: 'mongodb-performance-tuning',
    publishDate: '2025-02-10',
    updateDate: '2025-03-01',
    priority: 0.7
  }
];

// Blog sitemap with article schema
const generateBlogSitemap = () => {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">

  <!-- Blog index page -->
  <url>
    <loc>${BASE_URL}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;

  // Add each blog post to the sitemap
  blogPosts.forEach(post => {
    sitemap += `
  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.updateDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${post.priority}</priority>
    <news:news>
      <news:publication>
        <news:name>Mohammed Sadhef Blog</news:name>
        <news:language>en</news:language>
      </news:publication>
      <news:publication_date>${post.publishDate}</news:publication_date>
      <news:title>${post.slug.replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</news:title>
    </news:news>
    <image:image>
      <image:loc>${BASE_URL}/blog/${post.slug}.webp</image:loc>
      <image:title>${post.slug.replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase())}</image:title>
    </image:image>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
};

// Generate site-wide sitemap
const generateMainSitemap = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!-- Homepage -->
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Main Sections -->
  <url>
    <loc>${BASE_URL}/#about</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${BASE_URL}/#work</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${BASE_URL}/#projects</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>${BASE_URL}/#contact</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${BASE_URL}/#blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <!-- Blog main page -->
  <url>
    <loc>${BASE_URL}/blog</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;
};

// Generate sitemap index file
const generateSitemapIndex = () => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${BASE_URL}/blog-sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
};

// Write sitemaps to files
try {
  // For Next.js, we need to write to the public directory
  const publicDir = path.join(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  // Write the main sitemap
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), generateMainSitemap());
  console.log('Main sitemap generated successfully!');
  
  // Write the blog sitemap
  fs.writeFileSync(path.join(publicDir, 'blog-sitemap.xml'), generateBlogSitemap());
  console.log('Blog sitemap generated successfully!');
  
  // Write the sitemap index
  fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), generateSitemapIndex());
  console.log('Sitemap index generated successfully!');
} catch (err) {
  console.error('Error generating sitemaps:', err);
}