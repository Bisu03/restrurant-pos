const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
});

const nextConfig = withPWA({
  experimental: {
    serverActions: true, // Ensure compatibility with Next.js 14 features
  },
  reactStrictMode: true,
});

module.exports = nextConfig;
