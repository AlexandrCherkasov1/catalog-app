import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ohotaktiv.ru",
      },
      {
        protocol: "https",
        hostname: "img.ohotaktiv.ru",
      },
    ],
  },
};

export default nextConfig;