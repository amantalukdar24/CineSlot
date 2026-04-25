import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig = {
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
  output: "export",
  images: {
    unoptimized: true,   
  }
};

module.exports = nextConfig;