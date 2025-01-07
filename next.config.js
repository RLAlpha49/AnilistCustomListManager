/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    //ignoreDuringBuilds: true,
  },
  typescript: {
    // Set this to true to ignore type errors during build
    //ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
