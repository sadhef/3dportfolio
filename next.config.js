/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export
  output: 'export',
  
  // Configure image domains for external images if needed
  images: {
    domains: ['randomuser.me'], // Add more domains if needed
    unoptimized: true, // Required for static export
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    NEXT_PUBLIC_EMAILJS_USER_ID: process.env.NEXT_PUBLIC_EMAILJS_USER_ID
  },
  
  // Enable SWC minification
  swcMinify: true,
  
  // Configure redirects
  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/mohdsadhef',
        permanent: true,
      },
      {
        source: '/linkedin',
        destination: 'https://linkedin.com/in/mohdsadhef',
        permanent: true,
      }
    ];
  },
  
  // Add headers for optimization and security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
        ],
      },
    ];
  },
  
  // Configure webpack
  webpack(config) {
    // Handle GLTF and GLB files
    config.module.rules.push({
      test: /\.(gltf|glb)$/,
      use: {
        loader: 'file-loader',
      },
    });
    
    return config;
  },
};

module.exports = nextConfig;