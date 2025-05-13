/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    domains: ['randomuser.me'],
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_EMAILJS_SERVICE_ID: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
    NEXT_PUBLIC_EMAILJS_TEMPLATE_ID: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
    NEXT_PUBLIC_EMAILJS_USER_ID: process.env.NEXT_PUBLIC_EMAILJS_USER_ID
  },
  swcMinify: true,
  webpack(config) {
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