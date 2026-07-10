import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  experimental: {
    // Inline the (small) global stylesheet into the HTML so first paint
    // isn't blocked by a render-blocking CSS request.
    inlineCss: true,
  },
};

export default nextConfig;
