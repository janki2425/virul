import type { NextConfig } from "next";

const ngrokHost = 'c4c6-122-171-141-176.ngrok-free.app';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [ngrokHost],
  },
};

export default nextConfig;
