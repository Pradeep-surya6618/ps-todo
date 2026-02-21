import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  customWorkerSrc: "service-worker",
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: false,
  turbopack: {},
  webpack: (config, { dev }) => {
    if (dev) {
      const oldIgnored = config.watchOptions?.ignored;
      const ignored = Array.isArray(oldIgnored) ? oldIgnored : [];
      config.watchOptions = {
        ...config.watchOptions,
        ignored: [...ignored, "**/public/sw.js", "**/public/workbox-*.js"],
      };
    }
    return config;
  },
};

export default withPWA(nextConfig);
