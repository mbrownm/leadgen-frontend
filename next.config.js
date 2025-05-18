/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          source: '/api/leads/:path*',
          destination: 'https://leadgen-backend-5uly.onrender.com', // your backend URL
        },
      ];
    },
  };
  
  module.exports = nextConfig;
  