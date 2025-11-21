/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'output: export' for Vercel deployment
  // Use standard Next.js deployment
  images: {
    unoptimized: true,
  },
  // Disable type checking during build (faster builds)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
