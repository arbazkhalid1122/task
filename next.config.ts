import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Next 16 uses top-level `turbopack`, not `experimental.turbo`.
  turbopack: {
    resolveAlias: {
      'next-intl/config': './i18n/request.ts'
    }
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'next-intl/config': path.resolve(process.cwd(), './i18n/request.ts')
    };
    return config;
  }
};

export default nextConfig;
