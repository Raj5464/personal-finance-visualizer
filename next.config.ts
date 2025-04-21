import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
module.exports = {
  env: {
    MONGODB_URI: process.env.MONGODB_URI, },
}
