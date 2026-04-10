import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jfbtkaxrpupdyroetxzq.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 430, 768, 1080, 1280],
    imageSizes: [112, 200, 300, 480],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 dias
  },
  compress: true,
  experimental: {
    scrollRestoration: true,
  },
};

export default nextConfig;