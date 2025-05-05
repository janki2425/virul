import type { NextConfig } from "next";

const ngrokHost = '95cf-106-202-207-63.ngrok-free.app';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [ngrokHost],
  },
};

export default nextConfig;
