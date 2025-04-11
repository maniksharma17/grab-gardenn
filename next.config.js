/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    images: {
      domains: ['grabgardenn-storage.s3.ap-south-1.amazonaws.com'],
    },
   },
   
};

module.exports = nextConfig;
