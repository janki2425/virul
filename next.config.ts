import type { NextConfig } from "next";

const ngrokHost = '27b4-122-173-64-102.ngrok-free.app';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [ngrokHost],
  },
};

export default nextConfig;
