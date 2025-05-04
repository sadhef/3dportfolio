// generateSitemap.js - ES Module version
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

// Define your sitemap structure
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

// Write sitemap to file
try {
  // For Vite, we need to write to the public directory
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
} catch (err) {
  console.error('Error generating sitemap:', err);
}