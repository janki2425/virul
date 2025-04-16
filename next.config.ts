// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: '342b-110-226-17-132.ngrok-free.app',
//         port: '',
//         pathname: '/uploads/**', // Allows any path under /uploads
//       },
//     ],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const ngrokHost = process.env.NGROK_URL || '342b-110-226-17-132.ngrok-free.app';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Move unoptimized here inside the 'images' config
    remotePatterns: [
      {
        protocol: 'https',
        hostname: ngrokHost,
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
