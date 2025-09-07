import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  /**
   * Set the base path to '/<repo-name>' for GitHub Pages.
   *
   * @see https://nextjs.org/docs/pages/api-reference/next-config-js/basePath
   */
  basePath: isProd ? `/${repoName}` : '',

  /**
   * Set the asset prefix to '/<repo-name>' for GitHub Pages.
   *
   * @see https://nextjs.org/docs/pages/api-reference/next-config-js/assetPrefix
   */
  assetPrefix: isProd ? `/${repoName}` : '',

  // React's Strict Mode is a good practice.
  reactStrictMode: true,

  /**
   * Disable server-based image optimization. Next.js' default image optimization
   * is not compatible with static exports.
   *
   * @see https://nextjs.org/docs/pages/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;