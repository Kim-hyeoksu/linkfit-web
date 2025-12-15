import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login", // 원하는 랜딩 페이지 경로
        permanent: false, // true로 설정하면 영구 리디렉션 (301)
      },
    ];
  },
};

export default nextConfig;
