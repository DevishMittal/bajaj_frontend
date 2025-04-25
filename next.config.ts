import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'doctorlistingingestionpr.azureedge.net',
        port: '',
        pathname: '/**', // Allow any path under this hostname
      },
      {
        protocol: 'https',
        hostname: 'doctorlistingingestionpr.blob.core.windows.net',
        port: '',
        pathname: '/**', // Also allow the blob storage hostname seen in the API data
      },
    ],
  },
};

export default nextConfig;
