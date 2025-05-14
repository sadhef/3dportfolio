/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set the output directory to a static export
  output: 'export',
  // Specify the output directory that Vercel expects
  distDir: 'dist',
  // Enable static image optimization
  images: {
    domains: ['randomuser.me'],
    // Enable image optimization - essential for Core Web Vitals
    unoptimized: false,
    // Add image domains for remote images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sadhef.info',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
    ],
    // Define device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Define image sizes for srcset
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Enable higher quality format
    formats: ['image/avif', 'image/webp'],
    // Minimize image size by default
    minimumCacheTTL: 60,
    // Don't disable static images
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Environment variables
  env: {
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    NEXT_PUBLIC_EMAILJS_USER_ID: process.env.NEXT_PUBLIC_EMAILJS_USER_ID,
    NEXT_PUBLIC_SITE_URL: 'https://sadhef.info',
  },
  // Enable SWC minification for better performance
  swcMinify: true,
  // Configure webpack
  webpack(config) {
    config.module.rules.push({
      test: /\.(gltf|glb)$/,
      use: {
        loader: 'file-loader',
      },
    });
    return config;
  },
  // Configure headers for better security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
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
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Cache control for static assets
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Special headers for sitemap
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
      {
        // Special headers for blog sitemap
        source: '/blog-sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
      {
        // Special headers for robots.txt
        source: '/robots.txt',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
    ];
  },
  // Redirects for SEO
  async redirects() {
    return [
      // Redirect trailing slashes
      {
        source: '/:path+/',
        destination: '/:path+',
        permanent: true,
      },
      // Handle common URL patterns people might try
      {
        source: '/about',
        destination: '/#about',
        permanent: true,
      },
      {
        source: '/projects',
        destination: '/#projects',
        permanent: true,
      },
      {
        source: '/contact',
        destination: '/#contact',
        permanent: true,
      },
      {
        source: '/work',
        destination: '/#work',
        permanent: true,
      },
    ];
  },
  // Configure rewrites for clean URLs
  async rewrites() {
    return [
      {
        source: '/sitemap',
        destination: '/sitemap.xml',
      },
      {
        source: '/rss',
        destination: '/rss.xml',
      },
    ];
  },
  // Enable React Strict Mode for better development
  reactStrictMode: true,
  // Enable TypeScript - if you're using it
  typescript: {
    ignoreBuildErrors: false,
  },
  // Experimental features for better performance
  experimental: {
    // Optimize CSS
    optimizeCss: true,
    // Better code splitting
    optimizePackageImports: [
      'react', 
      'react-dom', 
      'framer-motion', 
      '@react-three/fiber', 
      '@react-three/drei', 
      'three'
    ],
    // Restore scroll position
    scrollRestoration: true,
    // Image optimization
    turbotrace: {
      logLevel: 'error',
    },
  },
};

module.exports = nextConfig;