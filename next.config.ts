import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silences the "multiple lockfiles" warning by pinning the project root
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
