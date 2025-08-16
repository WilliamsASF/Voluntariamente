import type { Configuration } from 'webpack';
import path from 'path';

const nextConfig = {
  env: {
    PORT: '3000',
  },
};

module.exports = {
  ...nextConfig,
  webpack: (config: Configuration) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@lib': path.resolve(__dirname, 'lib'),
    };

    return config;
  },
};