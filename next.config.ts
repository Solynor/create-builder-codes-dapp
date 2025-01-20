import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  experimental: {
    turbo: {
      rules: {
        // External modules that need to be excluded
        external: {
          loaders: ["pino-pretty", "lokijs", "encoding"],
        },
      },
    },
  },
};

export default nextConfig;
