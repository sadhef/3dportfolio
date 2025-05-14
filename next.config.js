/** @type {import('next').NextConfig} */
const nextConfig = {
  // Set the output directory to a static export
  output: 'export',
  // Specify the output directory that Vercel expects
  distDir: 'dist',
  // Enable image optimization
  images: {
    domains: ['randomuser.me'],
    // For static export, images must be unoptimized
    unoptimized: true,
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
  // React Strict Mode for better development
  reactStrictMode: true,
  // Experimental features for better performance
  experimental: {
    // Optimize CSS
    optimizeCss: true,
    // Restore scroll position
    scrollRestoration: true,
    // Enhanced tracing
    turbotrace: {
      logLevel: 'error',
    },
  },
};

module.exports = nextConfig;