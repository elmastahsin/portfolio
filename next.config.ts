import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // keep /admin/learn/ as is: its service worker and manifest scope need the trailing slash
  skipTrailingSlashRedirect: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;

