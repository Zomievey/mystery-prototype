// next.config.ts
import type { NextConfig } from "next";
import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV !== "production";

// Configure the PWA plugin (plugin options ONLY)
const withPWAMiddleware = withPWA({
  dest: "public",
  disable: isDev, // SW only in prod
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: ({ request }: { request: Request }) =>
        request.destination === "document",
      handler: "NetworkFirst",
      options: { cacheName: "pages" },
    },
    {
      urlPattern: ({ request }: { request: Request }) =>
        ["style", "script", "worker"].includes(request.destination),
      handler: "StaleWhileRevalidate",
      options: { cacheName: "assets" },
    },
    {
      urlPattern: ({ request }: { request: Request }) =>
        ["image", "font"].includes(request.destination),
      handler: "CacheFirst",
      options: {
        cacheName: "static",
        expiration: { maxEntries: 128, maxAgeSeconds: 60 * 60 * 24 * 30 },
      },
    },
  ],
});

// Next's own config (this is where images belongs)
const nextConfig: NextConfig = {
  images: {
    // either one of these would work; keeping both is fine
    remotePatterns: [
      { protocol: "https", hostname: "themealdb.com", pathname: "/**" },
      { protocol: "https", hostname: "www.themealdb.com", pathname: "/**" },
    ],
    // OR: domains: ["themealdb.com", "www.themealdb.com"],
  },
};

export default withPWAMiddleware(nextConfig as any);
