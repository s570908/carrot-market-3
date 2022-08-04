/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    reactRoot: true,
    runtime: "nodejs",
    serverComponents: true,
  },
  images: {
    domains: [
      "imagedelivery.net",
      "videodelivery.net",
      "raw.githubusercontent.com",
    ],
  },
};

module.exports = nextConfig;
