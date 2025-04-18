import type { NextConfig } from "next";

const ngrokHost = 'f7fc-110-226-17-132.ngrok-free.app';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [ngrokHost],
  },
};

export default nextConfig;
