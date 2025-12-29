import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',

  // These should be empty for a `username.github.io` repository
  basePath: '',
  assetPrefix: '',

  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;