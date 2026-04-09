import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jfbtkaxrpupdyroetxzq.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**', // Permite acesso apenas aos arquivos públicos do seu bucket
      },
    ],
  },
};

export default nextConfig;