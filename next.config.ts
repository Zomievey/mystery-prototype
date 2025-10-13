import type { NextConfig } from "next";
import withPWA from "next-pwa";

const isDev = process.env.NODE_ENV !== "production";

const baseConfig: NextConfig = {
  /* next options here if you need them later */
};

export default withPWA({
  ...baseConfig,
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
