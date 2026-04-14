import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "beescare.rs",
      },
      {
        protocol: "https",
        hostname: "*.beescare.rs",
      },
    ],
  },
};

export default nextConfig;
