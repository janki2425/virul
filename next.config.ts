import type { NextConfig } from "next";

const ngrokHost = '4262-2401-4900-5047-50b9-1500-9254-60f2-170a.ngrok-free.app';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [ngrokHost],
  },
};

export default nextConfig;
