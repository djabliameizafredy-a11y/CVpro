import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow the sandbox preview proxy origin to serve /_next/* assets (HMR, chunks)
  allowedDevOrigins: ["*.space-z.ai", "*.chat.z.ai", "localhost"],
};

export default nextConfig;
