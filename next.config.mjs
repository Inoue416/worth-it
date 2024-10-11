/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
      APP_URL: process.env.APP_URL,
  },
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
};
export default nextConfig;
