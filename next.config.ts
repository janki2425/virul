import type { NextConfig } from "next";

const ngrokHost = '2d00-122-171-141-176.ngrok-free.app';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [ngrokHost],
  },
};

export default nextConfig;
