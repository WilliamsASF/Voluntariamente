import type { Configuration } from 'webpack';
import path from 'path'; // Adicione este import

const nextConfig = {
  // outras configurações...
};

module.exports = {
  ...nextConfig,
  webpack: (config: Configuration) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@lib': path.resolve(__dirname, 'lib'), // Use 'path' aqui
    };

    return config;
  },
};