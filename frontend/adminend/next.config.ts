import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingExcludes: {
      "**/*": [
        "public/uploads/**",
        "public/bigfiles/**",
        "public/temp/**",
        "public/*.pdf",
        "public/videos/**",
        "node_modules/sharp/**",
      ],
    },
  },
  images: {
    unoptimized: true,   
  }
};

module.exports = nextConfig;

