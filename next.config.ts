import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "*.kakaocdn.net",
      },
      {
        protocol: "https",
        hostname: "*.kakaocdn.net",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
