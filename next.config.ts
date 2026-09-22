import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  webpack(config) {
    config.cache = false;
    return config;
  },
  images: { unoptimized: true },
  experimental: {
    cpus: 1,
    webpackBuildWorker: false,
    webpackMemoryOptimizations: true,
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
