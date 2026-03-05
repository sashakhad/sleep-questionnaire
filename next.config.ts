import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Prevent algorithm source maps from being served to the browser in production.
  // This is the default, but made explicit to guard against accidental overrides.
  productionBrowserSourceMaps: false,
};

export default nextConfig;
