import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Çoklu lockfile uyarısını sustur — workspace root bu klasör
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
