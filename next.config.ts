import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: [
    "192.168.88.184",
    "192.168.*.*",
    "10.*.*.*",
  ],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
  async rewrites() {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return [];
    }

    const apiProxy =
      process.env.API_PROXY_URL?.replace(/\/$/, "") ??
      "http://localhost:3001";

    return [
      {
        source: "/api/:path*",
        destination: `${apiProxy}/:path*`,
      },
    ];
  },
};

export default nextConfig;
