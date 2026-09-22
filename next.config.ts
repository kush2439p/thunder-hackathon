import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  basePath: isGitHubPages ? "/thunder-hackathon" : undefined,
  assetPrefix: isGitHubPages ? "/thunder-hackathon/" : undefined,
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
