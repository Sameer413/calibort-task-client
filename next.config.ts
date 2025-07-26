import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { hostname: "reqres.in" },
      { hostname: "res.cloudinary.com" }
    ]
  }
};

export default nextConfig;
